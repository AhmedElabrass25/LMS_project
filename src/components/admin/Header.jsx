const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-gray-800 truncate">
        Welcome, Admin 👋
      </h1>
      <span className="text-gray-600 text-sm hidden sm:block">Dashboard</span>
    </header>
  );
};

export default Header;
