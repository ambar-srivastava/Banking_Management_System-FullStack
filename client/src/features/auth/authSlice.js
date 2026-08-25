import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    loginUser as loginRequest,
    registerUser as registerRequest,
    getToken,
    getUser,
    saveSession,
    clearSession
} from '@/services/authService';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const result = await loginRequest(credentials);
        saveSession(result.token, result.user);
        return result;
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
    try {
        return await registerRequest(payload);
    } catch (err) {
        return rejectWithValue(err.message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getToken(),
        user: getUser(),
        status: 'idle',
        error: null,
    },
    reducers: {
        logout(state) {
            clearSession()
            state.token = null
            state.user = null
            state.status = 'idle'
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.token = action.payload.token
                state.user = action.payload.user
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded'
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer;