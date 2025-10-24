import { createSlice } from "@reduxjs/toolkit";
import { createCrudThunks } from "../../api/createCrudThunks";
const examThunks = createCrudThunks("exam");
const examSlice = createSlice({
  name: "exams",
  initialState: {
    exams: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: { page: 1, totalPages: 1 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(examThunks.fetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(examThunks.fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          totalPages: 1,
        };
      })
      .addCase(examThunks.fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   get by id
    builder
      .addCase(examThunks.fetchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(examThunks.fetchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(examThunks.fetchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   add exam
    builder
      .addCase(examThunks.addOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(examThunks.addOne.fulfilled, (state, action) => {
        state.loading = false;
        state.exams.push(action.payload);
      })
      .addCase(examThunks.addOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   update exam
    builder
      .addCase(examThunks.updateOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(examThunks.updateOne.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exams.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      .addCase(examThunks.updateOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   delete exam
    builder
      .addCase(examThunks.deleteOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(examThunks.deleteOne.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.filter((item) => item.id !== action.payload);
      })
      .addCase(examThunks.deleteOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default examSlice.reducer;
export const { fetchAll, fetchById, addOne, updateOne, deleteOne } = examThunks;
