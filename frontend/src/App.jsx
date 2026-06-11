import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SubmitTask from "./pages/SubmitTask";
import QueueMonitor from "./pages/QueueMonitor";
import WorkerNodes from "./pages/WorkerNodes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route
          path="/submit-task"
          element={<SubmitTask />}
        />

        <Route
          path="/queue-monitor"
          element={<QueueMonitor />}
        />

        <Route
          path="/worker-nodes"
          element={<WorkerNodes />}
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;