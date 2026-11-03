import api from "../../../app/axios";

export const invokeAI = async ({ prompt, projectId, onEvent }) => {
    const response = await fetch(api.getUri({ url: "/invoke-ai" }), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ prompt, projectId }),
    });

    if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
    }

    if (!response.body) {
        throw new Error("Streaming is not supported by this response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const eventBlock of events) {
                if (!eventBlock.trim()) continue;

                let event = "message";
                let data = "";

                for (const line of eventBlock.split("\n")) {
                    if (line.startsWith("event:")) {
                        event = line.slice(6).trim();
                    }

                    if (line.startsWith("data:")) {
                        data += line.slice(5).trim();
                    }
                }

                if (data) {
                    let parsedData;

                    try {
                        parsedData = JSON.parse(data);
                    } catch {
                        parsedData = data;
                    }

                    onEvent?.({ event, data: parsedData });
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
};