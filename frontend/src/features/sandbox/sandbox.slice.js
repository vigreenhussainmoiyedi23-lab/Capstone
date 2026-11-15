import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    sandboxId: null,
    previewUrl: null,
    agentUrl: null,
    terminalMessages: [],
    codeFiles: {},
    allFiles: [],
    projects: [] // users all projects: {_id,title,user}
}


const sandboxSlice = createSlice({
    name: "sandbox",
    initialState,
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
        },
        resetSandboxSlice: (state) => {
            console.log("resetting sandbox slice...");

            const projects = state.projects;

            console.log("sandbox slice reset");

            return {
                ...initialState,
                projects
            };
        },
        addProject: (state, action) => {
            state.projects = [...state.projects, action.payload]
        },
        setProjects: (state, action) => {
            state.projects = action.payload
        }
    },
});

export const {
    setSandboxData,
    addTerminalMessage,
    clearTerminalMessages,
    addCodeFile,
    updateCodeFile,
    removeCodeFile,
    listAllFiles,
    resetSandboxSlice,
    addProject,
    setProjects
} = sandboxSlice.actions;
export const sandboxReducer = sandboxSlice.reducer;