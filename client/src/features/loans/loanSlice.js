import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { applyForLoanRequest, getMyLoansRequest, getPendingLoansRequest, decideLoanRequest } from "@/services/loanService";

export const fetchMyLoans = createAsyncThunk('loans/fetchMine', async (_, { rejectWithValue }) => {
    try {
        const result = await getMyLoansRequest();
        return result.loans;
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const applyForLoan = createAsyncThunk('loans/apply', async (payload, { dispatch, rejectWithValue }) => {
    try {
        const result = await applyForLoanRequest(payload)
        dispatch(fetchMyLoans())
        return result.loan
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const fetchPendingLoans = createAsyncThunk('loans/fetchPending', async (_, { rejectWithValue }) => {
    try {
        const result = await getPendingLoansRequest();
        return result.loans;
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const decideLoan = createAsyncThunk('loans/decide', async ({ loanId, decision }, { dispatch, rejectWithValue }) => {
    try {
        const result = await decideLoanRequest(loanId, decision)
        dispatch(fetchPendingLoans())
        return result.loan;
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const loanSlice = createSlice({
    name: 'loans',
    initialState: {
        myLoans: [], myLoansStatus: 'idle', pendingError: null,
        decisionStatus: 'idle', decideError: null,
    },
    extraReducers:
        (builder) => {
            builder
                .addCase(fetchMyLoans.pending, (state) => { state.myLoansStatus = 'loading' })
                .addCase(fetchMyLoans.fulfilled, (state, action) => { state.myLoansStatus = 'succeeded'; state.myLoans = action.payload })
                .addCase(fetchMyLoans.rejected, (state, action) => { state.myLoansStatus = 'failed'; state.myLoansError = action.payload })
                .addCase(applyForLoan.pending, (state) => { state.applyStatus = 'loading'; state.applyError = null })
                .addCase(applyForLoan.fulfilled, (state) => { state.applyStatus = 'succeeded' })
                .addCase(applyForLoan.rejected, (state, action) => { state.applyStatus = 'failed'; state.applyError = action.payload })
                .addCase(fetchPendingLoans.pending, (state) => { state.pendingStatus = 'loading' })
                .addCase(fetchPendingLoans.fulfilled, (state, action) => { state.pendingStatus = 'succeeded'; state.pendingLoans = action.payload })
                .addCase(fetchPendingLoans.rejected, (state, action) => { state.pendingStatus = 'failed'; state.pendingError = action.payload })
                .addCase(decideLoan.pending, (state) => { state.decideStatus = 'loading' })
                .addCase(decideLoan.fulfilled, (state) => { state.decideStatus = 'succeeded' })
                .addCase(decideLoan.rejected, (state, action) => { state.decideStatus = 'failed'; state.decideError = action.payload })
        },
})

export default loanSlice.reducer;