import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;

  const token = localStorage.getItem("token");

  // Fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://edu-master-psi.vercel.app/question",
          {
            headers: { token },
          }
        );
        // console.log(res);
        setQuestions(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  // SweetAlert delete confirmation
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
      try {
        await axios.delete(`https://edu-master-psi.vercel.app/question/${id}`, {
          headers: { token },
        });
        setQuestions((prev) => prev.filter((q) => q._id !== id));
        toast.success("Question deleted successfully!");
        Swal.fire("Deleted!", "Your question has been removed.", "success");
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to delete question"
        );
      }
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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Questions</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Text</th>
                <th className="py-3 px-4 border">Type</th>
                <th className="py-3 px-4 border">Answer</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((q, index) => (
                  <tr key={q._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      {firstIndex + index + 1}
                    </td>
                    <td className="py-2 px-4 border">{q.text}</td>
                    <td className="py-2 px-4 border">{q.type}</td>
                    <td className="py-2 px-4 border">{q.correctAnswer}</td>
                    <td className="py-2 px-4 border flex justify-center gap-2">
                      <Link
                        to={`/updateQuestion/${q._id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-4 font-medium"
                  >
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AllQuestions;
