import { createSlice } from "@reduxjs/toolkit";

const sandboxSlice = createSlice({
    name: "sandbox",
    initialState: {
        sandboxId: null,
        previewUrl: null,
        agentUrl: null,
    },
    reducers: {
        setSandboxData: (state, action) => {
            state.sandboxId = action.payload.sandboxId;
            state.previewUrl = action.payload.previewUrl;
            state.agentUrl = action.payload.agentUrl;
        }
    },
});

export const { setSandboxData } = sandboxSlice.actions;
export const sandboxReducer = sandboxSlice.reducer;