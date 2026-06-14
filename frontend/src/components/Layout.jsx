



// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// export default function Layout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-[#030712]">
      
//       {/* Left Sidebar */}
//       <Sidebar />

//       {/* Right Content Area */}
//       <div className="flex-1 flex flex-col">
        
//         {/* Top Header */}
//         <Topbar />

//         {/* Page Content */}
//         <main className="flex-1 p-8 overflow-auto">
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// }


import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}