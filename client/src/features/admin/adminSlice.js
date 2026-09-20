import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllUsers, createStaffUser as createStaffUserRequest, updateUserRole as updateUserRoleRequest, } from '@/services/adminService';

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const result = await getAllUsers()
        return result.users
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const createStaffUser = createAsyncThunk('admin/createStaff', async (payload, { dispatch, rejectWithValue }) => {
    try {
        const result = await createStaffUserRequest(payload)
        dispatch(fetchAllUsers())
        return result.user
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

export const updateUserRole = createAsyncThunk('admin/updateRole', async ({ userId, role }, { dispatch, rejectWithValue }) => {
    try {
        const result = await updateUserRoleRequest(userId, role)
        dispatch(fetchAllUsers())
        return result.user;
    } catch (err) {
        return rejectWithValue(err.message)
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [], status: 'idle', error: null,
        createStatus: 'idle', createError: null,
        updateStatus: 'idle', updateError: null,

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => { state.status = 'loading'; state.error = null })
            .addCase(fetchAllUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload })
            .addCase(fetchAllUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
            .addCase(createStaffUser.pending, (state) => { state.createStatus = 'loading'; state.createError = null })
            .addCase(createStaffUser.fulfilled, (state) => { state.createStatus = 'succeeded' })
            .addCase(createStaffUser.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.payload })
            .addCase(updateUserRole.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null })
            .addCase(updateUserRole.fulfilled, (state) => { state.updateStatus = 'succeeded' })
            .addCase(updateUserRole.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload })
    },
})

export default adminSlice.reducer