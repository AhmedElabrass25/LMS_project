import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { deleteOne, fetchAll } from "../../../redux/slices/questionSlice";
const AllQuestions = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.questions);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  // Fetch all questions
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // Delete a question
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This question will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      dispatch(deleteOne(id));
    }
  };
  // Pagination
  const lastIndex = currentPage * questionsPerPage;
  const firstIndex = lastIndex - questionsPerPage;
  const currentQuestions = questions.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Loading State
  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  return (
    <LayoutAdmin>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
            ❓ All Questions
          </h2>

          {currentQuestions.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-8">
              No questions found. Add some new knowledge!
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                        Question Text
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-24">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-40">
                        Correct Answer
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-36">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentQuestions.map((q, index) => (
                      <tr
                        key={q._id}
                        className="hover:bg-blue-50 transition-colors duration-150 text-sm"
                      >
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-600 text-center">
                          {firstIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-900 max-w-xs overflow-hidden truncate">
                          {q.text}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                              q.type === "mcq"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {q.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap font-semibold">
                          {q.correctAnswer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                          <Link
                            to={`/updateQuestion/${q._id}`}
                            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded-full shadow transition text-xs transform hover:scale-105"
                          >
                            Update
                          </Link>
                          <button
                            onClick={() => handleDelete(q._id)}
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
                {currentQuestions.map((q, index) => (
                  <div
                    key={q._id}
                    className="bg-white rounded-lg shadow-md p-4 space-y-3 border border-gray-200"
                  >
                    <div className="flex justify-between items-start border-b pb-2">
                      <h3 className="font-extrabold text-gray-800 text-base leading-snug">
                        <span className="text-blue-600 mr-2">
                          Q{firstIndex + index + 1}:
                        </span>
                        {q.text}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-700">
                        Correct Answer:
                        <span className="ml-2 font-normal text-gray-800">
                          {q.correctAnswer}
                        </span>
                      </p>

                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-700">
                          Type:
                        </span>{" "}
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            q.type === "mcq"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {q.type}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-around gap-2 pt-2 border-t border-dashed">
                      <Link
                        to={`/updateQuestion/${q._id}`}
                        className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-2 rounded-full shadow transition text-sm"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(q._id)}
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

          {/* ✅ Pagination Controls - Made responsive */}
          <div className="flex flex-wrap justify-center items-center mt-8 space-x-1 sm:space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AllQuestions;
