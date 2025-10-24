import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCrudThunks } from "../../api/createCrudThunks";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const lessonThunks = createCrudThunks("lesson");
export const fetchFilteredLessons = createAsyncThunk(
  "lessons/fetchFiltered",
  async (params, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/lesson", { params });
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);
const lessonsSlice = createSlice({
  name: "lesson",
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: { page: 1, totalPages: 1 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   get all lessons
      .addCase(lessonThunks.fetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(lessonThunks.fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          totalPages: 1,
        };
      })
      .addCase(lessonThunks.fetchAll.rejected, (state, action) => {
        state.error = action.payload;
      });
    //   get by id
    builder
      .addCase(lessonThunks.fetchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(lessonThunks.fetchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(lessonThunks.fetchById.rejected, (state, action) => {
        state.error = action.payload;
      });
    //   add one
    builder
      .addCase(lessonThunks.addOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(lessonThunks.addOne.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(lessonThunks.addOne.rejected, (state, action) => {
        state.error = action.payload;
      });
    //   update one
    builder
      .addCase(lessonThunks.updateOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(lessonThunks.updateOne.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(lessonThunks.updateOne.rejected, (state, action) => {
        state.error = action.payload;
      });
    //   delete one
    builder
      .addCase(lessonThunks.deleteOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(lessonThunks.deleteOne.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(lessonThunks.deleteOne.rejected, (state, action) => {
        state.error = action.payload;
      });
    // fetchFilteredLessons
    builder
      .addCase(fetchFilteredLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          totalPages: 1,
        };
      })
      .addCase(fetchFilteredLessons.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export default lessonsSlice.reducer;
export const { fetchAll, fetchById, addOne, updateOne, deleteOne } =
  lessonThunks;
