import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCrudThunks } from "../../api/createCrudThunks";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

// CRUD thunks for user
const profileThunks = createCrudThunks("user");

// ✅ Custom thunk for forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/forgot-password", data);
      toast.success("Password reset link sent successfully!");
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("user/reset-password", data);
      toast.success("Password reset link sent successfully!");
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 🟢 Fetch user profile
    builder
      .addCase(profileThunks.fetchOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileThunks.fetchOne.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload || {};
      })
      .addCase(profileThunks.fetchOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // 🟡 Update user profile
    builder
      .addCase(profileThunks.updateOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileThunks.updateOne.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload?.data };
      })
      .addCase(profileThunks.updateOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // 🔴 Delete user
    builder
      .addCase(profileThunks.deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileThunks.deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.profile = {};
      })
      .addCase(profileThunks.deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // 🟣 Forget password
    builder
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload || {};
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;

// ✅ export only CRUD thunks here (not forgetPassword)
export const { fetchOne, updateOne, deleteUser } = profileThunks;
