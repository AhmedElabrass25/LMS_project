import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteOne, fetchAll } from "../../../redux/slices/lessonSlice";

const AllLessons = () => {
  // const [lessons, setLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const {
    items: lessons,
    loading,
    pagination,
  } = useSelector((state) => state.lessons);
  const { totalPages } = pagination;
  const dispatch = useDispatch();
  // ✅ SweetAlert Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(deleteOne(id));
    }
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      dispatch(fetchAll(page));
    }
  };
  useEffect(() => {
    dispatch(fetchAll(currentPage));
  }, [dispatch, currentPage]);

  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );
  return (
    <LayoutAdmin>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-4 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center text-gray-800">
            📚 All Lessons
          </h2>

          {lessons.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No lessons found. Time to create one! ✏️
            </p>
          ) : (
            <>
              {/*
            TABLE VIEW (Desktop/Tablet - sm breakpoint and up)
            *** MODERN DESIGN REVISION APPLIED HERE ***
          */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "#",
                        "Title",
                        "Description",
                        "Video",
                        "Class Level",
                        "Scheduled Date",
                        "Price",
                        "Actions",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {lessons.map((lesson, index) => (
                      <tr
                        key={lesson._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 w-12 text-center">
                          {index + 1 + (currentPage - 1) * 10}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lesson.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden truncate">
                          {lesson.description.slice(0, 40)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <a
                            href={lesson.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 font-medium text-sm underline transition"
                          >
                            Watch
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {lesson.classLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {new Date(lesson.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-center">
                          ${lesson.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                          {lesson.isPaid === false && (
                            <button
                              onClick={() =>
                                navigate(`/updateLesson/${lesson._id}`)
                              }
                              className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1.5 rounded-full shadow-md transition text-xs transform hover:scale-105"
                            >
                              {/* <FaEdit /> */} Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(lesson._id)}
                            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-full shadow-md transition text-xs transform hover:scale-105"
                          >
                            {/* <FaTrash /> */} Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*
            CARD VIEW (Mobile - below sm breakpoint) - Unchanged
          */}
              <div className="sm:hidden grid gap-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="bg-white rounded-lg shadow-md p-4 space-y-3 border border-gray-200"
                  >
                    <div className="flex justify-between items-start border-b pb-2">
                      <h3 className="font-extrabold text-lg text-gray-800">
                        {lesson.title}
                      </h3>
                      <span className="font-semibold text-xl text-green-600">
                        ${lesson.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Level:
                      </span>{" "}
                      {lesson.classLevel}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      {new Date(lesson.scheduledDate).toLocaleDateString()}
                    </p>

                    <p className="text-sm italic text-gray-500">
                      {lesson.description.slice(0, 100)}...
                    </p>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed">
                      <a
                        href={lesson.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium underline text-sm hover:text-blue-800 transition"
                      >
                        Watch Video 🎥
                      </a>
                      <p className="text-xs font-medium px-2 py-1 rounded-full border border-gray-300">
                        Lesson #{index + 1 + (currentPage - 1) * 10}
                      </p>
                    </div>

                    <div className="flex justify-around gap-2 pt-2">
                      {lesson.isPaid === false && (
                        <button
                          onClick={() =>
                            navigate(`/updateLesson/${lesson._id}`)
                          }
                          className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-2 rounded-full shadow-md transition text-sm"
                        >
                          {/* <FaEdit /> */} Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded-full shadow-md transition text-sm"
                      >
                        {/* <FaTrash /> */} Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-8 space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1.5 rounded-lg font-semibold shadow-sm transition text-sm sm:text-base ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AllLessons;
