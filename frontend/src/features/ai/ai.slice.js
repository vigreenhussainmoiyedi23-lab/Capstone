import { createSlice } from "@reduxjs/toolkit";

const INITIAL_MESSAGES = [
    {
        id: "welcome-1",
        role: "assistant",
        content: "Welcome to **Forge**. I'm your AI co-pilot for building exceptional websites.\n\nDescribe what you want to build and I'll generate it for you in real time.",
        timestamp: "09:41",
        status: "complete",
        updates: [],
    },
];

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        messages: INITIAL_MESSAGES,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
       
        appendUpdate: (state, action) => {
            const { id, update } = action.payload;
            const message = state.messages.find((msg) => msg.id === id);

            if (message) {
                if (!Array.isArray(message.updates)) {
                    message.updates = [];
                }
                message.updates.push(update);
                message.currentStep = update;
            }
        },

        updateMessage: (state, action) => {
            const { id, updates } = action.payload;
            const message = state.messages.find((msg) => msg.id === id);

            if (message) {
                Object.assign(message, updates);
            }
        },

        setComplete: (state, action) => {
            const { id, content, duration } = action.payload;
            const message = state.messages.find((msg) => msg.id === id);

            if (message) {
                message.status = "complete";
                if (content !== undefined && content !== null) {
                    message.content = content;
                }
                if (duration !== undefined) {
                    message.duration = duration;
                }
            }
        },

        setError: (state, action) => {
            const { id, error } = action.payload;
            const message = state.messages.find((msg) => msg.id === id);

            if (message) {
                message.status = "error";
                message.error = error;
            }
        },

        clearMessages: (state) => {
            state.messages = [];
        },

        resetToInitial: (state) => {
            state.messages = INITIAL_MESSAGES;
        },
       
    },
});

export const {
    addMessage,
    appendUpdate,
    updateMessage,
    setComplete,
    setError,
    clearMessages,
    resetToInitial,
} = aiSlice.actions;

export const AIReducer = aiSlice.reducer;
