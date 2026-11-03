import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        messages: [],
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },

        updateMessage: (state, action) => {
            const { id, updates } = action.payload;
            const message = state.messages.find((msg) => msg.id === id);

            if (message) {
                Object.assign(message, updates);
            }
        },

        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const {
    addMessage,
    updateMessage,
    clearMessages,
} = aiSlice.actions;

export const AIReducer = aiSlice.reducer;