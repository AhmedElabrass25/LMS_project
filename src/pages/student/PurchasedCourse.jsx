import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiBookOpen, BiCheckCircle, BiDollar, BiWallet } from "react-icons/bi";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loading from "../../components/Loading";
import { getPurchased } from "../../redux/slices/purchasedSlice";
import { fetchOne } from "../../redux/slices/profileSlice";

const PurchasedCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { purchases, loading, error } = useSelector((state) => state.purchases);
  const { profile } = useSelector((state) => state.profile);

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const loadProfileAndLessons = async () => {
      const result = await dispatch(fetchOne());
      if (result?.payload?.classLevel) {
        setIsProfileLoaded(true);
        dispatch(getPurchased());
      }
    };
    loadProfileAndLessons();
  }, [dispatch]);

  const filteredPurchases = useMemo(() => {
    if (!purchases.length || !profile?.classLevel) return [];
    return purchases.filter(
      (lesson) => lesson?.classLevel === profile?.classLevel
    );
  }, [purchases, profile]);

  // ✅ display loading
  if (loading && !isProfileLoaded) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  // ✅ display error
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600 font-semibold">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  // display no purchased lessons
  if (!filteredPurchases.length) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
            My Purchased Lessons
          </h1>
          <div className="flex flex-col justify-center items-center h-[40vh] text-center">
            <BiWallet size={50} className="text-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Purchased Lessons Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Go to the <b>Available Lessons</b> page to buy content and see it
              here!
            </p>
            <button
              onClick={() => navigate("/coursesStd")}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Available Lessons
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ✅ display purchased lessons
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          My Purchased Lessons
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((course) => (
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
                  <span className="font-medium text-gray-600">Class Level</span>
                  <span>{course.classLevel || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Price Paid</span>
                  <span className="flex items-center gap-1 font-semibold text-green-600">
                    <BiDollar size={16} /> {course.price || "N/A"} EGP
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">
                    Access Status
                  </span>
                  <span className="font-semibold text-green-700 flex items-center gap-1">
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
      </div>
    </DashboardLayout>
  );
};

export default PurchasedCourse;
