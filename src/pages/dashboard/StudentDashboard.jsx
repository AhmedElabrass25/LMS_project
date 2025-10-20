import { jwtDecode } from "jwt-decode";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const token = localStorage.getItem("token");
  const [lessons, setLessons] = useState([]);
  const [profile, setProfile] = useState(null);
  const [purchased, setPurchased] = useState([]);
  const [filteredPurchased, setFilteredPurchased] = useState([]);

  const navigate = useNavigate();
  let user = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 1️⃣ Get Profile
        const profileRes = await axios.get(
          "https://edu-master-psi.vercel.app/user/",
          { headers: { token } }
        );
        const userData = profileRes.data.data;
        setProfile(userData);

        // 2️⃣ Get Purchased Lessons
        const purchasedRes = await axios.get(
          "https://edu-master-psi.vercel.app/lesson/my/purchased",
          { headers: { token } }
        );
        const purchasedData = purchasedRes.data.data || [];
        setPurchased(purchasedData);

        // 3️⃣ Filter Purchased Lessons by Class Level
        const filtered = purchasedData.filter(
          (lesson) => lesson.classLevel === userData.classLevel
        );
        setFilteredPurchased(filtered);

        // 4️⃣ Get All Lessons (optional for total count)
        const lessonsRes = await axios.get(
          "https://edu-master-psi.vercel.app/lesson",
          { headers: { token } }
        );
        setLessons(lessonsRes.data.data || []);
      } catch (err) {
        console.error("[Dashboard Error]:", err);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Welcome Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your learning progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-medium">Total Lessons</h3>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {lessons.length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">📘</div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-medium">Purchased</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {filteredPurchased.length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
              ✅
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-medium">Your Level</h3>
              <p className="text-3xl font-bold text-yellow-500 mt-1">
                {profile?.classLevel || "N/A"}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              🎓
            </div>
          </div>
        </div>

        {/* Purchased Lessons by Level */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Purchased Lessons ({profile?.classLevel})
            </h2>
          </div>

          {filteredPurchased.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No purchased lessons found for your level.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Lesson Name
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Watch Lesson
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchased.map((lesson, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{lesson.title}</td>
                      <td className="p-3">
                        <a
                          href={`${lesson.video}`}
                          target="_blank"
                          className="px-3 py-2 bg-blue-600 text-white rounded-2xl"
                        >
                          Watch
                        </a>
                      </td>
                      <td className="p-3">{lesson.classLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
