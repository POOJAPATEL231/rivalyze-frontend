import { configureStore } from "@reduxjs/toolkit";

import analysisReducer from "@/store/slices/analysisSlice";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        analysis: analysisReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
