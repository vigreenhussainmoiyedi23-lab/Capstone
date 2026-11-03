import api from "../../../app/axios";

/**
 * Invoke AI agent backend with Server-Sent Events (SSE) streaming.
 *
 * @param {Object} options
 * @param {string} options.prompt - Prompt or instruction for the AI.
 * @param {string} [options.projectId] - Optional project or sandbox identifier.
 * @param {Function} options.onEvent - Callback called with { event: string, data: any }.
 * @param {AbortSignal} [options.signal] - Optional abort signal to cancel streaming.
 * @param {string} [options.url] - Optional custom URL override.
 */
export const invokeAI = async ({ prompt, projectId, onEvent, signal, url }) => {
    const targetUrl = url || api.getUri({ url: "/invoke-ai" });

    let response;
    try {
        response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ prompt, projectId }),
            signal,
        });

        // If /invoke-ai returns 404, gracefully check /api/invoke-ai in case Vite proxy prefixes it
        if (response.status === 404 && !targetUrl.includes("/api/")) {
            try {
                const fallbackUrl = api.getUri({ url: "/api/invoke-ai" });
                const fallbackRes = await fetch(fallbackUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ prompt, projectId }),
                    signal,
                });

                if (fallbackRes.ok) {
                    response = fallbackRes;
                }
            } catch {
                // If fallback fails, proceed with the original response error handling
            }
        }
    } catch (networkErr) {
        if (networkErr.name === "AbortError") {
            throw networkErr;
        }
        throw new Error(`Network error connecting to AI server (${targetUrl}): ${networkErr.message}`);
    }

    if (!response.ok) {
        let errorDetail = `AI request failed with status: ${response.status}`;
        try {
            const errJson = await response.json();
            if (errJson.message) errorDetail = errJson.message;
            else if (errJson.error) errorDetail = errJson.error;
        } catch {
            // Not JSON
        }
        throw new Error(errorDetail);
    }

    if (!response.body) {
        throw new Error("Streaming is not supported by this server response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    const processEventBlock = (eventBlock) => {
        if (!eventBlock || !eventBlock.trim()) return;

        let eventType = "message";
        const dataLines = [];

        for (const rawLine of eventBlock.split("\n")) {
            const line = rawLine.trimEnd();
            if (!line || line.startsWith(":")) continue;

            if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
                // Remove 'data:' and optional leading space
                const val = line.startsWith("data: ") ? line.slice(6) : line.slice(5);
                dataLines.push(val);
            }
        }

        if (dataLines.length > 0) {
            const rawData = dataLines.join("\n");
            let parsedData;

            try {
                parsedData = JSON.parse(rawData);
            } catch {
                parsedData = rawData;
            }

            onEvent?.({ event: eventType, data: parsedData });
        }
    };

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Normalize CRLF
            buffer = buffer.replace(/\r\n/g, "\n");

            const eventBlocks = buffer.split("\n\n");
            // The last entry might be an incomplete chunk still being streamed
            buffer = eventBlocks.pop() || "";

            for (const block of eventBlocks) {
                processEventBlock(block);
            }
        }

        // Flush any remaining trailing block
        if (buffer.trim()) {
            processEventBlock(buffer);
        }
    } finally {
        reader.releaseLock();
    }
};
