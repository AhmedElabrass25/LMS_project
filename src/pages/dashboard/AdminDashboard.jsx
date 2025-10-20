// src/pages/dashboard/AdminDashboard.jsx
import { jwtDecode } from "jwt-decode";
import LayoutAdmin from "../../layouts/LayoutAdmin";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);

  let admin = null;

  if (token) {
    admin = jwtDecode(token);
  }
  useEffect(() => {
    // GET ALL USERS
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-psi.vercel.app/admin/all-user",
          {
            headers: {
              token,
            },
          }
        );
        setUsers(response.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    // get all lessons
    const getLessons = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-psi.vercel.app/lesson",
          {
            headers: {
              token,
            },
          }
        );
        setLessons(response.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
    getLessons();
  }, []);

  return (
    <LayoutAdmin>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back{admin ? `, ${admin.email.split("@")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of the system performance and activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Students",
              value: `${users?.length}`,
              color: "blue",
              icon: "👨‍🎓",
            },
            {
              title: "Total Courses",
              value: `${lessons?.length}`,
              color: "green",
              icon: "📘",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-center justify-between`}
            >
              <div>
                <h3 className="text-gray-600 font-medium">{card.title}</h3>
                <p className={`text-3xl font-bold text-${card.color}-600 mt-1`}>
                  {card.value}
                </p>
              </div>
              <div
                className={`bg-${card.color}-100 text-${card.color}-600 p-3 rounded-full text-xl`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Activities
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    User
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Action
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    user: "Ahmed Elabrass",
                    action: "Created a new course",
                    date: "2025-10-18",
                  },
                  {
                    user: "Omar Ali",
                    action: "Approved student enrollment",
                    date: "2025-10-17",
                  },
                  {
                    user: "Sara Mohamed",
                    action: "Updated exam questions",
                    date: "2025-10-16",
                  },
                ].map((activity, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{activity.user}</td>
                    <td className="p-3">{activity.action}</td>
                    <td className="p-3 text-gray-500">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminDashboard;
