

// import { Bell } from "lucide-react";

// export default function Topbar() {
//   return (
//     <header className="h-16 border-b border-slate-800 bg-[#030712] flex items-center justify-end px-6">
//       <div className="flex items-center gap-4">
//         <button className="text-slate-400 hover:text-white transition">
//           <Bell size={18} />
//         </button>

//         <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-semibold text-black">
//           MK
//         </div>
//       </div>
//     </header>
//   );
// }




import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#030712] px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>

        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-semibold">
          MK
        </div>
      </div>
    </header>
  );
}