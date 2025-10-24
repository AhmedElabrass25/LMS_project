import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar ثابت */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen pl-0 md:pl-64 transition-all duration-300">
        <Header />

        {/* المحتوى قابل للتمرير */}
        <main className="flex-1 overflow-y-auto p-2 md:p-6">{children}</main>
      </div>
    </div>
  );
}
