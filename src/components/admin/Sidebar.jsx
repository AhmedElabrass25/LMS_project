import { useState } from "react";
import {
  BiSolidDashboard,
  BiUser,
  BiLogOut,
  BiMenuAltLeft,
} from "react-icons/bi";
import { BsQuestionOctagonFill } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";
import { SiSpeedtest } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <button
        onClick={() => {
          navigate(to);
          setIsOpen(false);
        }}
        className={`flex items-center justify-center md:justify-start gap-3 rounded-xl p-3 text-white transition-all duration-200 ${
          isActive ? "bg-blue-700" : "hover:bg-blue-500"
        }`}
      >
        <Icon size={22} />
        <span className="">{text}</span>
      </button>
    );
  };

  return (
    <>
      {/* 🔹 Toggle Button (Mobile Only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-md shadow-lg"
      >
        <BiMenuAltLeft size={24} />
      </button>

      {/* 🔹 Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen w-64 bg-blue-600 text-white flex flex-col justify-between z-50 transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div>
          <div className="p-4 font-bold text-lg md:text-2xl border-b border-blue-500 flex justify-between items-center">
            <span>Admin Panel</span>
            {/* Close button (only mobile) */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white"
            >
              ✖
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-120px)]">
            <NavLink
              to="/adminDashboard"
              icon={BiSolidDashboard}
              text="Dashboard"
            />
            <NavLink to="/allUsers" icon={BiUser} text="Users" />

            <hr className="border-blue-500 my-2" />

            <NavLink to="/allLessons" icon={BiUser} text="All Lessons" />
            <NavLink to="/addLesson" icon={MdAddBox} text="Add Lesson" />

            <hr className="border-blue-500 my-2" />

            <NavLink to="/allExams" icon={SiSpeedtest} text="All Exams" />
            <NavLink to="/addExam" icon={SiSpeedtest} text="Add Exams" />

            <hr className="border-blue-500 my-2" />

            <NavLink
              to="/allQuestions"
              icon={BsQuestionOctagonFill}
              text="All Questions"
            />
            <NavLink
              to="/addQuestion"
              icon={BsQuestionOctagonFill}
              text="Add Question"
            />
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-3 p-4 bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
        >
          <BiLogOut size={22} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
