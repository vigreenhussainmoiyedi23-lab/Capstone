import { configureStore } from '@reduxjs/toolkit';
import { AIReducer } from "../features/ai/ai.slice.js";
import { sandboxReducer } from "../features/sandbox/sandbox.slice.js";
import { authReducer } from '../features/auth/authSlice.js';

export const store = configureStore({
  reducer: {
    ai: AIReducer,
    sandbox: sandboxReducer,
    auth: authReducer
  },
});
