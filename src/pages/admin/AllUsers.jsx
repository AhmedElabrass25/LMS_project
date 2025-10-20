import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import LayoutAdmin from "../../layouts/LayoutAdmin";
import { jwtDecode } from "jwt-decode";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // عدد المستخدمين في الصفحة الواحدة

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // const decodedToken = jwtDecode(token);
    // console.log("Decoded Token:", decodedToken);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-psi.vercel.app/admin/all-user",
          {
            headers: {
              token,
            },
          }
        );

        // console.log(response);
        setUsers(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "فشل في جلب المستخدمين");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  if (error)
    return (
      <LayoutAdmin>
        <p className="text-center text-red-600">{error}</p>
      </LayoutAdmin>
    );

  return (
    <LayoutAdmin>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
          All Registered Users
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Full Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Class Level</th>
                  <th className="p-3 border">Verified</th>
                  <th className="p-3 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, i) => (
                  <tr
                    key={user._id || i}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="p-3 border text-center">
                      {indexOfFirstUser + i + 1}
                    </td>
                    <td className="p-3 border font-medium">{user.fullName}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.phoneNumber}</td>
                    <td className="p-3 border capitalize text-center">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          user.role === "admin" ? "bg-green-600" : "bg-blue-600"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {user.classLevel || "—"}
                    </td>
                    <td className="p-3 border text-center">
                      {user.isVerified ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="p-3 border text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <p className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}
