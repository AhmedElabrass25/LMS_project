// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import DashboardLayout from "../../../layouts/DashboardLayout";
// import Loading from "../../../components/Loading";
// import { toast } from "react-hot-toast";

// const ViewResultExam = () => {
//   const { examId } = useParams();
//   const token = localStorage.getItem("token");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await axios.get(
//           `https://edu-master-psi.vercel.app/studentExam/exams/score/${examId}`,
//           { headers: { token } }
//         );
//         console.log(res.data.data);
//         setResult(res.data?.data);
//       } catch (err) {
//         console.error("[Result Error]:", err);
//         toast.error(err.response?.data?.message || "Failed to load result");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchResult();
//   }, [examId, token]);

//   if (loading)
//     return (
//       <DashboardLayout>
//         <Loading />
//       </DashboardLayout>
//     );

//   if (!result)
//     return (
//       <DashboardLayout>
//         <div className="p-6 text-center text-gray-500">
//           No result found for this exam.
//         </div>
//       </DashboardLayout>
//     );

//   const { score, totalQuestions, correctAnswers } = result || {};
//   const passed = score >= 50; // أو غيرها حسب نظامك

//   return (
//     <DashboardLayout>
//       <div className="p-8 space-y-6 text-center">
//         <h1 className="text-3xl font-bold text-blue-700">Exam Result</h1>

//         <div className="bg-white shadow-md rounded-lg p-6 space-y-3 inline-block text-left">
//           <p>
//             <strong>Score:</strong> {score?.toFixed(2) || 0}%
//             <strong>Score:</strong> {score}%
//           </p>
//           <p>
//             <strong>Correct Answers:</strong> {correctAnswers} /{" "}
//             {totalQuestions}
//           </p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               className={`font-bold ${
//                 passed ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {passed ? "Passed ✅" : "Failed ❌"}
//             </span>
//           </p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };
// /*******  38d5d25f-5fc3-44a5-bf87-eb3878c3b0e1  *******/

// export default ViewResultExam;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";
import { toast } from "react-hot-toast";

const ViewResultExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [result, setResult] = useState(null);
  console.log(result);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `https://edu-master-psi.vercel.app/studentExam/exams/score/${examId}`,
          { headers: { token } }
        );
        setResult(res.data.data);
      } catch (err) {
        console.error("[Result Error]:", err);
        toast.error(err.response?.data?.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examId, token]);

  if (loading)
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );

  if (!result)
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">
          No result found for this exam.
        </div>
      </DashboardLayout>
    );

  const { score } = result;
  const passed = score >= 50; // حسب نظامك

  return (
    <DashboardLayout>
      <div className="p-8 text-center space-y-8">
        <h1 className="text-3xl font-bold text-blue-700">Exam Result</h1>

        <div className="bg-white shadow-lg rounded-xl p-6 inline-block text-left">
          <p className="text-lg">
            <strong>Score:</strong> {score}%
          </p>
          <p className="text-lg">
            <strong>Status:</strong>{" "}
            <span
              className={`font-bold ${
                passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {passed ? "Passed ✅" : "Failed ❌"}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/allExams")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Exams
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ViewResultExam;
