// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import SubmitTask from "./pages/SubmitTask";
// import QueueMonitor from "./pages/QueueMonitor";
// import WorkerNodes from "./pages/WorkerNodes";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/" element={<Dashboard />} />

//         <Route
//           path="/submit-task"
//           element={<SubmitTask />}
//         />

//         <Route
//           path="/queue-monitor"
//           element={<QueueMonitor />}
//         />

//         <Route
//           path="/worker-nodes"
//           element={<WorkerNodes />}
//         />


//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SubmitTask from "./pages/SubmitTask";
import QueueMonitor from "./pages/QueueMonitor";
import WorkerNodes from "./pages/WorkerNodes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Helper to protect routes
// const PrivateRoute = ({ children }) => {
//   return localStorage.getItem("token") ? children : <Navigate to="/login" />;
// };
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Check state instead of localStorage
  
  // Also check localStorage as a fallback for page refreshes
  const isAuthenticated = user || localStorage.getItem("token");
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/submit-task" element={
          <PrivateRoute>
            <SubmitTask />
          </PrivateRoute>
        } />
        <Route path="/queue-monitor" element={
          <PrivateRoute>
            <QueueMonitor />
          </PrivateRoute>
        } />
        <Route path="/worker-nodes" element={
          <PrivateRoute>
            <WorkerNodes />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;