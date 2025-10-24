import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, fetchFilteredLessons } from "../../redux/slices/lessonSlice";
import { getPurchased } from "../../redux/slices/purchasedSlice";

const COURSES_PER_PAGE = 6;

function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🧭 Redux state
  const {
    items: lessons,
    pagination,
    loading,
  } = useSelector((state) => state.lessons);
  const { purchases } = useSelector((state) => state.purchases);
  console.log(purchases);

  // 🧠 Local state
  const [filters, setFilters] = useState({
    isPaid: "",
    sortBy: "scheduledDate",
    sortOrder: "asc",
    purchaseStatus: "", // 🆕 filter for purchased / not purchased
  });

  const [currentPage, setCurrentPage] = useState(1);

  // 🪄 Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // 🧩 Fetch Lessons + Purchased
  useEffect(() => {
    const params = {
      limit: COURSES_PER_PAGE,
      page: currentPage,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    if (filters.isPaid !== "") params.isPaid = filters.isPaid;

    dispatch(fetchFilteredLessons(params));
    dispatch(getPurchased());
    dispatch(fetchAll(currentPage));
  }, [dispatch, filters, currentPage]);

  // 🎓 Logic for Purchased Lessons
  const purchasedIds = purchases.filter((c) => c !== null).map((p) => p._id);

  // 🧮 Filter Lessons Based on Purchase Status
  const filteredLessons = lessons.filter((course) => {
    if (!course) return false;

    if (filters.purchaseStatus === "purchased") {
      return purchasedIds.includes(course._id);
    } else if (filters.purchaseStatus === "notPurchased") {
      return !purchasedIds.includes(course._id);
    }

    return true; // all
  });

  if (loading && lessons.length === 0) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900 border-b-4 border-blue-100 pb-3">
          📚 Available Lessons & Courses
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row flex-wrap gap-4 justify-between items-center border border-gray-200">
          <div className="flex items-center text-lg font-bold text-blue-700 w-full md:w-auto">
            <span className="text-2xl mr-3">⚙️</span>Filter & Sort Options
          </div>

          {/* 🆕 Purchase Filter */}
          <div className="flex items-center gap-3 w-full sm:w-1/2 md:w-56">
            <label
              htmlFor="purchaseStatus"
              className="text-sm font-medium text-gray-700"
            >
              Purchase:
            </label>
            <select
              id="purchaseStatus"
              name="purchaseStatus"
              value={filters.purchaseStatus}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
            >
              <option value="">All</option>
              <option value="purchased">Purchased Only</option>
              <option value="notPurchased">Not Purchased</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-3 w-full sm:w-1/2 md:w-56">
            <label
              htmlFor="sortOrder"
              className="text-sm font-medium text-gray-700"
            >
              Order:
            </label>
            <select
              id="sortOrder"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
            >
              <option value="asc">Oldest First (ASC)</option>
              <option value="desc">Newest First (DESC)</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div
          className={`relative ${
            loading && lessons.length > 0
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          {loading && lessons.length > 0 && <Loading />}

          {filteredLessons.length === 0 && !loading && (
            <div className="flex justify-center items-center h-[40vh] text-center">
              <div className="text-xl text-gray-600 p-8 border border-red-200 rounded-xl shadow-xl bg-white max-w-md">
                <h3 className="text-2xl font-bold text-red-600 mb-3">
                  🚫 No Courses Found
                </h3>
                <p className="text-gray-700">
                  Try changing your filters or resetting selections.
                </p>
              </div>
            </div>
          )}

          {/* Courses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLessons.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-2xl rounded-xl p-6 hover:-translate-y-1 border border-gray-100 flex flex-col transition duration-300"
              >
                <div className="flex items-start mb-4 border-b-2 border-blue-50 pb-4">
                  <span className="text-3xl text-blue-600 mr-3 mt-1">📖</span>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {course.title || "Untitled Lesson"}
                  </h2>
                </div>

                <div className="space-y-3 text-gray-700 flex-grow">
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-medium text-gray-600">
                      Class Level
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {course.classLevel || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm items-center">
                    <span className="font-medium text-gray-600">Price</span>
                    <span
                      className={`font-bold text-lg ${
                        course.isPaid ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {course.isPaid ? `${course.price} EGP` : "FREE"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      Availability
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                        course.isPaid ? "bg-red-500" : "bg-teal-500"
                      }`}
                    >
                      {course.isPaid ? "Premium" : "Public"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 pt-3 line-clamp-3 leading-relaxed">
                    {course.description ||
                      "No short description provided for this lesson."}
                  </p>
                </div>

                {/* Action Button */}
                {purchasedIds.includes(course._id) ? (
                  <button
                    onClick={() => navigate(`/coursesStd/${course._id}`)}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    ▶️ View Lesson
                  </button>
                ) : course.isPaid ? (
                  <button
                    onClick={() => navigate(`/payment/${course._id}`)}
                    className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    💳 Buy Lesson ({course.price} EGP)
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/coursesStd/${course._id}`)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    🆓 Start Lesson
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Courses;
