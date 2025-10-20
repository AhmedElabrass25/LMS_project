import {
  BiSolidDashboard,
  BiUser,
  BiBookAdd,
  BiBrain,
  BiLogOut,
  BiCategory,
} from "react-icons/bi";
import { BsQuestionOctagonFill } from "react-icons/bs";
import { MdAddBox, MdAdminPanelSettings } from "react-icons/md";
import { SiSpeedtest } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, text }) => {
    const isActive = location.pathname === to;

    const baseClasses =
      "flex items-center gap-3 w-auto p-2 text-left rounded-md md:w-full md:p-3 transition-colors duration-150";
    const activeClass = isActive
      ? "bg-blue-700 hover:bg-blue-700"
      : "hover:bg-blue-500";

    return (
      <button
        onClick={() => navigate(to)}
        className={`${baseClasses} ${activeClass}`}
      >
        <Icon size={20} />
        <span className="hidden md:block">{text}</span>
      </button>
    );
  };

  return (
    <div className="w-16 md:w-64 bg-blue-600 text-white min-h-screen flex flex-col justify-between fixed top-0 left-0 z-40 transition-all duration-300">
      <div>
        <div className="p-4 md:p-6 text-xl md:text-2xl font-bold">
          <span className="hidden md:block">Admin Panel</span>
          <span className="block md:hidden">AP</span>
        </div>

        <nav className="flex flex-col gap-2 px-2 md:px-4">
          <NavLink
            to="/adminDashboard"
            icon={BiSolidDashboard}
            text="Dashboard"
          />
          <NavLink to="/allUsers" icon={BiUser} text="Users" />
          <hr />
          <NavLink to="/allLessons" icon={BiUser} text="All Lessons" />
          <NavLink to="/addLesson" icon={MdAddBox} text="Add Lesson" />
          <hr />
          <NavLink to="/allExams" icon={SiSpeedtest} text="All Exams" />
          <NavLink to="/addExam" icon={SiSpeedtest} text="Add Exams" />
          <NavLink
            to="/studentScores"
            icon={SiSpeedtest}
            text="Student Scores"
          />

          <hr />
          <NavLink
            to="/allQuestions"
            icon={BsQuestionOctagonFill}
            text="All Questions"
          />
          <NavLink
            to="/addQuestion"
            icon={BsQuestionOctagonFill}
            text="Add Questions"
          />
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-2 w-full text-left bg-blue-700 hover:bg-blue-800 md:p-4 transition-colors duration-150"
      >
        <BiLogOut size={20} />
        <span className="hidden md:block">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
