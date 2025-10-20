// src/pages/dashboard/CoursesPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { BiBookOpen, BiFilterAlt } from "react-icons/bi";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

// --- CONSTANT FOR LIMITING RESULTS ---
const COURSES_PER_PAGE = 6;
const API_BASE_ENDPOINT = "https://edu-master-psi.vercel.app/lesson/";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    isPaid: "",
    sortBy: "scheduledDate",
    sortOrder: "asc",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchCourses = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    // 1. Build the Query String
    const params = new URLSearchParams();

    // --- ADD THE LIMIT PARAMETER HERE ---
    params.append("limit", COURSES_PER_PAGE);

    // Always include pagination
    params.append("page", currentPage);

    // Add sorting parameters
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);
    }

    // Add filtering parameters
    if (filters.isPaid !== "") {
      params.append("isPaid", filters.isPaid);
    }

    const apiUrlWithParams = `${API_BASE_ENDPOINT}?${params.toString()}`;

    try {
      const res = await axios.get(apiUrlWithParams, {
        headers: { token },
      });
      //   console.log(res);
      if (res.data && res.data.data) {
        setCourses(res.data.data);
        // Now, totalPages will likely be greater than 1, and pagination will appear.
        setPaginationData(res.data.pagination || { page: 1, totalPages: 1 });
      } else {
        setCourses([]);
        setPaginationData({ page: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load the list of courses");
    } finally {
      setLoading(false);
    }
  }, [navigate, currentPage, filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // --- UI Rendering (Unchanged logic for Loading/Error) ---
  const [purchasedLessons, setPurchasedLessons] = useState([]);

  useEffect(() => {
    const fetchPurchasedLessons = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://edu-master-psi.vercel.app/lesson/my/purchased",
          {
            headers: { token },
          }
        );
        if (res.data?.data) {
          const lessonIds = res.data.data.map((lesson) => lesson._id);
          setPurchasedLessons(lessonIds);
        }
      } catch (err) {
        console.error("Error fetching purchased lessons:", err);
      }
    };

    fetchPurchasedLessons();
  }, []);

  if (loading && courses.length === 0) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          Available Lessons & Courses
        </h1>

        {/* --- Filters Section (Unchanged) --- */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center text-lg font-semibold text-gray-700">
            <BiFilterAlt size={24} className="mr-2 text-blue-600" />
            Filter & Sort
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="isPaid"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Payment:
            </label>
            <select
              id="isPaid"
              name="isPaid"
              value={filters.isPaid}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
            >
              <option value="">All</option>
              <option value="true">Paid Only</option>
              <option value="false">Free Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="sortOrder"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Order:
            </label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
            >
              <option value="asc">Oldest First (ASC)</option>
              <option value="desc">Newest First (DESC)</option>
            </select>
          </div>
        </div>

        {/* --- Course Grid & Pagination Wrapper --- */}
        <div
          className={`relative ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {loading && courses.length > 0 && <Loading />}
          {courses.length === 0 && !loading && (
            <div className="p-4 md:p-8">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
                Available Lessons & Courses
              </h1>
              <div className="flex justify-center items-center h-[30vh] text-center">
                <div className="text-xl text-gray-500 p-8 border rounded-lg shadow-md bg-white">
                  <h3 className="text-2xl font-semibold text-red-500 mb-2">
                    No Courses Matched Your Filters
                  </h3>
                  <p>
                    Try changing your filter selections or check your enrollment
                    status.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-xl rounded-xl p-6 transition-shadow duration-300 hover:shadow-2xl border-t-4 border-blue-600 flex flex-col"
              >
                {/* ... (Course Card Content) ... */}
                <div className="flex items-center mb-4 border-b pb-4">
                  <BiBookOpen size={30} className="text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {course.title || "Untitled Lesson"}
                  </h2>
                </div>
                <div className="space-y-3 text-gray-700 flex-grow">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      Class Level
                    </span>
                    <span className="text-right">
                      {course.classLevel || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Price</span>
                    <span className="text-right flex items-center gap-1 font-semibold">
                      {course.isPaid ? `${course.price} EGP` : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Type</span>
                    <span
                      className={`font-semibold ${
                        course.isPaid ? "text-orange-500" : "text-green-600"
                      }`}
                    >
                      {course.isPaid ? "Premium" : "Public"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 pt-3 line-clamp-3">
                    {course.description ||
                      "No short description provided for this lesson."}
                  </p>
                </div>
                {purchasedLessons.includes(course._id) ? (
                  // ✅ إذا اشتراه بالفعل
                  <button
                    onClick={() => navigate(`/coursesStd/${course._id}`)}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    View Lesson (Purchased)
                  </button>
                ) : course.isPaid ? (
                  // 💳 إذا لم يشتريه بعد وهو مدفوع
                  <button
                    onClick={() => navigate(`/payment/${course._id}`)}
                    className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    Buy Lesson ({course.price} EGP)
                  </button>
                ) : (
                  // 🎓 مجاني
                  <button
                    onClick={() => navigate(`/coursesStd/${course._id}`)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
                  >
                    Start Lesson (Free)
                  </button>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={paginationData.page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Courses;
