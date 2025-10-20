import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { BiBookOpen, BiCheckCircle, BiDollar, BiWallet } from "react-icons/bi";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";

// --- API ENDPOINT ---
const API_BASE_ENDPOINT =
  "https://edu-master-psi.vercel.app/lesson/my/purchased";
const COURSES_PER_PAGE = 6;

function PurchasedCourse() {
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Moved token access inside component scope

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // get profile info
  const getProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://edu-master-psi.vercel.app/user/", {
        headers: { token },
      });
      setProfile(res.data.data);
    } catch (err) {
      // FIX: Corrected toast usage to not pass an error object directly
      toast.error("Failed to load profile");
      console.error(err);
    }
  };

  const fetchPurchasedCourses = useCallback(async () => {
    if (!token) {
      toast.error("You must login first");
      navigate("/login");
      return;
    }

    // Safety check: Only proceed if profile (which contains classLevel) is loaded
    // If we can't filter, we still fetch, but the filter logic below must handle null profile.

    setLoading(true);

    // 1. Build the Query String
    const params = new URLSearchParams();
    params.append("limit", COURSES_PER_PAGE);
    params.append("page", currentPage);

    const apiUrlWithParams = `${API_BASE_ENDPOINT}?${params.toString()}`;

    try {
      const res = await axios.get(apiUrlWithParams, {
        headers: { token },
      });

      if (res.data && res.data.data) {
        let incomingLessons = res.data.data;

        // FIX: Only filter lessons if the profile (and thus classLevel) is available.
        if (profile?.classLevel) {
          incomingLessons = incomingLessons.filter(
            (course) => course.classLevel === profile.classLevel
          );
        }

        setCourses(incomingLessons);

        // FIX: Safely extract pagination data.
        const apiPagination = res.data.pagination;
        if (apiPagination) {
          setPaginationData(apiPagination);
        } else {
          setPaginationData({ page: currentPage, totalPages: 1 });
        }
      } else {
        setCourses([]);
        setPaginationData({ page: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error fetching purchased lessons:", err);
      toast.error("Failed to load your purchased lessons.");
    } finally {
      setLoading(false);
    }
  }, [navigate, currentPage, token, profile]); // FIX: Added token and profile to dependencies

  // Effect 1: Fetch Profile on mount
  useEffect(() => {
    getProfile();
  }, [token]);

  // Effect 2: Fetch Purchased Courses when profile or page changes
  useEffect(() => {
    // FIX: Ensure profile is loaded before trying to fetch/filter courses
    if (profile) {
      fetchPurchasedCourses();
    }
  }, [fetchPurchasedCourses, profile]);

  // --- UI Rendering ---

  // Full-screen loader only on initial load
  if (loading && courses.length === 0) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  // Display error message if no purchased lessons found
  if (courses.length === 0 && !loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
            My Purchased Lessons
          </h1>
          <div className="flex justify-center items-center h-[30vh] text-center">
            <div className="text-xl text-gray-500 p-8 border rounded-lg shadow-md bg-white">
              <BiWallet size={40} className="text-blue-500 mx-auto mb-3" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No Purchased Lessons Yet
              </h3>
              <p>
                Go to the **Available Lessons** page to buy content and see it
                here!
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          My Purchased Lessons
        </h1>

        {/* The Filters section is removed for this page */}

        <div
          className={`relative ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {/* Partial Loading Spinner */}
          {loading && courses.length > 0 && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10 rounded-lg">
              <Loading />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-xl rounded-xl p-6 transition-shadow duration-300 hover:shadow-2xl border-t-4 border-green-600 flex flex-col"
              >
                <div className="flex items-center mb-4 border-b pb-4">
                  <BiBookOpen size={30} className="text-green-600 mr-3" />
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
                    <span className="font-medium text-gray-600">
                      Price Paid
                    </span>
                    {/* This will likely show the price, but could be 'Purchased' if API doesn't return price */}
                    <span className="text-right flex items-center gap-1 font-semibold text-green-600">
                      <BiDollar size={16} /> {course.price || "N/A"} EGP
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      Access Status
                    </span>
                    <span
                      className={`font-semibold text-green-700 flex items-center gap-1`}
                    >
                      <BiCheckCircle size={16} /> UNLOCKED
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 pt-3 line-clamp-3">
                    {course.description ||
                      "No short description provided for this lesson."}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/coursesStd/${course._id}`)}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
                >
                  View Lesson Content
                </button>
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

export default PurchasedCourse;
