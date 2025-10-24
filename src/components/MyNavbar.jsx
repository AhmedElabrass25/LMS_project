const MyNavbar = () => {
  const studentName = localStorage.getItem("studentName") || "Student";

  return (
    <header className="bg-white shadow p-4 flex justify-center items-center sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-gray-800 truncate">
        Welcome, {studentName} 👋
      </h1>
    </header>
  );
};

export default MyNavbar;
