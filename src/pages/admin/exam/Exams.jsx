import { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteOne, fetchAll } from "../../../redux/slices/examSlice";

const Exams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, exams } = useSelector((state) => state.exams);
  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch, currentPage]);

  // ✅ SweetAlert Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(deleteOne(id));
      dispatch(fetchAll(currentPage));
    }
  };

  // ✅ Pagination logic (frontend)
  const totalExams = exams.length;
  const totalPages = Math.ceil(totalExams / examsPerPage);
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
            🧠 All Exams
          </h2>

          {exams.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-8">
              No exams found. Start creating new assessments!
            </p>
          ) : (
            <>
              {/*
            TABLE VIEW (Desktop/Tablet - sm breakpoint and up)
          */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      {[
                        "#",
                        "Title",
                        "Duration",
                        "Level",
                        "Questions",
                        "Created At",
                        "Actions",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentExams.map((exam, index) => (
                      <tr
                        key={exam._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-600 w-12 text-center">
                          {(currentPage - 1) * examsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {exam.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {exam.duration || "—"} min
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {exam.classLevel || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-700 text-center">
                          {exam.questions.length}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                          {new Date(exam.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                          <button
                            onClick={() => navigate(`/updateExam/${exam._id}`)}
                            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1.5 rounded-full shadow transition text-xs transform hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exam._id)}
                            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1.5 rounded-full shadow transition text-xs transform hover:scale-105"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*
            CARD VIEW (Mobile - below sm breakpoint)
          */}
              <div className="sm:hidden grid gap-4">
                {currentExams.map((exam, index) => (
                  <div
                    key={exam._id}
                    className="bg-white rounded-lg shadow-md p-4 space-y-3 border border-gray-200"
                  >
                    <div className="flex justify-between items-start border-b pb-2">
                      <h3 className="font-extrabold text-lg text-gray-800">
                        {exam.title}
                      </h3>
                      <p className="text-xs font-medium px-2 py-1 rounded-full border border-gray-300">
                        Exam #{(currentPage - 1) * examsPerPage + index + 1}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">
                          Questions:
                        </span>{" "}
                        <span className="font-bold text-blue-700">
                          {exam.questions.length}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">
                          Level:
                        </span>{" "}
                        <span className="font-medium text-indigo-800">
                          {exam.classLevel || "—"}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">
                          Duration:
                        </span>{" "}
                        <span className="font-medium text-green-800">
                          {exam.duration || "—"} min
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-around gap-2 pt-2 border-t border-dashed">
                      <button
                        onClick={() => navigate(`/updateExam/${exam._id}`)}
                        className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-2 rounded-full shadow transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded-full shadow transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* --- */}

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

export default Exams;
