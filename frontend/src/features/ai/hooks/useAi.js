import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

import {
    addMessage as addMessageAction,
    updateMessage,
    clearMessages as clearMessagesAction,
} from "../ai.slice";

import { invokeAI as invokeAIService } from "../services/ai.api";

export const useAI = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.ai.messages);

    const addMessage = (message) => {
        dispatch(addMessageAction(message));
    };

    const clearMessages = () => {
        dispatch(clearMessagesAction());
    };

    const invokeAI = async ({ prompt, projectId }) => {
        const assistantId = crypto.randomUUID();

        // Add the user's message.
        addMessage({
            id: crypto.randomUUID(),
            role: "user",
            content: prompt,
            status: "complete",
        });

        // Add an empty assistant message to stream into.
        addMessage({
            id: assistantId,
            role: "assistant",
            content: "",
            status: "streaming",
        });

        try {
            await invokeAIService({
                prompt,
                projectId,

                onEvent: ({ event, data }) => {
                    if (event === "update") {
                        const chunk =
                            typeof data === "string"
                                ? data
                                : data.content || data.chunk || "";

                        dispatch(
                            updateMessage({
                                id: assistantId,
                                updates: {
                                    content: messages.find(
                                        (msg) => msg.id === assistantId
                                    )?.content + chunk,
                                },
                            })
                        );
                    }

                    if (event === "complete") {
                        dispatch(
                            updateMessage({
                                id: assistantId,
                                updates: {
                                    content:
                                        typeof data === "string"
                                            ? data
                                            : data.content || "",
                                    status: "complete",
                                },
                            })
                        );
                    }
                },
            });

            // Mark complete if the stream ended without a complete event.
            dispatch(
                updateMessage({
                    id: assistantId,
                    updates: { status: "complete" },
                })
            );
        } catch (error) {
            dispatch(
                updateMessage({
                    id: assistantId,
                    updates: {
                        status: "error",
                        content: "Something went wrong while generating the response.",
                    },
                })
            );

            throw error;
        }
    };

    return {
        messages,
        addMessage,
        clearMessages,
        invokeAI,
    };
};