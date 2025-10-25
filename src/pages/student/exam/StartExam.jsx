import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Loading from "../../../components/Loading";
import ExamHeader from "../../../components/exam/ExamHeader";
import ExamTimer from "../../../components/exam/ExamTimer";
import QuestionList from "../../../components/exam/QuestionList";
import ExamResult from "../../../components/exam/ExamResult";

const StartExam = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const startExam = async () => {
      if (!token) {
        toast.error("You must be logged in to start the exam");
        return;
      }
      try {
        // 🟢 Step 2: Start Exam & Get Exam Info
        const res = await axios.post(
          `https://edu-master-psi.vercel.app/studentExam/start/${examId}`,
          {},
          { headers: { token } }
        );

        const { exam, startTime, endTime } = res.data.data;
        setExam(exam);
        setStartTime(startTime);
        setEndTime(endTime);

        // 🟢 Step 3: Fetch Questions
        const questionRequests = exam.questions.map((id) =>
          axios
            .get(`https://edu-master-psi.vercel.app/question/get/${id}`, {
              headers: { token },
            })
            .then((res) => res.data.data)
            .catch(() => null)
        );

        const results = await Promise.allSettled(questionRequests);
        const fetchedQuestions = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value);

        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("[Exam Load Error]:", err);
        toast.error(err.response?.data?.message || "Failed to load exam");
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [examId, token]);

  // 🟡 Handle answer selection
  const handleAnswer = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };

  // 🟠 Submit exam
  const handleSubmit = async () => {
    if (submitted) return;
    try {
      setLoading(true);
      const payload = {
        answers: Object.entries(answers).map(
          ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })
        ),
      };

      const res = await axios.post(
        `https://edu-master-psi.vercel.app/studentExam/submit/${examId}`,
        payload,
        { headers: { token } }
      );
      console.log(res.data.data);
      setResult(res.data);
      setSubmitted(true);
      toast.success("Exam submitted successfully!");
    } catch (err) {
      console.error("[Exam Submit Error]:", err);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Loading state
  if (loading)
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );

  // ✅ Show result after submission
  if (submitted) {
    return (
      <DashboardLayout>
        <ExamResult result={result} />
      </DashboardLayout>
    );
  }

  // 🧩 Normal Exam UI
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ExamHeader
          name={exam?.title}
          description={exam?.description}
          classLevel={exam?.classLevel}
        />

        <ExamTimer
          startTime={startTime}
          endTime={endTime}
          onExpire={handleSubmit}
        />

        <QuestionList
          questions={questions}
          answers={answers}
          onAnswer={handleAnswer}
        />

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default StartExam;
