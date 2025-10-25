// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../../../layouts/DashboardLayout";
// import Loading from "../../../components/Loading";
// import { fetchOne } from "../../../redux/slices/profileSlice";
// import { fetchAll } from "../../../redux/slices/examSlice";
// import { useDispatch, useSelector } from "react-redux";
// // import axios from "axios";

// const AllExams = () => {
//   const [filterExams, setFilterExams] = useState([]);
//   // const [takenExams, setTakenExams] = useState([]); // 🆕 store finished exams
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { profile } = useSelector((state) => state.profile);
//   const { exams } = useSelector((state) => state.exams);
//   console.log(filterExams);
//   // const token = localStorage.getItem("token");

//   // 1️⃣ Fetch exams + profile
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await dispatch(fetchOne());
//         await dispatch(fetchAll());
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   // 2️⃣ Filter exams by class level
//   useEffect(() => {
//     if (profile && exams.length > 0) {
//       const filtered = exams.filter(
//         (exam) => exam.classLevel === profile.classLevel
//       );
//       setFilterExams(filtered);
//     }
//   }, [profile, exams]);

//   // // 3️⃣ Fetch finished exams (scores)
//   // useEffect(() => {
//   //   const fetchTakenExams = async () => {
//   //     if (!token || filterExams.length === 0) return;

//   //     try {
//   //       const results = await Promise.allSettled(
//   //         filterExams.map((exam) =>
//   //           axios
//   //             .get(
//   //               `https://edu-master-psi.vercel.app/studentExam/exams/score/${exam._id}`,
//   //               { headers: { token } }
//   //             )
//   //             .then((res) => ({
//   //               examId: exam._id,
//   //               score: res.data.data?.score ?? null,
//   //             }))
//   //             .catch(() => null)
//   //         )
//   //       );
//   //       const finished = results
//   //         .filter(
//   //           (r) =>
//   //             r.status === "fulfilled" &&
//   //             r.value !== null &&
//   //             r.value.score !== null
//   //         )
//   //         .map((r) => r.value.examId);
//   //       setTakenExams(finished);
//   //     } catch (error) {
//   //       if (error?.response?.status === 404) return null; // ignore not found
//   //       return null;
//   //     }
//   //   };

//   //   fetchTakenExams();
//   // }, [filterExams, token]);

//   if (loading)
//     return (
//       <DashboardLayout>
//         <Loading />
//       </DashboardLayout>
//     );

//   return (
//     <DashboardLayout>
//       <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//         <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b-4 border-blue-100 pb-3">
//           🧠 Available Exams & Quizzes
//         </h1>

//         {filterExams.length === 0 ? (
//           <div className="flex justify-center items-center h-[50vh]">
//             <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
//               <p className="text-2xl font-semibold text-gray-700 mb-2">
//                 No exams available right now.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filterExams.map((exam) => {
//               // const isTaken = takenExams.includes(exam._id);
//               return (
//                 <div
//                   key={exam._id}
//                   className={`bg-white shadow-xl rounded-2xl p-6 transition duration-300 hover:shadow-2xl transform hover:-translate-y-1 border-t-4 ${
//                     isTaken ? "border-green-600" : "border-blue-600"
//                   } flex flex-col`}
//                 >
//                   <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 border-b pb-3">
//                     {exam.title || "Untitled Exam"}
//                   </h2>

//                   <div className="space-y-3 flex-grow mb-6">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="font-medium text-gray-600 flex items-center">
//                         🕒 Duration:
//                       </span>
//                       <span className="font-semibold text-blue-600">
//                         {exam.duration || 30} mins
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center text-sm">
//                       <span className="font-medium text-gray-600 flex items-center">
//                         ❓ Questions:
//                       </span>
//                       <span className="font-semibold text-gray-800">
//                         {exam.questions?.length || 0}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center text-sm">
//                       <span className="font-medium text-gray-600 flex items-center">
//                         🎓 Level:
//                       </span>
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
//                         {exam.classLevel || "General"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   {isTaken ? (
//                     <div>
//                       <button
//                         disabled
//                         className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-semibold cursor-not-allowed mb-3"
//                       >
//                         ✅ Completed
//                       </button>
//                       <button
//                         onClick={() => navigate(`/viewExamResult/${exam._id}`)}
//                         className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
//                       >
//                         View Result
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => navigate(`/start-exam/${exam._id}`)}
//                       className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
//                     >
//                       🚀 Start Exam
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AllExams;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";
import { fetchOne } from "../../../redux/slices/profileSlice";
import { fetchAll } from "../../../redux/slices/examSlice";
import { useDispatch, useSelector } from "react-redux";

const AllExams = () => {
  const [filterExams, setFilterExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.profile);
  const { exams } = useSelector((state) => state.exams);

  // 1️⃣ Fetch exams + profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchOne());
        await dispatch(fetchAll());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // 2️⃣ Filter exams by class level
  useEffect(() => {
    if (profile && exams.length > 0) {
      const filtered = exams.filter(
        (exam) => exam.classLevel === profile.classLevel
      );
      setFilterExams(filtered);
    }
  }, [profile, exams]);

  if (loading)
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b-4 border-blue-100 pb-3">
          🧠 Available Exams & Quizzes
        </h1>

        {filterExams.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
              <p className="text-2xl font-semibold text-gray-700 mb-2">
                No exams available right now.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white shadow-xl rounded-2xl p-6 transition duration-300 hover:shadow-2xl transform hover:-translate-y-1 border-t-4 border-blue-600 flex flex-col"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 border-b pb-3">
                  {exam.title || "Untitled Exam"}
                </h2>

                <div className="space-y-3 flex-grow mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      🕒 Duration:
                    </span>
                    <span className="font-semibold text-blue-600">
                      {exam.duration || 30} mins
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      ❓ Questions:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {exam.questions?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600 flex items-center">
                      🎓 Level:
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {exam.classLevel || "General"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/start-exam/${exam._id}`)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  🚀 Start Exam
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllExams;
