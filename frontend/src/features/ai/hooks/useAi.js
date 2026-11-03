import { useDispatch, useSelector } from "react-redux";
import { useCallback, useRef, useState } from "react";
import {
    addMessage,
    appendUpdate,
    updateMessage,
    setComplete,
    setError,
    clearMessages,
    resetToInitial,
} from "../ai.slice";
import { invokeAI as invokeAIService } from "../services/ai.api";

export const useAI = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.ai.messages);
    const sandbox = useSelector((state) => state.sandbox);
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef(null);

    const invokeAI = useCallback(
        async ({ prompt, projectId }) => {
            if (!prompt || !prompt.trim() || isStreaming) return;

            const trimmedPrompt = prompt.trim();
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

            // 1. Add user message
            const userMessageId = crypto.randomUUID();
            dispatch(
                addMessage({
                    id: userMessageId,
                    role: "user",
                    content: trimmedPrompt,
                    timestamp: timeStr,
                    status: "complete",
                    updates: [],
                })
            );

            // 2. Add assistant message with 'streaming' status
            const assistantId = crypto.randomUUID();
            const startTime = Date.now();
            dispatch(
                addMessage({
                    id: assistantId,
                    role: "assistant",
                    content: "",
                    timestamp: timeStr,
                    status: "streaming",
                    updates: [],
                    currentStep: "Thinking...",
                    startTime,
                })
            );

            const abortController = new AbortController();
            abortControllerRef.current = abortController;
            setIsStreaming(true);

            let hasReceivedComplete = false;
            let finalContentRecorded = "";

            // Use passed projectId, or fallback to sandboxId, or default
            const resolvedProjectId = projectId || sandbox?.sandboxId || "default-project";

            try {
                await invokeAIService({
                    prompt: trimmedPrompt,
                    projectId: resolvedProjectId,
                    signal: abortController.signal,
                    onEvent: ({ event, data }) => {
                        if (event === "update") {
                            let updateText = "";
                            if (typeof data === "string") {
                                updateText = data.trim();
                            } else if (data && typeof data === "object") {
                                updateText = (data.content || data.chunk || data.message || data.text || data.update || "").trim();
                            }

                            if (updateText) {
                                dispatch(
                                    appendUpdate({
                                        id: assistantId,
                                        update: updateText,
                                    })
                                );
                            }
                        } else if (event === "complete") {
                            hasReceivedComplete = true;

                            let parsedContent = "";
                            if (typeof data === "string") {
                                try {
                                    const parsed = JSON.parse(data);
                                    parsedContent = parsed.response || parsed.content || parsed.message || data;
                                } catch {
                                    parsedContent = data;
                                }
                            } else if (data && typeof data === "object") {
                                parsedContent = data.response || data.content || data.message || "";
                            }

                            finalContentRecorded = parsedContent;
                            const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));

                            dispatch(
                                setComplete({
                                    id: assistantId,
                                    content: parsedContent,
                                    duration: durationSec,
                                })
                            );
                        }
                    },
                });

                // If the stream ended without throwing, make sure status is complete
                const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
                if (!hasReceivedComplete) {
                    dispatch(
                        updateMessage({
                            id: assistantId,
                            updates: {
                                status: "complete",
                                duration: durationSec,
                                ...(finalContentRecorded ? {} : { content: "Workspace updates completed successfully." }),
                            },
                        })
                    );
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    const durationSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
                    dispatch(
                        updateMessage({
                            id: assistantId,
                            updates: {
                                status: "complete",
                                currentStep: "Stopped by user",
                                duration: durationSec,
                            },
                        })
                    );
                } else {
                    console.error("AI invocation error:", error);
                    dispatch(
                        setError({
                            id: assistantId,
                            error: error.message || "Failed to communicate with AI server.",
                        })
                    );
                }
            } finally {
                setIsStreaming(false);
                abortControllerRef.current = null;
            }
        },
        [dispatch, isStreaming, sandbox?.sandboxId]
    );

    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
    }, []);

    const clearChat = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    const resetChat = useCallback(() => {
        dispatch(resetToInitial());
    }, [dispatch]);

    return {
        messages,
        isStreaming,
        invokeAI,
        stopStreaming,
        clearChat,
        resetChat,
        addMessage: (msg) => dispatch(addMessage(msg)),
        clearMessages: () => dispatch(clearMessages()),
    };
};
