import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
export const getPurchased = createAsyncThunk(
  "getPurchased",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/lesson/my/purchased");
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);
const purchasedSlice = createSlice({
  name: "purchases",
  initialState: {
    purchases: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPurchased.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPurchased.fulfilled, (state, action) => {
      state.loading = false;
      state.purchases = action.payload || [];
    });
    builder.addCase(getPurchased.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export default purchasedSlice.reducer;
