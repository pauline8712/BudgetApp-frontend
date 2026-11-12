import { NavLink, useNavigate } from "react-router-dom";
import { isAdmin } from "../helpers/auth";
import { useState } from "react";

function NavBar() {
  const adminUser = isAdmin();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{ background: "var(--color-background-primary)" }}
      className="w-full border-b border-gray-200 relative"
    >
      <div className="flex justify-around items-center py-2">
        <NavLink to="/" end className="flex flex-col items-center gap-1 flex-1">
          {({ isActive }) => (
            <>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span
                className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                Hem
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/statistics"
          className="flex flex-col items-center gap-1 flex-1"
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <span
                className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                Statistik
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/add-transaction"
          className="flex flex-col items-center gap-1 flex-1"
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-blue-600" : "bg-blue-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-blue-600"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span
                className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                Transaktion
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/categories"
          className="flex flex-col items-center gap-1 flex-1"
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </div>
              <span
                className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                Kategorier
              </span>
            </>
          )}
        </NavLink>

        {adminUser && (
          <NavLink
            to="/admin"
            className="flex flex-col items-center gap-1 flex-1"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 1 0-16 0" />
                  </svg>
                </div>
                <span
                  className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-400"}`}
                >
                  Admin
                </span>
              </>
            )}
          </NavLink>
        )}

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex flex-col items-center gap-1 flex-1"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </div>
          <span className="text-xs text-gray-400">Profil</span>
        </button>
      </div>

      {showProfile && (
        <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-xl shadow-md p-4 z-50 w-64">
          <p className="text-xs text-gray-400 mb-1">Inloggad som</p>
          <p className="text-sm font-medium text-gray-900 mb-4 truncate">
            {email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 text-sm rounded-lg py-2 hover:bg-red-100"
          >
            Logga ut
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
