import { configureStore } from "@reduxjs/toolkit";
import lessonsSlice from "./slices/lessonSlice";
import userSlice from "./slices/userSlice";
import examSlice from "./slices/examSlice";
import questionSlice from "./slices/questionSlice";
import profileSlice from "./slices/profileSlice";
import purchasedSlice from "./slices/purchasedSlice";

const store = configureStore({
  reducer: {
    lessons: lessonsSlice,
    users: userSlice,
    exams: examSlice,
    questions: questionSlice,
    profile: profileSlice,
    purchases: purchasedSlice,
  },
});
export default store;
