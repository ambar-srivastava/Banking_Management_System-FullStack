import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboard as getDashboardRequest } from '@/services/dashboardService';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
    try {
        return await getDashboardRequest()
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        role: null,
        data: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        clearDashboard(state) {
            state.role = null
            state.data = null
            state.status = 'idle'
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.role = action.payload.role
                state.data = action.payload.dashboard
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer