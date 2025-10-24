import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";

export const createCrudThunks = (thunkName) => ({
  fetchAll: createAsyncThunk(
    `${thunkName}/fetchAll`,
    async (page, thunkAPI) => {
      try {
        const url = page ? `/${thunkName}?page=${page}` : `/${thunkName}`;

        const res = await axiosInstance.get(url);
        console.log(res.data);
        const data = res.data.data || [];
        const pagination = res.data.pagination || null;

        return { data, pagination };
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  ),
  fetchOne: createAsyncThunk(`${thunkName}/fetchOne`, async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/${thunkName}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }),
  //   ======================
  deleteUser: createAsyncThunk(
    `${thunkName}/deleteUser`,
    async (_, thunkAPI) => {
      try {
        const res = await axiosInstance.delete(`/${thunkName}`);
        return res.data.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  ),
  //   ==========================================
  fetchById: createAsyncThunk(
    `${thunkName}/fetchById`,
    async (id, thunkAPI) => {
      try {
        const res = await axiosInstance.get(
          `/${
            thunkName == "exam"
              ? "exam/get"
              : thunkName == "question"
              ? "question/get"
              : thunkName
          }/${id}`
        );
        return res.data.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  ),
  //   ===============================================
  addOne: createAsyncThunk(`${thunkName}/addOne`, async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/${thunkName}`, data);
      toast.success(`${thunkName} added successfully!`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }),
  //   ===================================================
  updateOne: createAsyncThunk(
    `${thunkName}/updateOne`,
    async ({ id, data }, thunkAPI) => {
      try {
        const res = await axiosInstance.put(`/${thunkName}/${id}`, data);
        toast.success(`${thunkName} updated successfully!`);
        return res.data.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  ),
  //   ===================================================
  deleteOne: createAsyncThunk(
    `${thunkName}/deleteOne`,
    async (id, thunkAPI) => {
      try {
        await axiosInstance.delete(`/${thunkName}/${id}`);
        toast.success(`${thunkName} deleted successfully!`);
        return id;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  ),
});
