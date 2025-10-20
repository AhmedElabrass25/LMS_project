// src/pages/dashboard/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must login first");
      navigate("/login");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://edu-master-psi.vercel.app/user/", {
          headers: { token },
        });
        setUser(res.data.data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);
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
      try {
        const res = await axios.delete(
          "https://edu-master-psi.vercel.app/user/",
          {
            headers: { token: localStorage.getItem("token") },
          }
        );
        toast.success(res.data.message);
        localStorage.removeItem("token");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete account");
      }
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <Loading />
      ) : !user ? (
        <div className="flex justify-center items-center h-[70vh] text-xl text-red-500">
          No user data found
        </div>
      ) : (
        <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center py-10 md:px-4">
          <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${user.fullName}&background=2563eb&color=fff&size=128`}
                alt="User Avatar"
                className="rounded-full w-28 h-28 shadow-md mb-4"
              />
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Full Name</span>
                <span>{user.fullName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Phone</span>
                <span>{user.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Class Level</span>
                <span>{user.classLevel || "Not set"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate(`/profileStd/${user._id}/edit`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate(`/reset-password`)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
              >
                Reset Password
              </button>
              {/* ad btn forget password */}
              <button
                onClick={() => navigate("/forgot-password")}
                className="flex-1 bg-yellow-800 hover:bg-yellow-900 text-white py-2 rounded-lg transition"
              >
                Forget Password
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;
