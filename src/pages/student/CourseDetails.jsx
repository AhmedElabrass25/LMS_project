// src/pages/dashboard/LessonDetailsPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  BiBookOpen,
  BiTime,
  BiCalendar,
  BiDollar,
  BiVideo,
  BiLockAlt,
} from "react-icons/bi"; // Added BiLockAlt
import Loading from "../../components/Loading";

const API_BASE_ENDPOINT = "https://edu-master-psi.vercel.app/lesson/";

function CourseDetails() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false); // New state for 403 error

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must login first");
      navigate("/login");
      return;
    }

    if (!lessonId) {
      toast.error("Invalid lesson URL.");
      setLoading(false);
      return;
    }

    const fetchLessonDetails = async () => {
      setLoading(true);
      setAccessDenied(false); // Reset on new fetch
      try {
        const url = `${API_BASE_ENDPOINT}${lessonId}`;
        const res = await axios.get(url, {
          headers: { token },
        });
        console.log(res);

        let lessonData = null;
        if (res.data && res.data.data) {
          lessonData = res.data.data;
        } else if (res.data && res.data.title) {
          lessonData = res.data;
        }

        if (lessonData) {
          setLesson(lessonData);
        } else {
          throw new Error("Lesson data structure is invalid or not found.");
        }
      } catch (err) {
        console.error("Error fetching lesson details:", err);

        // --- CRITICAL FIX: Handle 403 Forbidden specifically ---
        if (
          axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 403
        ) {
          setAccessDenied(true); // Set access denied state
          setLesson(err.response.data.lesson || null); // Optionally get partial lesson data (title, price, etc.) if sent by API
          toast.error(
            err.response.data.message || "Access denied. Purchase required."
          );
        } else {
          // Handle other errors (404, network issues, 500 etc.)
          toast.error("Failed to load lesson details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lessonId, navigate]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Conditional Rendering ---

  if (loading) {
    // (Loading UI is correct)
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  if (!lesson && !accessDenied) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh] text-xl text-red-500">
          Lesson not found or failed to load.
        </div>
      </DashboardLayout>
    );
  }

  // Lesson object must be available to proceed (even if access is denied,
  // we use its title/price for the purchase view)
  if (!lesson) return null;

  // --- Details Display ---
  return (
    <DashboardLayout>
      <div className="min-h-[60vh] bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="p-6 md:p-8 bg-blue-600 text-white flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold mb-1 flex items-center">
                <BiBookOpen className="mr-3 text-white" size={32} />
                {lesson.title || "Untitled Lesson"}
              </h1>
              <p className="text-blue-200">{lesson.classLevel || "General"}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Description and Details */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {lesson.description ||
                  "No detailed description provided for this lesson."}
              </p>

              {/* Key Metadata (Unchanged) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                {/* ... metadata items ... */}
                <div className="flex items-center text-gray-700">
                  <BiCalendar className="text-blue-500 mr-3" size={24} />
                  <div>
                    <span className="font-medium text-sm">Scheduled Date</span>
                    <p className="font-bold text-base">
                      {formatDate(lesson.scheduledDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <BiDollar className="text-blue-500 mr-3" size={24} />
                  <div>
                    <span className="font-medium text-sm">Cost</span>
                    <p
                      className={`font-bold text-base ${
                        lesson.isPaid ? "text-orange-600" : "text-green-600"
                      }`}
                    >
                      {lesson.isPaid ? `${lesson.price} EGP` : "FREE"}
                    </p>
                  </div>
                </div>
                {/* ... other metadata ... */}
              </div>
            </div>

            {/* Right Column: Video Player/Action */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lesson Content
              </h2>

              {/* --- Conditional Content Display --- */}
              {accessDenied ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <BiLockAlt size={40} className="text-red-600 mb-3" />
                  <p className="text-red-700 font-bold text-lg mb-4">
                    Access Denied
                  </p>
                  <p className="text-gray-700 mb-6">
                    This is a premium lesson. Please purchase it to unlock the
                    content.
                  </p>
                  <button
                    // Implement your actual purchase logic here
                    onClick={() =>
                      toast.success(
                        `Initiating purchase for ${lesson.price} EGP...`
                      )
                    }
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition font-medium text-lg"
                  >
                    Purchase Lesson for {lesson.price} EGP
                  </button>
                </div>
              ) : // Display Video Content (Only if access is NOT denied)
              lesson.video ? (
                <div className="aspect-w-16 aspect-h-9 w-full rounded-lg shadow-xl overflow-hidden">
                  <iframe
                    title={lesson.title}
                    width="100%"
                    height="auto"
                    src={
                      lesson.video.includes("youtube.com/watch")
                        ? `https://www.youtube.com/embed/${new URL(
                            lesson.video
                          ).searchParams.get("v")}`
                        : lesson.video
                    }
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-yellow-700 font-medium">
                    Video content will be available soon.
                  </p>
                </div>
              )}

              {/* Button to open video full screen (only shown if not denied) */}
              {!accessDenied && lesson.video && (
                <button
                  onClick={() => window.open(lesson.video, "_blank")}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-medium"
                >
                  Open Full Screen Video
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CourseDetails;
