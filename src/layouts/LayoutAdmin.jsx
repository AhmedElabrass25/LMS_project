import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-16 md:pl-64 transition-all duration-300">
        <Header />
        <main className="flex-1 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
