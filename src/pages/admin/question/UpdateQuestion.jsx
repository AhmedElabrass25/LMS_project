import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
const UpdateQuestion = () => {
  const { questionId } = useParams(); // question ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch existing question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `https://edu-master-psi.vercel.app/question/get/${questionId}`,
          {
            headers: { token },
          }
        );
        console.log(res);
        console.log(res.data.data.exam);

        setQuestion(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId, token]);

  // Validation Schema
  const validationSchema = Yup.object({
    text: Yup.string().required("Question text is required"),
    type: Yup.string().required("Question type is required"),
    correctAnswer: Yup.string().required("Correct answer is required"),
    exam: Yup.string().required("Exam ID is required"),
    points: Yup.number()
      .required("Points are required")
      .min(1, "Minimum 1 point"),
    options: Yup.array().when("type", {
      is: "multiple-choice",
      then: (schema) =>
        schema
          .of(Yup.string().required("Option cannot be empty"))
          .min(2, "At least 2 options required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Submit Handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.put(
        `https://edu-master-psi.vercel.app/question/${questionId}`,
        values,
        {
          headers: { token },
        }
      );
      console.log(res);
      toast.success("Question updated successfully!");
      navigate("/allQuestions");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update question");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  if (!question)
    return (
      <div className="text-center text-gray-500 text-lg">
        Question not found.
      </div>
    );

  return (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Question</h2>

        <Formik
          initialValues={{
            text: question.text || "",
            type: question.type || "multiple-choice",
            options: question.options || [""],
            correctAnswer: question.correctAnswer || "",
            exam: question.exam._id || "",
            points: question.points || 1,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block font-medium mb-1">Question Text</label>
                <Field
                  name="text"
                  type="text"
                  placeholder="Enter question text"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Type Select */}
              <div>
                <label className="block font-medium mb-1">Question Type</label>
                <Field
                  as="select"
                  name="type"
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Type</option>
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

              {/* Options (only for multiple-choice) */}
              {values.type === "multiple-choice" && (
                <div>
                  <label className="block font-medium mb-1">Options</label>
                  <FieldArray name="options">
                    {({ push, remove }) => (
                      <div>
                        {values.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <Field
                              name={`options[${index}]`}
                              placeholder={`Option ${index + 1}`}
                              className="w-full border p-2 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="bg-green-500 text-white px-3 py-1 rounded mt-1"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <ErrorMessage
                    name="options"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block font-medium mb-1">Correct Answer</label>
                <Field
                  name="correctAnswer"
                  type="text"
                  placeholder="Enter correct answer"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="correctAnswer"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Exam ID */}
              <div>
                <label className="block font-medium mb-1">Exam ID</label>
                <Field
                  name="exam"
                  type="text"
                  placeholder="Enter exam ID"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="exam"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Points */}
              <div>
                <label className="block font-medium mb-1">Points</label>
                <Field
                  name="points"
                  type="number"
                  className="w-full border p-2 rounded"
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
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Question"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutAdmin>
  );
};

export default UpdateQuestion;
