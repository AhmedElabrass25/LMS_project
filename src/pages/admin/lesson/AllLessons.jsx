// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import LayoutAdmin from "../../../layouts/LayoutAdmin";
// import Loading from "../../../components/Loading";
// import { useNavigate } from "react-router-dom";
// import { FaTrash, FaEdit } from "react-icons/fa";
// import Swal from "sweetalert2";

// const AllLessons = () => {
//   const [lessons, setLessons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const fetchLessons = async (currentPage = 1) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://edu-master-psi.vercel.app/lesson?page=${currentPage}`,
//         { headers: { token } }
//       );
//       setLessons(res.data.data || []);
//       setPage(res.data.pagination.page);
//       setTotalPages(res.data.pagination.totalPages);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to fetch lessons");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#2563eb", // blue-600
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await axios.delete(
//           `https://edu-master-psi.vercel.app/lesson/${id}`,
//           {
//             headers: { token },
//           }
//         );
//         console.log(res);
//         toast.success("Lesson deleted successfully!");
//         setLessons((prev) => prev.filter((l) => l._id !== id));

//         // ✅ Success popup
//         Swal.fire({
//           title: "Deleted!",
//           text: "The lesson has been removed successfully.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Failed to delete lesson");

//         // ❌ Error popup
//         Swal.fire({
//           title: "Error!",
//           text: "Something went wrong while deleting the lesson.",
//           icon: "error",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     fetchLessons(page);
//   }, [page]);

//   if (loading)
//     return (
//       <LayoutAdmin>
//         <Loading />
//       </LayoutAdmin>
//     );

//   return (
//     <LayoutAdmin>
//       <div className="p-6 bg-white rounded-lg shadow-md mt-10">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
//           All Lessons
//         </h2>

//         {lessons.length === 0 ? (
//           <p className="text-center text-gray-500">No lessons found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-300 rounded-md">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th className="p-3 text-left">#</th>
//                   <th className="p-3 text-left">Title</th>
//                   <th className="p-3 text-left">Description</th>
//                   <th className="p-3 text-left">Video</th>
//                   <th className="p-3 text-left">Class Level</th>
//                   <th className="p-3 text-left">Scheduled Date</th>
//                   <th className="p-3 text-left">Price</th>
//                   <th className="p-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lessons.map((lesson, index) => (
//                   <tr
//                     key={lesson._id}
//                     className="border-b hover:bg-gray-100 transition"
//                   >
//                     <td className="p-3">{index + 1 + (page - 1) * 10}</td>
//                     <td className="p-3 font-medium">{lesson.title}</td>
//                     <td className="p-3 text-sm text-gray-700">
//                       {lesson.description.slice(0, 60)}...
//                     </td>
//                     <td className="p-3 text-blue-600">
//                       <a
//                         href={lesson.video}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline"
//                       >
//                         Watch
//                       </a>
//                     </td>
//                     <td className="p-3">{lesson.classLevel}</td>
//                     <td className="p-3">
//                       {new Date(lesson.scheduledDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-3 font-semibold text-green-600">
//                       ${lesson.price}
//                     </td>
//                     <td className="p-3 flex justify-center gap-3">
//                       {lesson.isPaid == false && (
//                         <button
//                           onClick={() =>
//                             navigate(`/updateLesson/${lesson._id}`)
//                           }
//                           className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
//                         >
//                           <FaEdit /> Edit
//                         </button>
//                       )}

//                       <button
//                         onClick={() => handleDelete(lesson._id)}
//                         className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="flex justify-center gap-2 mt-4">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setPage(i + 1)}
//                   className={`px-3 py-1 rounded-md ${
//                     page === i + 1
//                       ? "bg-blue-700 text-white"
//                       : "bg-blue-500 text-white hover:bg-blue-600"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </LayoutAdmin>
//   );
// };

// export default AllLessons;
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const AllLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Fetch Lessons
  const fetchLessons = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://edu-master-psi.vercel.app/lesson?page=${page}`,
        { headers: { token } }
      );
      setLessons(res.data.data || []);
      setCurrentPage(res.data.pagination.page);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

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
      try {
        const res = await axios.delete(
          `https://edu-master-psi.vercel.app/lesson/${id}`,
          { headers: { token } }
        );
        console.log(res);
        toast.success("Lesson deleted successfully!");
        setLessons((prev) => prev.filter((l) => l._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The lesson has been removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to delete lesson");

        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the lesson.",
          icon: "error",
        });
      }
    }
  };

  // ✅ Handle Pagination Change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchLessons(page);
    }
  };

  useEffect(() => {
    fetchLessons(currentPage);
  }, []);

  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  return (
    <LayoutAdmin>
      <div className="p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          All Lessons
        </h2>

        {lessons.length === 0 ? (
          <p className="text-center text-gray-500">No lessons found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Video</th>
                  <th className="p-3 text-left">Class Level</th>
                  <th className="p-3 text-left">Scheduled Date</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr
                    key={lesson._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">
                      {index + 1 + (currentPage - 1) * 10}
                    </td>
                    <td className="p-3 font-medium">{lesson.title}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {lesson.description.slice(0, 60)}...
                    </td>
                    <td className="p-3 text-blue-600">
                      <a
                        href={lesson.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Watch
                      </a>
                    </td>
                    <td className="p-3">{lesson.classLevel}</td>
                    <td className="p-3">
                      {new Date(lesson.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      ${lesson.price}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      {lesson.isPaid == false && (
                        <button
                          onClick={() =>
                            navigate(`/updateLesson/${lesson._id}`)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Clean Pagination UI */}
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
        )}
      </div>
    </LayoutAdmin>
  );
};

export default AllLessons;
