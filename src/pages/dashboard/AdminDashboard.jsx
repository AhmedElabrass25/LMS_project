import { jwtDecode } from "jwt-decode";
import LayoutAdmin from "../../layouts/LayoutAdmin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll as fetchAllLessons } from "../../redux/slices/lessonSlice";
import { fetchAll as fetchAllUsers } from "../../redux/slices/userSlice";
import { fetchAll as fetchAllExams } from "../../redux/slices/examSlice";

import Loading from "../../components/Loading";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: lessons } = useSelector((state) => state.lessons);
  const { users, loading } = useSelector((state) => state.users);
  const { exams } = useSelector((state) => state.exams);

  const token = localStorage.getItem("token");
  const admin = token ? jwtDecode(token) : null;

  useEffect(() => {
    // get all users data
    dispatch(fetchAllUsers());
    // get all lessons data
    dispatch(fetchAllLessons());
    // get all exams data
    dispatch(fetchAllExams());
  }, [dispatch]);

  const recentUsers = [...(users || [])].slice(-5).reverse();

  return (
    // <LayoutAdmin>
    //   <div className="p-2 sm:p-6 bg-gray-100 min-h-screen">
    //     {/* Header Section */}
    //     <div className="mb-8 text-center sm:text-left">
    //       <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
    //         Welcome back{admin ? `, ${admin.email.split("@")[0]}` : ""}! 👋
    //       </h1>
    //       <p className="text-gray-600 mt-1 text-sm sm:text-base">
    //         Here's an overview of the system performance and activity.
    //       </p>
    //     </div>

    //     {/* Stats Cards */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
    //       {[
    //         {
    //           title: "Total Students",
    //           value: `${users?.length || 0}`,
    //           color: "blue",
    //           icon: "👨‍🎓",
    //         },
    //         {
    //           title: "Total Courses",
    //           value: `${lessons?.length || 0}`,
    //           color: "green",
    //           icon: "📘",
    //         },
    //       ].map((card, index) => (
    //         <div
    //           key={index}
    //           className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 sm:p-6 flex items-center justify-between`}
    //         >
    //           <div>
    //             <h3 className="text-gray-600 font-medium text-sm sm:text-base">
    //               {card.title}
    //             </h3>
    //             <p
    //               className={`text-2xl sm:text-3xl font-bold text-${card.color}-600 mt-1`}
    //             >
    //               {card.value}
    //             </p>
    //           </div>
    //           <div
    //             className={`bg-${card.color}-100 text-${card.color}-600 p-3 sm:p-4 rounded-full text-lg sm:text-xl`}
    //           >
    //             {card.icon}
    //           </div>
    //         </div>
    //       ))}
    //     </div>

    //     {/* Recent Users Table */}
    //     <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 overflow-hidden">
    //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
    //         <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
    //           Recent Users
    //         </h2>
    //         <button
    //           onClick={() => navigate("/allUsers")}
    //           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
    //         >
    //           View All
    //         </button>
    //       </div>

    //       <div className="overflow-x-auto rounded-lg">
    //         {loading ? (
    //           <Loading />
    //         ) : recentUsers.length === 0 ? (
    //           <p className="text-gray-600 text-center py-4">
    //             No users found yet.
    //           </p>
    //         ) : (
    //           <table className="min-w-full border border-gray-200 text-sm">
    //             <thead className="bg-gray-50">
    //               <tr>
    //                 <th className="p-3 text-left font-semibold text-gray-700">
    //                   Name
    //                 </th>
    //                 <th className="p-3 text-left font-semibold text-gray-700">
    //                   Email
    //                 </th>
    //                 <th className="p-3 text-left font-semibold text-gray-700">
    //                   Joined Date
    //                 </th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {recentUsers.map((user, index) => (
    //                 <tr
    //                   key={index}
    //                   className="border-t hover:bg-gray-50 transition"
    //                 >
    //                   <td className="p-3 break-words">
    //                     {user.fullName || "Unknown"}
    //                   </td>
    //                   <td className="p-3 break-all">{user.email}</td>
    //                   <td className="p-3 text-gray-500">
    //                     {new Date(user.createdAt).toLocaleDateString()}
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </LayoutAdmin>
    <LayoutAdmin>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8 p-4 sm:p-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 break-words text-center sm:text-left">
            Welcome back{admin ? `, ${admin.email.split("@")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg text-center sm:text-left">
            Here's an overview of the system performance and recent activity.
          </p>
        </div>

        {/* Stat Cards - BOLDER DESIGN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {[
            {
              title: "Total Students",
              value: `${users?.length || 0}`,
              color: "blue",
              icon: "👨‍🎓",
            },
            {
              title: "Total Courses",
              value: `${lessons?.length || 0}`,
              color: "green",
              icon: "📘",
            },
            // Placeholder for a third card, e.g., "Total Exams"
            {
              title: "Total Exams",
              value: `${exams?.length || 0}`, // Replace with actual data (e.g., exams?.length)
              color: "purple",
              icon: "🧠",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-5 sm:p-6 flex items-center justify-between border-b-4 border-${card.color}-500`}
            >
              <div>
                <h3 className="text-gray-600 font-semibold text-sm sm:text-base uppercase tracking-wider">
                  {card.title}
                </h3>
                <p
                  className={`text-3xl sm:text-4xl font-extrabold text-${card.color}-600 mt-1`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`bg-${card.color}-100 text-${card.color}-600 p-4 rounded-full text-2xl shadow-inner`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              ⏳ Recent User Registrations
            </h2>
            <button
              onClick={() => navigate("/allUsers")}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium text-sm shadow-md hover:shadow-lg w-full sm:w-auto transform hover:scale-[1.02]"
            >
              View All Users →
            </button>
          </div>

          {loading ? (
            <Loading />
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-600 text-center py-6 text-lg border-t border-gray-100">
              No new users found yet.
            </p>
          ) : (
            <>
              {/*
            TABLE VIEW (Desktop/Tablet - sm breakpoint and up)
            *** MODERN DESIGN APPLIED ***
          */}
              <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 w-12">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Full Name
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Email
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-sm">
                    {recentUsers.map((user, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-5 py-4 whitespace-nowrap text-gray-600 font-medium text-center">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {user.fullName || "Unknown"}
                        </td>
                        <td className="px-5 py-4 break-all text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*
            CARD VIEW (Mobile - below sm breakpoint)
          */}
              <div className="sm:hidden grid gap-3">
                {recentUsers.map((user, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg shadow-sm p-4 space-y-2 border border-gray-200"
                  >
                    <div className="flex justify-between items-center border-b pb-2">
                      <p className="font-bold text-lg text-gray-800">
                        {user.fullName || "Unknown"}
                      </p>
                      <span className="text-sm font-medium text-blue-600">
                        New User #{index + 1}
                      </span>
                    </div>

                    <p className="text-sm break-all text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Email:
                      </span>{" "}
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 pt-1">
                      <span className="font-semibold">Joined:</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminDashboard;
