import { createSlice } from "@reduxjs/toolkit";
import { createCrudThunks } from "../../api/createCrudThunks";
const userThunks = createCrudThunks("admin/all-user");
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    pagination: { page: 1, totalPages: 1 },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userThunks.fetchAll.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userThunks.fetchAll.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.data || [];
      state.pagination = action.payload.pagination || {
        page: 1,
        totalPages: 1,
      };
    });
    builder.addCase(userThunks.fetchAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const { fetchAll } = userThunks;
export default userSlice.reducer;
