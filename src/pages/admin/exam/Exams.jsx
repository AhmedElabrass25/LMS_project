import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 10;

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(
          "https://edu-master-psi.vercel.app/exam",
          {
            headers: { token },
          }
        );
        setExams(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token]);
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
      try {
        const res = await axios.delete(
          `https://edu-master-psi.vercel.app/exam/${id}`,
          {
            headers: { token },
          }
        );
        console.log(res);
        toast.success("Exam deleted successfully!");
        setExams((prev) => prev.filter((e) => e._id !== id));

        // ✅ Show success popup
        Swal.fire({
          title: "Deleted!",
          text: "The exam has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete exam");
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the exam.",
          icon: "error",
        });
      }
    }
  };

  // Pagination Logic
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  const totalPages = Math.ceil(exams.length / examsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (loading) {
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );
  }
  return (
    <LayoutAdmin>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">All Exams</h2>
        {currentExams.length === 0 ? (
          <p className="text-center text-gray-500">No exams found.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">Duration</th>
                  <th className="p-3 border">Level</th>
                  <th className="p-3 border">Questions</th>
                  <th className="p-3 border">Created At</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentExams.map((exam, index) => (
                  <tr key={exam._id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      {(currentPage - 1) * examsPerPage + index + 1}
                    </td>
                    <td className="p-3 border font-medium">{exam.title}</td>
                    <td className="p-3 border">{exam.duration || "—"}</td>
                    <td className="p-3 border">{exam.classLevel || "—"}</td>
                    <td className="p-3 border">{exam.questions.length}</td>

                    <td className="p-3 border">
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/updateExam/${exam._id}`)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default Exams;
