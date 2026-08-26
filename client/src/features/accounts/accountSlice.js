import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getMyAccounts,
    openAccountRequest,
    transferFundsRequest
} from '@/services/accountService';

export const fetchAccounts = createAsyncThunk('accounts/fetch', async (_, { rejectWithValue }) => {
    try {
        const result = await getMyAccounts()
        return result.accounts
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const openAccount = createAsyncThunk('accounts/open', async (payload, { dispatch, rejectWithValue }) => {
    try {
        const result = await openAccountRequest(payload)
        dispatch(fetchAccounts()) // refresh the list so the new account shows up immediately
        return result.account
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const transferFunds = createAsyncThunk('accounts/transfer', async (payload, { dispatch, rejectWithValue }) => {
    try {
        const result = await transferFundsRequest(payload)
        dispatch(fetchAccounts()) // refresh balances after money moves
        return result
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const accountSlice = createSlice({
    name: 'accounts',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        openStatus: 'idle',
        openError: null,
        transferStatus: 'idle',
        transferError: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => { state.status = 'loading' })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.list = action.payload
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(openAccount.pending, (state) => { state.openStatus = 'loading'; state.openError = null })
            .addCase(openAccount.fulfilled, (state) => { state.openStatus = 'succeeded' })
            .addCase(openAccount.rejected, (state, action) => { state.openStatus = 'failed'; state.openError = action.payload })
            .addCase(transferFunds.pending, (state) => { state.transferStatus = 'loading'; state.transferError = null })
            .addCase(transferFunds.fulfilled, (state) => { state.transferStatus = 'succeeded' })
            .addCase(transferFunds.rejected, (state, action) => { state.transferStatus = 'failed'; state.transferError = action.payload })
    },
})

export default accountSlice.reducer;



