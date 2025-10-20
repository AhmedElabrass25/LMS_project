import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Loading";
import LayoutAdmin from "../../../layouts/LayoutAdmin";

const AddExam = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.number()
      .typeError("Duration must be a number")
      .positive("Duration must be positive")
      .integer("Must be an integer")
      .required("Duration is required"),
    classLevel: Yup.string().required("Class level is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    isPublished: Yup.boolean(),
  });

  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      duration: "",
      classLevel: "",
      startDate: "",
      endDate: "",
      isPublished: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setBtnLoading(true);
        const res = await axios.post(
          "https://edu-master-psi.vercel.app/exam",
          values,
          {
            headers: { token },
          }
        );
        console.log(res);
        toast.success("Exam added successfully!");
        navigate("/allExams");
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add exam");
      } finally {
        setBtnLoading(false);
      }
    },
  });

  return (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Add New Exam
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block font-medium">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.duration}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.duration && formik.errors.duration && (
              <p className="text-red-500 text-sm">{formik.errors.duration}</p>
            )}
          </div>

          {/* Class Level */}
          <div>
            <label className="block font-medium">Class Level</label>
            <select
              name="classLevel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.classLevel}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select class level</option>
              <option value="Grade 1 Secondary">Grade 1 Secondary</option>
              <option value="Grade 2 Secondary">Grade 2 Secondary</option>
              <option value="Grade 3 Secondary">Grade 3 Secondary</option>
            </select>
            {formik.touched.classLevel && formik.errors.classLevel && (
              <p className="text-red-500 text-sm">{formik.errors.classLevel}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <p className="text-red-500 text-sm">{formik.errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endDate}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="text-red-500 text-sm">{formik.errors.endDate}</p>
            )}
          </div>

          {/* Is Published */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formik.values.isPublished}
              onChange={formik.handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Publish Exam</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={btnLoading}
          >
            {btnLoading ? "Adding..." : "Add Exam"}
          </button>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default AddExam;
