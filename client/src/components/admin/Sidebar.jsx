import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Tag, Package, Image, ClipboardList, Settings, LogOut, Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/banners", label: "Banners", icon: Image },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-nude/60 bg-white px-4 py-3 lg:hidden">
        <span className="font-display font-semibold">Mona Admin</span>
        <button onClick={() => setOpen((v) => !v)}><Menu size={22} /></button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white ring-1 ring-nude/40 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 px-2 pt-2">
            <p className="font-display text-lg font-semibold">Make up by mona</p>
            <p className="text-xs text-ink-soft">Signed in as {admin?.username}</p>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-rosegold text-white" : "text-ink hover:bg-blush"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-blush"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-20 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
