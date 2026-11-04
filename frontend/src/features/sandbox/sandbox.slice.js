import { createSlice } from "@reduxjs/toolkit";

const sandboxSlice = createSlice({
    name: "sandbox",
    initialState: {
        sandboxId: null,
        previewUrl: null,
        agentUrl: null,
        terminalMessages: [],
        codeFiles: {},
        allFiles: []
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
        addCodeFile: (state, action) => {
            const { fileName, content } = action.payload;
            state.codeFiles[fileName] = content;
        },
        updateCodeFile: (state, action) => {
            const { fileName, content } = action.payload;
            if (state.codeFiles[fileName] !== undefined) {
                state.codeFiles[fileName] = content;
            }
        },
        removeCodeFile: (state, action) => {
            const { fileName } = action.payload;
            delete state.codeFiles[fileName];
        },
        listAllFiles: (state, action) => {
            const files = action.payload;
            state.allFiles = files;
        }
    },
});

export const { setSandboxData, addTerminalMessage, clearTerminalMessages, addCodeFile, updateCodeFile, removeCodeFile, listAllFiles } = sandboxSlice.actions;
export const sandboxReducer = sandboxSlice.reducer;