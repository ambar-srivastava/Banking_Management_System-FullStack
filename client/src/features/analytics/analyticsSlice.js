import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalytics as getAnalyticsRequest, getBalanceTrend as getBalanceTrendRequest } from "@/services/analyticsService";

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (_, { rejectWithValue }) => {
    try {
        return await getAnalyticsRequest()
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchBalancTrend = createAsyncThunk('analytics/balanceTrend', async (accountId, { rejectWithValue }) => {
    try {
        const result = await getBalanceTrendRequest(accountId)
        return result.balanceTrend
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        monthlyTrend: [], spendingByType: [], status: 'idle', erroe: null, balanceTrend: [], balanceTrendStatus: 'idle',
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => { state.status = 'loading' })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.monthlyTrend = action.payload.monthlyTrend
                state.spendingByType = action.payload.spendingByType
            })
            .addCase(fetchAnalytics.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
            .addCase(fetchBalancTrend.pending, (state) => { state.balanceTrendStatus = 'loading' })
            .addCase(fetchBalancTrend.fulfilled, (state, action) => {
                state.balanceTrendStatus = 'succeeded'
                state.balanceTrend = action.payload
            })
            .addCase(fetchBalancTrend.rejected, (state) => { state.balanceTrendStatus = 'failed' })
    },
})

export default analyticsSlice.reducer