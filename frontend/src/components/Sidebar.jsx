// import {
//   LayoutDashboard,
//   Plus,
//   ListOrdered,
//   Server,
//   BarChart3,
// } from "lucide-react";

// import { NavLink } from "react-router-dom";

// export default function Sidebar() {
//   const linkClass = ({ isActive }) =>
//     `flex items-center gap-3 p-3 rounded-xl transition ${
//       isActive
//         ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
//         : "text-slate-300 hover:bg-slate-800"
//     }`;

//   return (
//     <aside className="w-72 bg-[#07111f] border-r border-slate-800 min-h-screen">
//       {/* Logo */}
//       <div className="p-6 border-b border-slate-800">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
//             <span className="font-bold text-black">R</span>
//           </div>

//           <div>
//             <h1 className="text-white text-xl font-bold">Relay</h1>
//             <p className="text-slate-500 text-xs tracking-[3px]">
//               TASK QUEUE
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="p-5">
//         <p className="text-slate-500 text-xs tracking-[4px] mb-5">
//           OPERATIONS
//         </p>

//         <nav className="space-y-2">
//           <NavLink to="/" className={linkClass}>
//             <LayoutDashboard size={18} />
//             Dashboard
//           </NavLink>

//           <NavLink to="/submit-task" className={linkClass}>
//             <Plus size={18} />
//             Submit Task
//           </NavLink>

//           <NavLink to="/queue-monitor" className={linkClass}>
//             <ListOrdered size={18} />
//             Queue Monitor
//           </NavLink>

//           <NavLink to="/worker-nodes" className={linkClass}>
//             <Server size={18} />
//             Worker Nodes
//           </NavLink>

//           <NavLink to="/analytics" className={linkClass}>
//             <BarChart3 size={18} />
//             Analytics
//           </NavLink>
//         </nav>
//       </div>
//     </aside>
//   );
// }



import {
  LayoutDashboard,
  Plus,
  ListOrdered,
  Server,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-[#07111f] border-r border-slate-800 flex flex-col">
      
      {/* Header */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
            <span className="font-bold text-black text-lg">R</span>
          </div>

          <div>
            <h1 className="text-white font-bold text-lg leading-none">
              Relay
            </h1>
            <p className="text-slate-500 text-[10px] tracking-[3px] mt-1">
              TASK QUEUE
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-5">
        <p className="text-slate-500 text-xs tracking-[4px] mb-5">
          OPERATIONS
        </p>

        <nav className="space-y-2">
          <NavLink to="/" className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/submit-task" className={linkClass}>
            <Plus size={18} />
            Submit Task
          </NavLink>

          <NavLink to="/queue-monitor" className={linkClass}>
            <ListOrdered size={18} />
            Queue Monitor
          </NavLink>

          <NavLink to="/worker-nodes" className={linkClass}>
            <Server size={18} />
            Worker Nodes
          </NavLink>

          <NavLink to="/analytics" className={linkClass}>
            <BarChart3 size={18} />
            Analytics
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}