import { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import LayoutAdmin from "../../../layouts/LayoutAdmin";

const AddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  const token = localStorage.getItem("token");

  const initialValues = {
    text: "",
    type: "",
    options: [""],
    correctAnswer: "",
    exam: "",
    points: "",
  };

  const validationSchema = Yup.object({
    text: Yup.string().required("Question text is required"),
    type: Yup.string().required("Question type is required"),
    correctAnswer: Yup.string().required("Correct answer is required"),
    exam: Yup.string().required("Exam is required"),
    points: Yup.number().required("Points are required").positive(),
  });

  // Fetch all exams to show in dropdown
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("https://edu-master-psi.vercel.app/exam", {
          headers: { token },
        });
        setExams(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load exams");
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, [token]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const questionData = {
        text: values.text,
        type: values.type,
        correctAnswer: values.correctAnswer,
        exam: values.exam,
        points: values.points,
      };

      if (values.type === "multiple-choice") {
        questionData.options = values.options;
      }

      await axios.post(
        "https://edu-master-psi.vercel.app/question",
        questionData,
        { headers: { token } }
      );

      toast.success("Question added successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Question
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block mb-1 font-semibold">
                  Question Text
                </label>
                <Field
                  name="text"
                  as="textarea"
                  className="w-full p-2 border rounded"
                  placeholder="Enter the question..."
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block mb-1 font-semibold">
                  Question Type
                </label>
                <Field
                  name="type"
                  as="select"
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue("type", value);
                    if (value !== "multiple-choice")
                      setFieldValue("options", [""]);
                  }}
                >
                  <option value="">Select type</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="true-false">True / False</option>
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Options for Multiple Choice */}
              {values.type === "multiple-choice" && (
                <div>
                  <label className="block mb-1 font-semibold">Options</label>
                  {values.options.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Field
                        name={`options.${index}`}
                        className="flex-1 p-2 border rounded"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...values.options];
                          updated.splice(index, 1);
                          setFieldValue("options", updated);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("options", [...values.options, ""])
                    }
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block mb-1 font-semibold">
                  Correct Answer
                </label>
                <Field
                  name="correctAnswer"
                  className="w-full p-2 border rounded"
                  placeholder="Enter correct answer"
                />
                <ErrorMessage
                  name="correctAnswer"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Exam Select */}
              <div>
                <label className="block mb-1 font-semibold">Select Exam</label>
                <Field
                  name="exam"
                  as="select"
                  className="w-full p-2 border rounded"
                  disabled={loadingExams}
                >
                  <option value="">
                    {loadingExams ? "Loading exams..." : "Select an exam"}
                  </option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="exam"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Points */}
              <div>
                <label className="block mb-1 font-semibold">Points</label>
                <Field
                  name="points"
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter points"
                />
                <ErrorMessage
                  name="points"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
              >
                {loading ? "Loading..." : "Add Question"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutAdmin>
  );
};

export default AddQuestion;
