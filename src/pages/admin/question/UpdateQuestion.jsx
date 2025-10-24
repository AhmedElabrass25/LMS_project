import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import { useDispatch, useSelector } from "react-redux";
import { fetchById, updateOne } from "../../../redux/slices/questionSlice";
import { fetchAll } from "../../../redux/slices/examSlice";

const UpdateQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentQuestion, loading } = useSelector((state) => state.questions);
  const { exams } = useSelector((state) => state.exams);

  // ✅ Fetch question + exams
  useEffect(() => {
    dispatch(fetchById(questionId));
    dispatch(fetchAll());
  }, [questionId, dispatch]);

  // ✅ Validation Schema
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

  // ✅ Handle Submit
  const handleSubmit = async (values) => {
    try {
      await dispatch(updateOne({ id: questionId, data: values })).unwrap();
      navigate("/allQuestions");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Loading and Not Found states
  if (loading && !currentQuestion)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  if (!currentQuestion)
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
            text: currentQuestion.text || "",
            type: currentQuestion.type || "multiple-choice",
            options: currentQuestion.options || [""],
            correctAnswer: currentQuestion.correctAnswer || "",
            exam: currentQuestion.exam?._id || "",
            points: currentQuestion.points || 1,
          }}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values }) => (
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

              {/* Type */}
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

              {/* Options */}
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

              {/* Exam */}
              <div>
                <label className="block font-medium mb-1">Select Exam</label>
                <Field
                  as="select"
                  name="exam"
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select an exam</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title}
                    </option>
                  ))}
                </Field>
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Question"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutAdmin>
  );
};

export default UpdateQuestion;
