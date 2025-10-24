import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import LayoutAdmin from "../../../layouts/LayoutAdmin";
import Loading from "../../../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchById, updateOne } from "../../../redux/slices/lessonSlice";

const UpdateLesson = () => {
  const { lessonId } = useParams(); // lesson lessonId
  const navigate = useNavigate();
  const { loading, currentItem } = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      video: "",
      classLevel: "",
      price: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      video: Yup.string()
        .url("Must be a valid URL")
        .required("Video URL is required"),
      classLevel: Yup.string().required("Class level is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
    }),
    onSubmit: async (values) => {
      dispatch(updateOne({ id: lessonId, data: values }));
      navigate("/allLessons");
    },
  });

  useEffect(() => {
    dispatch(fetchById(lessonId));
  }, [dispatch, lessonId]);

  // ✅ بعد ما البيانات توصل، نعبّي الفورم بـ Formik
  useEffect(() => {
    if (currentItem) {
      formik.setValues({
        title: currentItem.title || "",
        description: currentItem.description || "",
        video: currentItem.video || "",
        classLevel: currentItem.classLevel || "",
        price: currentItem.price || "",
      });
    }
  }, [currentItem]);

  if (loading)
    return (
      <LayoutAdmin>
        <Loading />
      </LayoutAdmin>
    );

  return (
    <LayoutAdmin>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Update Lesson
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
          >
            {loading ? "Updating..." : "Update Lesson"}
          </button>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default UpdateLesson;
