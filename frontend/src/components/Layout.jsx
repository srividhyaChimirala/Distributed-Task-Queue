// import Sidebar from "./Sidebar";

// export default function Layout({ children }) {
//   return (
//     <div className="flex bg-[#030712] min-h-screen">
//       <Sidebar />

//       <main className="flex-1 p-8">
//         {children}
//       </main>
//     </div>
//   );
// }




import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#030712]">
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}