import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../../redux/slices/profileSlice";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    cpassword: "",
  });
  const { loading } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(resetPassword(form));
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">OTP Code</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="cpassword"
                value={form.cpassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ResetPassword;
