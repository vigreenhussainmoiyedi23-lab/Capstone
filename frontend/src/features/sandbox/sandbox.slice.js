import { createSlice } from "@reduxjs/toolkit";

const sandboxSlice = createSlice({
    name: "sandbox",
    initialState: {
        sandboxId: null,
        previewUrl: null,
        agentUrl: null,
        terminalMessages: [],
    },
    reducers: {
        setSandboxData: (state, action) => {
            state.sandboxId = action.payload.sandboxId;
            state.previewUrl = action.payload.previewUrl;
            state.agentUrl = action.payload.agentUrl;
        },
        addTerminalMessage: (state, action) => {
            state.terminalMessages.push(action.payload);
        },
        clearTerminalMessages: (state) => {
            state.terminalMessages = [];
        },
    },
});

export const { setSandboxData, addTerminalMessage, clearTerminalMessages } = sandboxSlice.actions;
export const sandboxReducer = sandboxSlice.reducer;