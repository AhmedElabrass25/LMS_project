import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch profile first, then exams
  useEffect(() => {
    const getProfileAndExams = async () => {
      if (!token) {
        toast.error("You must be logged in to view exams");
        return;
      }

      try {
        // 1️⃣ Get student profile
        const profileRes = await axios.get(
          "https://edu-master-psi.vercel.app/user/",
          { headers: { token } }
        );
        const userData = profileRes.data.data;
        setProfile(userData);

        // 2️⃣ Fetch all exams
        const examsRes = await axios.get(
          "https://edu-master-psi.vercel.app/exam",
          { headers: { token } }
        );

        // 3️⃣ Filter exams by student's class
        const filtered = examsRes.data.data.filter(
          (exam) => exam.classLevel === userData.classLevel
        );
        console.log(filtered);
        setExams(filtered);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    getProfileAndExams();
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    // <DashboardLayout>
    //   <div className="p-6">
    //     <h1 className="text-2xl font-bold mb-4 text-blue-700">
    //       📘 Available Exams
    //     </h1>

    //     {exams.length === 0 ? (
    //       <p className="text-gray-600">No exams available right now.</p>
    //     ) : (
    //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    //         {exams.map((exam) => (
    //           <div
    //             key={exam._id}
    //             className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
    //           >
    //             <h2 className="text-lg font-semibold text-gray-800">
    //               {exam.title}
    //             </h2>
    //             <p className="text-sm text-gray-600 mt-2">
    //               🕒 Duration: {exam.duration || 30} mins
    //             </p>
    //             <p className="text-sm text-gray-600">
    //               ❓ Questions: {exam.questions?.length || 0}
    //             </p>

    //             <button
    //               onClick={() => navigate(`/start-exam/${exam._id}`)}
    //               disabled={loading}
    //               className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
    //             >
    //               {loading ? "Loading..." : "Start Exam"}
    //             </button>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </DashboardLayout>
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 border-b-4 border-blue-100 pb-3">
          🧠 Available Exams & Quizzes
        </h1>

        {/* Content */}
        {exams.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
              <p className="text-2xl font-semibold text-gray-700 mb-2">
                No exams available right now.
              </p>
              <p className="text-md text-gray-500">
                Check back later for new assessments based on your course
                progress.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white shadow-xl rounded-2xl p-6 transition duration-300 hover:shadow-2xl transform hover:-translate-y-1 border-t-4 border-blue-600 flex flex-col"
              >
                {/* Exam Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 border-b pb-3">
                  {exam.title || "Untitled Exam"}
                </h2>

                {/* Exam Details */}
                <div className="space-y-3 flex-grow mb-6">
                  {/* Duration */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">🕒</span> Duration:
                    </span>
                    <span className="font-semibold text-blue-600">
                      {exam.duration || 30} minutes
                    </span>
                  </div>

                  {/* Questions Count */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">❓</span> Questions:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {exam.questions?.length || 0}
                    </span>
                  </div>

                  {/* Level / Status placeholder (optional) */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      <span className="text-lg mr-2">🎓</span> Target Level:
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {exam.classLevel || "General"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/start-exam/${exam._id}`)}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl transition font-bold shadow-md transform hover:scale-[1.01] ${
                    loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? "Loading..." : "🚀 Start Exam"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllExams;
