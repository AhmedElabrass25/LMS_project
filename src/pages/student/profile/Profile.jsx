// src/pages/dashboard/Profile.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchOne } from "../../../redux/slices/profileSlice";

function Profile() {
  const navigate = useNavigate();
  const { profile: user, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOne());
  }, [dispatch]);
  //============handleDelete=============
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      dispatch(deleteUser());
    }
  };
  // ====================
  const DetailRow = ({ label, value, isLevel = false }) => (
    <div className="flex justify-between items-center border-b border-gray-200 last:border-b-0 pb-2">
      <span className="font-semibold text-gray-900">{label}</span>
      {isLevel ? (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
          {value}
        </span>
      ) : (
        <span className="text-gray-800">{value}</span>
      )}
    </div>
  );
  // ==================
  return (
    <DashboardLayout>
      {loading ? (
        <Loading />
      ) : !user ? (
        <div className="flex justify-center items-center h-[60vh] text-2xl font-semibold text-red-600 bg-gray-50">
          <span className="p-6 bg-white rounded-xl shadow-lg border border-red-100">
            ❌ No user data found or profile failed to load.
          </span>
        </div>
      ) : (
        <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center py-5 px-4 sm:px-6">
          <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-6 md:p-10 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-blue-100 pb-3 text-center">
              👤 My Account Details
            </h1>
            {/* Profile Header (Avatar and Names) */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={`https://ui-avatars.com/api/?name=${user.fullName}&background=2563eb&color=fff&size=128`}
                alt="User Avatar"
                className="rounded-full w-32 h-32 shadow-lg ring-4 ring-blue-100 mb-4 object-cover"
              />
              <h2 className="text-3xl font-extrabold text-gray-900">
                {user.fullName || "Student User"}
              </h2>
              <p className="text-blue-600 font-medium mt-1">
                {user.email || "N/A"}
              </p>
            </div>

            {/* Profile Info Table */}
            <div className="space-y-4 text-gray-700 p-4 border rounded-xl bg-gray-50">
              <DetailRow label="Full Name" value={user.fullName} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow
                label="Phone Number"
                value={user.phoneNumber || "Not provided"}
              />
              <DetailRow
                label="Class Level"
                value={user.classLevel || "Not set"}
                isLevel={true}
              />
            </div>

            {/* Actions - Responsive Grid/Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {/* Edit Profile */}
              <button
                onClick={() => navigate(`/profileStd/${user._id}/edit`)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-bold shadow-md transform hover:scale-[1.01] text-sm sm:text-base"
              >
                ✏️ Edit Profile
              </button>

              {/* Reset Password */}
              <button
                onClick={() => navigate(`/reset-password`)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition font-bold shadow-md transform hover:scale-[1.01] text-sm sm:text-base"
              >
                🔑 Reset Password
              </button>

              {/* Forget Password (Often redundant with Reset, but kept as requested) */}
              <button
                onClick={() => navigate("/forgot-password")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl transition font-bold shadow-md transform hover:scale-[1.01] text-sm sm:text-base"
              >
                ❓ Forgot Password
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition font-bold shadow-md transform hover:scale-[1.01] text-sm sm:text-base"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;
