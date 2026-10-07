import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
