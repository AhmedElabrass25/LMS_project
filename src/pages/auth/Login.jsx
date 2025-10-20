// import { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email").required("Email is required"),
//       password: Yup.string().required("Password is required"),
//     }),
//     onSubmit: async (values) => {
//       // =====================================

//       setLoading(true);
//       setMessage("");
//       try {
//         const res = await axios.post(
//           "https://edu-master-psi.vercel.app/auth/login",

//           values
//         );
//         console.log(res);
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("role", res.data.role);
//         console.log(res);
//         setMessage("Login successful!");
//         const role = localStorage.getItem("role");
//         const token = localStorage.getItem("token");

//         if (token && role === "admin") {
//           navigate("/adminDashboard");
//           return;
//         } else {
//           navigate("/dashboardStd");
//         }
//       } catch (err) {
//         setMessage(err.response?.data?.message || "Invalid credentials");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

//         <form onSubmit={formik.handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {formik.touched.email && formik.errors.email && (
//             <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
//           )}

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formik.values.password}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {formik.touched.password && formik.errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {formik.errors.password}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200 flex justify-center items-center"
//           >
//             {loading ? (
//               <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
//             ) : (
//               "Login"
//             )}
//           </button>

//           {message && (
//             <p className="text-center mt-3 text-red-600">{message}</p>
//           )}
//         </form>
//         {/* if you have not account */}
//         <div className="text-center mt-6">
//           <p className="text-gray-600">
//             Don't have an account?{" "}
//             <a href="/register" className="text-blue-600 hover:underline">
//               Register up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Login;
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setMessage("");

      try {
        const { data } = await axios.post(
          "https://edu-master-psi.vercel.app/auth/login",
          values
        );

        // Save token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        setMessage("Login successful!");

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/dashboardStd");
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Invalid email or password";
        setMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Welcome Back 👋
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200 flex justify-center items-center"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : (
              "Login"
            )}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center mt-3 ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {/* Register link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
