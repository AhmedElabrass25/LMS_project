import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import LayoutAdmin from "../../../layouts/LayoutAdmin";
import { useState } from "react";

const AddLesson = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      video: "",
      classLevel: "",
      scheduledDate: "",
      price: "",
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      video: Yup.string()
        .url("Must be a valid URL")
        .required("Video URL is required"),
      classLevel: Yup.string().required("Class level is required"),
      scheduledDate: Yup.date().required("Scheduled date is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      try {
        setLoading(true); // 🔹 بدء التحميل
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "https://edu-master-psi.vercel.app/lesson",
          values,
          {
            headers: { token },
          }
        );
        toast.success("Lesson added successfully!");
        console.log(res.data);
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add lesson.");
      } finally {
        setLoading(false); // 🔹 إيقاف التحميل
      }
    },
  });

  return (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Add New Lesson
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
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block font-medium">Video URL</label>
            <input
              type="text"
              name="video"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.video}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.video && formik.errors.video && (
              <p className="text-red-500 text-sm">{formik.errors.video}</p>
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

          {/* Scheduled Date */}
          <div>
            <label className="block font-medium">Scheduled Date</label>
            <input
              type="date"
              name="scheduledDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.scheduledDate}
              className="w-full border border-gray-300 rounded-md p-2"
              min={new Date().toISOString().split("T")[0]} // ✅ لا يمكن اختيار تاريخ قديم
            />
            {formik.touched.scheduledDate && formik.errors.scheduledDate && (
              <p className="text-red-500 text-sm">
                {formik.errors.scheduledDate}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm">{formik.errors.price}</p>
            )}
          </div>

          {/* Submit Button with Loading */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Adding...
              </>
            ) : (
              "Add Lesson"
            )}
          </button>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default AddLesson;
