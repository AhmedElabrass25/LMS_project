import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import Profile from "./pages/student/profile/Profile";
import Courses from "./pages/student/Courses";
import CourseDetails from "./pages/student/CourseDetails";
import PurchasedCourse from "./pages/student/PurchasedCourse";
import PayCourse from "./pages/student/PayCourse";
import EditProfile from "./pages/student/profile/EditProfile";
import ResetPassword from "./pages/student/profile/ResetPassword";
import ForgotPassword from "./pages/student/profile/ForgotPassword";
import StartExam from "./pages/student/exam/StartExam";
import AllExams from "./pages/student/exam/AllExams";
// import CreateAdmin from "./pages/admin/CreateAdmin";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AllUsers from "./pages/admin/AllUsers";
// import AllAdmins from "./pages/admin/AllAdmins";
import AddLesson from "./pages/admin/lesson/AddLesson";
import AllLessons from "./pages/admin/lesson/AllLessons";
import UpdateLessons from "./pages/admin/lesson/UpdateLessons";
import Exams from "./pages/admin/exam/Exams";
import UpdateExam from "./pages/admin/exam/updateExam";
import AddExam from "./pages/admin/exam/AddExam";
import AllQuestions from "./pages/admin/question/AllQuestion";
import UpdateQuestion from "./pages/admin/question/UpdateQuestion";
import AddQuestion from "./pages/admin/question/AddQuestion";
import ViewResultExam from "./pages/student/exam/ViewResultExam";
// import TheStudentScores from "./pages/admin/exam/TheSutdentScores";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboardStd"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        {/* Profile Route */}
        <Route
          path="/profileStd"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profileStd/:userId/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PrivateRoute>
              <ForgotPassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PrivateRoute>
              <ResetPassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/coursesStd"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/coursesStd/:lessonId"
          element={
            <PrivateRoute>
              <CourseDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="purchased"
          element={
            <PrivateRoute>
              <PurchasedCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/:lessonId"
          element={
            <PrivateRoute>
              <PayCourse />
            </PrivateRoute>
          }
        />
        {/* ====================Extra Routes==================== */}
        <Route
          path="/all-exams"
          element={
            <PrivateRoute>
              <AllExams />
            </PrivateRoute>
          }
        />
        <Route
          path="/start-exam/:examId"
          element={
            <PrivateRoute>
              <StartExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/viewExamResult/:examId"
          element={
            <PrivateRoute>
              <ViewResultExam />
            </PrivateRoute>
          }
        />

        {/* =========================Admin Routes=========================== */}

        <Route
          path="/adminDashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/allUsers"
          element={
            <AdminProtectedRoute>
              <AllUsers />
            </AdminProtectedRoute>
          }
        />
        {/* <Route
          path="/allAdmins"
          element={
            <AdminProtectedRoute>
              <AllAdmins />
            </AdminProtectedRoute>
          }
        /> */}
        <Route
          path="/allLessons"
          element={
            <AdminProtectedRoute>
              <AllLessons />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addLesson"
          element={
            <AdminProtectedRoute>
              <AddLesson />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/updateLesson/:lessonId"
          element={
            <AdminProtectedRoute>
              <UpdateLessons />
            </AdminProtectedRoute>
          }
        />
        {/* ====================Exam Routes==================== */}
        <Route
          path="/allExams"
          element={
            <AdminProtectedRoute>
              <Exams />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/updateExam/:examId"
          element={
            <AdminProtectedRoute>
              <UpdateExam />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addExam"
          element={
            <AdminProtectedRoute>
              <AddExam />
            </AdminProtectedRoute>
          }
        />
        {/* <Route
          path="/studentScores"
          element={
            <AdminProtectedRoute>
              <TheStudentScores />
            </AdminProtectedRoute>
          }
        /> */}
        {/* ===========================Question Routes========================== */}
        <Route
          path="/allQuestions"
          element={
            <AdminProtectedRoute>
              <AllQuestions />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/updateQuestion/:questionId"
          element={
            <AdminProtectedRoute>
              <UpdateQuestion />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addQuestion"
          element={
            <AdminProtectedRoute>
              <AddQuestion />
            </AdminProtectedRoute>
          }
        />
        {/* <Route path="/createAdmin" element={<CreateAdmin />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
