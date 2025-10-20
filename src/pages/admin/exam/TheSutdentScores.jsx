// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import Loading from "../../../components/Loading";
// import LayoutAdmin from "../../../layouts/LayoutAdmin";
// import { jwtDecode } from "jwt-decode";

// const TheStudentScores = () => {
//   const [scores, setScores] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");
//   //   extract data from token with jwt-decode
//   const info = jwtDecode(token);
//   console.log(info);

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const res = await axios.get(
//           `https://edu-master-psi.vercel.app/studentExam/exams/score/${info._id}`,
//           {
//             headers: { token },
//           }
//         );
//         console.log(res);
//         setScores(res.data?.data || []);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load scores");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScores();
//   }, []);

//   if (loading)
//     return (
//       <LayoutAdmin>
//         <Loading />
//       </LayoutAdmin>
//     );

//   if (scores.length === 0)
//     return (
//       <LayoutAdmin>
//         <p className="text-center text-gray-600 mt-5">No exam scores yet.</p>
//       </LayoutAdmin>
//     );

//   return (
//     <LayoutAdmin>
//       <div className="p-6 bg-white shadow rounded-lg">
//         <h2 className="text-2xl font-semibold mb-4 text-center">
//           🎓 Student Exam Scores
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="py-3 px-4 text-left border">#</th>
//                 <th className="py-3 px-4 text-left border">Exam Name</th>
//                 <th className="py-3 px-4 text-left border">Score</th>
//                 <th className="py-3 px-4 text-left border">Status</th>
//                 <th className="py-3 px-4 text-left border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {scores.map((exam, index) => (
//                 <tr
//                   key={exam._id || index}
//                   className="hover:bg-gray-50 transition-all"
//                 >
//                   <td className="py-3 px-4 border">{index + 1}</td>
//                   <td className="py-3 px-4 border">
//                     {exam.examName || "Unknown"}
//                   </td>
//                   <td className="py-3 px-4 border">{exam.score}</td>
//                   <td
//                     className={`py-3 px-4 border font-semibold ${
//                       exam.score >= 50 ? "text-green-600" : "text-red-500"
//                     }`}
//                   >
//                     {exam.score >= 50 ? "Passed" : "Failed"}
//                   </td>
//                   <td className="py-3 px-4 border">
//                     {new Date(exam.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </LayoutAdmin>
//   );
// };

// export default TheStudentScores;
