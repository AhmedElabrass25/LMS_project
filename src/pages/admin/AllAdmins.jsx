import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import LayoutAdmin from "../../layouts/LayoutAdmin";
import { jwtDecode } from "jwt-decode";

export default function AllAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) return;
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-psi.vercel.app/admin/all-admin",
          {
            headers: {
              token,
            },
          }
        );
        console.log(response);
        setAdmins(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Fail to fetch admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Pagination
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(admins.length / adminsPerPage);

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
          All Admin Accounts
        </h2>

        {admins.length === 0 ? (
          <p className="text-gray-600 text-center">No admins found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 whitespace-nowrap">#</th>
                  <th className="p-3 whitespace-nowrap">Full Name</th>
                  <th className="p-3 whitespace-nowrap">Email</th>
                  <th className="p-3 whitespace-nowrap">Phone</th>
                  <th className="p-3 whitespace-nowrap">Role</th>
                  <th className="p-3 whitespace-nowrap">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentAdmins.map((admin, i) => (
                  <tr
                    key={admin._id || i}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="p-3 text-center font-medium">
                      {indexOfFirstAdmin + i + 1}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      {admin.fullName}
                    </td>
                    <td className="p-3 break-words max-w-[200px]">
                      {admin.email}
                    </td>
                    <td className="p-3">{admin.phoneNumber}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-600 text-white">
                        {admin.role || "admin"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {admins.length > adminsPerPage && (
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
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
        )}
      </div>
    </LayoutAdmin>
  );
}
