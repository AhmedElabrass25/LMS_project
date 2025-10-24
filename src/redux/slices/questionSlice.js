import { createSlice } from "@reduxjs/toolkit";
import { createCrudThunks } from "../../api/createCrudThunks";
const questionThunks = createCrudThunks("question");
const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: [],
    currentQuestion: null,
    loading: false,
    error: null,
    pagination: { page: 1, totalPages: 1 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(questionThunks.fetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionThunks.fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          totalPages: 1,
        };
      })
      .addCase(questionThunks.fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   ====== get by id ====== //
    builder
      .addCase(questionThunks.fetchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionThunks.fetchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(questionThunks.fetchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   ==========add question========== //
    builder
      .addCase(questionThunks.addOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionThunks.addOne.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(questionThunks.addOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   ==========update question========== //
    builder
      .addCase(questionThunks.updateOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionThunks.updateOne.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(questionThunks.updateOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    //   ======delete question====== //
    builder
      .addCase(questionThunks.deleteOne.pending, (state) => {
        state.loading = true;
      })
      .addCase(questionThunks.deleteOne.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(questionThunks.deleteOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default questionSlice.reducer;

export const { fetchAll, fetchById, addOne, updateOne, deleteOne } =
  questionThunks;
