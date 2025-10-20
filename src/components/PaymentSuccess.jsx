import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";

const LESSON_DETAILS_ENDPOINT = "https://edu-master-psi.vercel.app/lesson/";

export default function PaymentSuccess() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${LESSON_DETAILS_ENDPOINT}${lessonId}`, {
          headers: { token },
        });
        if (res.data.success) {
          toast.success("✅ تم الدفع بنجاح! جاري تحويلك إلى الدرس...");
          setTimeout(() => navigate(`/coursesStd/${lessonId}`), 2000);
        } else {
          toast.error("❌ لم يتم العثور على الدرس بعد الدفع.");
        }
      } catch (err) {
        toast.error("حدث خطأ أثناء التحقق من الدفع.");
        console.error(err);
      }
    };

    fetchLesson();
  }, [lessonId, navigate, token]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            جاري تأكيد الدفع...
          </h2>
          <p className="text-gray-600">
            من فضلك انتظر لحظات، يتم الآن التحقق من الدفع وتحميل محتوى الدرس.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
