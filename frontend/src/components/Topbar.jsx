



// import { Bell } from "lucide-react";

// export default function Topbar() {
//   return (
//     <header className="h-16 border-b border-slate-800 bg-[#030712] px-6 flex items-center justify-end">
//       <div className="flex items-center gap-4">
//         <button className="text-slate-400 hover:text-white transition-colors">
//           <Bell size={18} />
//         </button>

//         <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-semibold">
//           MK
//         </div>
//       </div>
//     </header>
//   );
// }




import { Bell } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { user, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#030712] px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-semibold"
          >
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl z-50 p-4">
             <p className="text-white font-semibold">
  {user?.name}
</p>

              <p className="text-slate-400 text-sm break-all mt-2">
                {user?.email || "No email found"}
              </p>

              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}