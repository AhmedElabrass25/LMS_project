import Sidebar from "../components/Sidebar";
import MyNavbar from "../components/MyNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <MyNavbar />
        <main className="flex-1 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
