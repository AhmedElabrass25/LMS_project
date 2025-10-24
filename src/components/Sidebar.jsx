import {
  BiBookOpen,
  BiLogOut,
  BiSolidDashboard,
  BiSolidPurchaseTag,
  BiUser,
  BiBrain,
  BiMenu,
  BiX,
} from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

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

    const baseClasses =
      "flex items-center gap-3 w-auto p-2 text-left rounded-md md:w-full md:p-3 transition-colors duration-150";

    const activeClass = isActive
      ? "bg-blue-700 hover:bg-blue-700"
      : "hover:bg-blue-500";

    return (
      <button
        onClick={() => {
          navigate(to);
          setIsOpen(false); // close sidebar when clicking a link (on mobile)
        }}
        className={`${baseClasses} ${activeClass}`}
      >
        <Icon size={20} />
        <span className="block">{text}</span>
      </button>
    );
  };

  return (
    <>
      {/* 🔹 Toggle button (mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md md:hidden"
      >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      {/* 🔹 Overlay (when sidebar open on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🔹 Sidebar itself */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-blue-600 text-white flex flex-col justify-between transform transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-64`}
      >
        <div>
          <div className="p-4 md:p-6 text-xl md:text-2xl font-bold">
            <span className="hidden md:block">Student Panel</span>
            <span className="block md:hidden">SP</span>
          </div>

          <nav className="flex flex-col gap-2 px-4">
            <NavLink
              to="/dashboardStd"
              icon={BiSolidDashboard}
              text="Dashboard"
            />
            <NavLink to="/profileStd" icon={BiUser} text="Profile" />
            <NavLink to="/coursesStd" icon={BiBookOpen} text="Courses" />
            <NavLink
              to="/purchased"
              icon={BiSolidPurchaseTag}
              text="Purchased Courses"
            />

            <div className="mt-4 border-t border-blue-400 pt-2">
              <p className="text-sm md:text-base font-semibold mb-1 hidden md:block opacity-80">
                Exams
              </p>
              <NavLink to="/all-exams" icon={BiBrain} text="All Exams" />
            </div>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full text-left bg-blue-700 hover:bg-blue-800 transition-colors duration-150"
        >
          <BiLogOut size={20} />
          <span className="block">Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
