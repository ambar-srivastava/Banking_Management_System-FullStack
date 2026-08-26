import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import accountReducer from '@/features/accounts/accountSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        accounts: accountReducer,
    },
})