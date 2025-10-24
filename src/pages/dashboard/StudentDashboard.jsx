import { jwtDecode } from "jwt-decode";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOne } from "../../redux/slices/profileSlice";
import { fetchAll } from "../../redux/slices/lessonSlice";
import { getPurchased } from "../../redux/slices/purchasedSlice";

const StudentDashboard = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const { items: lessons } = useSelector((state) => state.lessons);
  const { purchases } = useSelector((state) => state.purchases);

  const [filteredPurchased, setFilteredPurchased] = useState([]);

  const navigate = useNavigate();
  let user = token ? jwtDecode(token) : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user + purchased lessons + all lessons
    dispatch(fetchOne());
    dispatch(getPurchased());
    dispatch(fetchAll());
  }, [dispatch]);

  // ✅ فلترة بعد ما البيانات تتحدث
  useEffect(() => {
    if (purchases.length && profile?.classLevel) {
      const filtered = purchases.filter(
        (lesson) => lesson?.classLevel === profile?.classLevel
      );
      setFilteredPurchased(filtered);
    }
  }, [purchases, profile, dispatch]);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-[70vh]">
        {/* Welcome Section */}
        <div className="mb-8 p-2 sm:p-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 break-words text-center sm:text-left">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg text-center sm:text-left">
            Here's an overview of your learning progress. Ready to continue?
          </p>
        </div>

        {/* --- */}

        {/* Stats Cards - BOLDER DESIGN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {/* Total Lessons */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-5 sm:p-6 flex items-center justify-between border-b-4 border-blue-500">
            <div>
              <h3 className="text-gray-600 font-semibold text-sm sm:text-base uppercase tracking-wider">
                Total Available Lessons
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mt-1">
                {lessons.length}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-2xl shadow-inner">
              📘
            </div>
          </div>

          {/* Purchased Lessons */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-5 sm:p-6 flex items-center justify-between border-b-4 border-green-500">
            <div>
              <h3 className="text-gray-600 font-semibold text-sm sm:text-base uppercase tracking-wider">
                Lessons Purchased
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-green-600 mt-1">
                {filteredPurchased.length}
              </p>
            </div>
            <div className="bg-green-100 text-green-600 p-4 rounded-full text-2xl shadow-inner">
              ✅
            </div>
          </div>

          {/* Your Level */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-5 sm:p-6 flex items-center justify-between border-b-4 border-yellow-500">
            <div>
              <h3 className="text-gray-600 font-semibold text-sm sm:text-base uppercase tracking-wider">
                Your Current Level
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-yellow-600 mt-1">
                {profile?.classLevel || "N/A"}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full text-2xl shadow-inner">
              🎓
            </div>
          </div>
        </div>

        {/* --- */}

        {/* Purchased Lessons List (Table/Card View) */}
        <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            📖 Purchased Lessons ({profile?.classLevel || "All Levels"})
          </h2>

          {filteredPurchased.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-lg">
              No purchased lessons found for your level.
            </p>
          ) : (
            <>
              {/*
            TABLE VIEW (Desktop/Tablet - sm breakpoint and up)
            *** MODERN DESIGN APPLIED ***
          */}
              <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-12">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Lesson Name
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-700 w-24">
                        Level
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-700 w-36">
                        Watch Lesson
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-sm">
                    {filteredPurchased.map((lesson, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-5 py-4 whitespace-nowrap text-gray-600 font-medium text-center">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {lesson.title}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center text-gray-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {lesson.classLevel}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <a
                            href={`${lesson.video}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full font-medium text-xs hover:bg-blue-700 transition shadow-md"
                          >
                            Start Watching
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*
            CARD VIEW (Mobile - below sm breakpoint)
          */}
              <div className="sm:hidden grid gap-4">
                {filteredPurchased.map((lesson, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg shadow-sm p-4 space-y-3 border border-gray-200"
                  >
                    <div className="flex justify-between items-start border-b pb-2">
                      <p className="font-bold text-lg text-blue-700">
                        {lesson.title}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {lesson.classLevel}
                      </span>
                    </div>

                    <div className="flex justify-center pt-2">
                      <a
                        href={`${lesson.video}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center px-4 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition shadow-lg"
                      >
                        ▶️ Watch Lesson
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
