import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { BiCreditCard } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";

// API Endpoints
const LESSON_PAYMENT_ENDPOINT = "https://edu-master-psi.vercel.app/lesson/pay/";

function PayCourse() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // We only need state for processing the payment
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Initial Token Check (Mandatory for any protected route) ---
  const token = localStorage.getItem("token");

  if (!token) {
    // Note: We navigate immediately if the token is missing, no need for useEffect
    toast.error("You must login first");
    navigate("/login");
    return null; // Return null to prevent rendering until navigation happens
  }

  // --- Handle Payment Execution (POST Request) ---
  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const url = `${LESSON_PAYMENT_ENDPOINT}${lessonId}`;

      // POST request to initiate payment
      const res = await axios.post(
        url,
        {}, // Empty body
        {
          headers: {
            token: token, // Use 'token' header name
          },
        }
      );
      console.log("[API RESPONSE STATUS]:", res.status);
      console.log("[API RESPONSE DATA]:", res.data);
      const paymentResponse = res.data;

      // --- SUCCESS HANDLING ---
      if (paymentResponse.success) {
        toast.success(
          paymentResponse.message || "Payment initiated successfully!"
        );

        // Redirect user if a payment URL is provided (e.g., to a payment gateway)
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          // Purchase confirmed directly
          toast("Purchase confirmed! Redirecting to lesson content...", {
            icon: "🎉",
          });
          navigate(`/coursesStd/${lessonId}`);
        }
      } else {
        toast.error(paymentResponse.message || "Payment failed to initiate.");
      }
    } catch (err) {
      console.error("Payment API Error:", err);
      const status = axios.isAxiosError(err) ? err.response?.status : null;
      const apiMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

      if (status === 401) {
        toast.error("Session expired or invalid. Please log in again.");
        navigate("/login");
      } else {
        const errorMessage =
          apiMessage || "An error occurred during payment initiation.";
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-[60vh] bg-gray-50 p-4 md:p-8">
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-xl p-6 md:p-8 border-t-8 border-blue-600 text-center">
          <BiCreditCard size={48} className="text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Initiate Secure Payment
          </h1>
          <p className="text-gray-600 mb-8">
            Click the button below to process your payment for the selected
            lesson.
          </p>

          {/* Action Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`mt-4 w-full py-3 rounded-lg transition font-medium text-lg flex justify-center items-center gap-2
              ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-[1.01]"
              }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                Proceed to Pay <FaArrowRight size={20} />
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Payment processing is handled securely by the API provider.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PayCourse;
