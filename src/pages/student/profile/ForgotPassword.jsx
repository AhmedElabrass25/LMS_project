import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../../redux/slices/profileSlice";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const { loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setMessage("");
    dispatch(forgetPassword(values));
    navigate("/reset-password");
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
            Forgot Password
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </Form>
            )}
          </Formik>

          {message && (
            <div className="mt-4 text-center text-sm text-gray-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForgotPassword;
