import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactionHistory } from "@/services/transactionService";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetch",
    async ({ accountId, filters }, { rejectWithValue }) => {
        try {
            return await getTransactionHistory(accountId, filters);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        items: [],
        total: 0,
        page: 1,
        totalPages: 1,
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => { state.status = 'loading' })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload.transactions
                state.total = action.payload.total
                state.page = action.payload.page
                state.totalPages = action.payload.totalPages
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export default transactionSlice.reducer;