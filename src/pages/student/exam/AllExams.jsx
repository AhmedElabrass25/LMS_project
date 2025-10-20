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
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          📘 Available Exams
        </h1>

        {exams.length === 0 ? (
          <p className="text-gray-600">No exams available right now.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {exam.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  🕒 Duration: {exam.duration || 30} mins
                </p>
                <p className="text-sm text-gray-600">
                  ❓ Questions: {exam.questions?.length || 0}
                </p>

                <button
                  onClick={() => navigate(`/start-exam/${exam._id}`)}
                  disabled={loading}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                >
                  {loading ? "Loading..." : "Start Exam"}
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
