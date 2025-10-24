import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import LayoutAdmin from "../../layouts/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll } from "../../redux/slices/userSlice";

export default function AllUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 13; // ✅ عدد المستخدمين في كل صفحة

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // ✅ حساب المستخدمين في الصفحة الحالية
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // ✅ حساب عدد الصفحات الكلي
  const totalPages = Math.ceil(users.length / usersPerPage);

  // ✅ وظائف التنقل بين الصفحات
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
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-2 text-center sm:text-left">
          👥 All Registered Users
        </h2>

        {currentUsers.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No users found. 😔</p>
        ) : (
          <>
            {/*
          TABLE VIEW for Laptops and Desktops (sm breakpoint and up)
          *** MODERN DESIGN REVISION APPLIED HERE ***
        */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-32">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-24">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-24">
                      Class
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-24">
                      Verified
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-28">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentUsers.map((user, i) => (
                    <tr
                      key={user._id || i}
                      className="hover:bg-blue-50 transition-colors duration-150 text-sm"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-center font-medium text-gray-600">
                        {indexOfFirstUser + i + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 break-all text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center capitalize">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-green-600"
                              : "bg-indigo-500"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">
                        {user.classLevel || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {user.isVerified ? (
                          <span className="text-green-600 font-bold text-sm">
                            Yes ✅
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold text-sm">
                            No ❌
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-center">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*
          CARD VIEW for Mobile Phones (screens smaller than 'sm') - UNCHANGED
        */}
            <div className="sm:hidden grid gap-4">
              {currentUsers.map((user, i) => (
                <div
                  key={user._id || i}
                  className="bg-white rounded-lg shadow-md p-4 space-y-2 text-gray-700 border border-gray-200"
                >
                  <div className="flex justify-between items-center border-b pb-1">
                    <p className="font-bold text-lg text-blue-700">
                      {user.fullName}
                    </p>
                    <span className="text-sm font-medium text-gray-500">
                      #{indexOfFirstUser + i + 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Role:</span>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs capitalize ${
                        user.role === "admin" ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </div>
                  <p className="text-sm break-all">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {user.phoneNumber || "—"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Class:</span>{" "}
                    {user.classLevel || "—"}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Verified:</span>
                    {user.isVerified ? (
                      <span className="text-green-600 font-semibold">
                        Yes ✅
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">No ❌</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 pt-1 border-t mt-2">
                    <span className="font-medium">Registered:</span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* The pagination controls were already responsive, but I'll keep the styles clean */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base transition duration-150 ease-in-out"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm sm:text-base transition duration-150 ease-in-out ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base transition duration-150 ease-in-out"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
}
