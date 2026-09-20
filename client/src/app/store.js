import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import accountReducer from '@/features/accounts/accountSlice';
import transactionReducer from '@/features/transactions/transactionSlice';
import loanReducer from '@/features/loans/loanSlice';
import analyticsReducer from '@/features/analytics/analyticsSlice';
import adminReducer from '@/features/admin/adminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        accounts: accountReducer,
        transactions: transactionReducer,
        loans: loanReducer,
        analytics: analyticsReducer,
        admin: adminReducer,
    },
})