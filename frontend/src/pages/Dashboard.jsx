import Layout from "../components/Layout";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import socket from "../services/socket";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  ArrowUpRight, 
  PlusCircle, 
  Mail, 
  Image, 
  FileText,
  X 
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const timeoutRef = useRef(null);
  const [chartData, setChartData] = useState([]);
const [isQueueOpen, setIsQueueOpen] = useState(false);
const [allTasks, setAllTasks] = useState([]); // State for the full list
  // Task Submission Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskType, setTaskType] = useState("email");
// const [taskType, setTaskType] = useState("mail");
  const [taskTitle, setTaskTitle] = useState("");
const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
//       const res = await API.get("/queue/stats");

//       setStats(res.data);
const res = await API.get("/queue/stats");

console.log("STATS RESPONSE:", res.data);

setStats(res.data);
      setChartData(res.data.throughput || []);
    } catch (error) {
      console.error("Failed to fetch metric streams:", error);
    }
  };

//   useEffect(() => {
//     fetchStats();

//     const updateStats = () => {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(fetchStats, 300);
//     };

//     socket.on("stats:update", updateStats);
//     socket.on("job:completed", updateStats);
//     socket.on("job:failed", updateStats);

//     return () => {
//       socket.off("stats:update", updateStats);
//       socket.off("job:completed", updateStats);
//       socket.off("job:failed", updateStats);
//       clearTimeout(timeoutRef.current);
//     };
//   }, []);
useEffect(() => {
  fetchStats();

  const updateStats = () => {
    // Debounce the call to prevent UI flickering on rapid updates
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchStats, 300);
  };

  // Listen for the standard update event your backend should be emitting
  // socket.on("job:updated", updateStats); 
  socket.on("stats:update", updateStats);
  
  // Keep these if your backend specifically emits them
  socket.on("job:completed", updateStats);
  socket.on("job:failed", updateStats);

  return () => {
    // socket.off("job:updated", updateStats);
    socket.off("stats:update", updateStats);
    socket.off("job:completed", updateStats);
    socket.off("job:failed", updateStats);
    clearTimeout(timeoutRef.current);
  };
}, []);
 // Form Dispatch Trigger Handler
//   const handleTaskSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // ⚡ CRITICAL: Define the payload structure your worker expects
//     // This prevents worker failures when accessing undefined properties
//  let jobPayload = {
//   subject: taskTitle || `${taskType.toUpperCase()} Job Request`,
//   message: `${taskType} task: ${taskTitle}`
// };

// if (taskType === "email") {
//   jobPayload.email = email;
// }

// // if (taskType === "image") {
// //   jobPayload.imageUrl = "https://example.com/sample.png";
// // }

// // if (taskType === "report") {
// //   jobPayload.reportType = "pdf";
// // }
// if (taskType === "image") {
//   jobPayload.imageUrl = imageUrl; // from user input or upload
// }
// if (taskType === "report") {
//   jobPayload.reportType = selectedFormat || "pdf";
// }
//  try {
//       await API.post("/queue/submit", {
//         taskType: taskType,
//         title: taskTitle || "Generic Pipeline Task",
//         metadata: jobPayload // Now passing the full required schema
//       });
//       
//       setTaskTitle("");
// setEmail("");      
// setIsModalOpen(false);
//       fetchStats(); // Trigger immediate refresh
//     } catch (error) {
//       console.error("Task dispatch submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// Update the state initializer
// const [taskType, setTaskType] = useState("email"); // Changed from "mail"

// Update the handleTaskSubmit function
const handleTaskSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  let jobPayload = {
    subject: taskTitle || `${taskType.toUpperCase()} Job Request`,
    message: `${taskType} task: ${taskTitle}`
  };

  // Change "mail" to "email"
  if (taskType === "email") { 
      jobPayload.email = email;
  }

  try {
      await API.post("/queue/submit", {
          taskType: taskType, // This will now correctly send "email"
          title: taskTitle || "Generic Pipeline Task",
          metadata: jobPayload 
      });
      // ... rest of the code
        
        setTaskTitle("");
        setEmail("");      
        setIsModalOpen(false);
        fetchStats(); 
    } catch (error) {
        console.error("Task submission failed:", error);
    } finally {
        setIsSubmitting(false);
    }
};
  // Determine dynamic axis labels based on backend scaling ceiling
  const maxCompleted = Math.max(
  ...chartData.map(item => item.completed || 0),
  0
);

const maxFailed = Math.max(
  ...chartData.map(item => item.failed || 0),
  0
);

const yCeiling = Math.max(maxCompleted, maxFailed, 10);
  const step = Math.ceil(yCeiling / 4);

  // Normalize workers array access safely
  const activeWorkersList = stats?.workers || stats?.workerNodes || [];
  const totalOnlineWorkers = activeWorkersList.filter(w => w.online !== false).length;
//   const systemTotalWorkers = stats?.totalWorkersCount || activeWorkersList.length || 4;
// const systemTotalWorkers =
//   stats?.totalWorkersCount || activeWorkersList.length || 0;
const systemTotalWorkers =
  stats?.totalWorkersCount ??
  activeWorkersList?.length ??
  1;
// const totalCompleted =
//   (stats?.email?.completed || 0) +
//   (stats?.image?.completed || 0) +
//   (stats?.report?.completed || 0);

// const totalFailed =
//   (stats?.email?.failed || 0) +
//   (stats?.image?.failed || 0) +
//   (stats?.report?.failed || 0);

// const totalTasks = totalCompleted + totalFailed;

// const successRate =
//   totalTasks > 0
//     ? ((totalCompleted / totalTasks) * 100).toFixed(1)
//     : "0.0";



const totalCompleted =
  (stats?.email?.completed || 0) +
  (stats?.image?.completed || 0) +
  (stats?.report?.completed || 0);

const totalFailed =
  (stats?.email?.failed || 0) +
  (stats?.image?.failed || 0) +
  (stats?.report?.failed || 0);

const totalWaiting =
  (stats?.email?.waiting || 0) +
  (stats?.image?.waiting || 0) +
  (stats?.report?.waiting || 0);

const totalActive =
  (stats?.email?.active || 0) +
  (stats?.image?.active || 0) +
  (stats?.report?.active || 0);

const totalTasks =
  totalWaiting +
  totalActive +
  totalCompleted +
  totalFailed;

const successRate =
  totalCompleted + totalFailed > 0
    ? (
        (totalCompleted /
          (totalCompleted + totalFailed)) *
        100
      ).toFixed(1)
    : "0.0";

    const emailTasks =
  (stats?.email?.completed || 0) +
  (stats?.email?.failed || 0);

const imageTasks =
  (stats?.image?.completed || 0) +
  (stats?.image?.failed || 0);

const reportTasks =
  (stats?.report?.completed || 0) +
  (stats?.report?.failed || 0);

const queueTotal = emailTasks + imageTasks + reportTasks;

const emailPct =
  queueTotal > 0 ? Math.round((emailTasks / queueTotal) * 100) : 0;

const imagePct =
  queueTotal > 0 ? Math.round((imageTasks / queueTotal) * 100) : 0;

const reportPct =
  queueTotal > 0 ? Math.round((reportTasks / queueTotal) * 100) : 0;

const fetchAllTasks = async () => {
  try {
    const res = await API.get("/queue/all");
    console.log("Data from backend:", res.data); // <-- CHECK BROWSER CONSOLE
    setAllTasks(res.data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};


useEffect(() => {
  if (isQueueOpen) {
    fetchAllTasks(); // This function must be defined in Dashboard
  }
}, [isQueueOpen]);

  return (
    <Layout>
      {/* TOP LIVE SYNC BAR */}
      <div className="flex items-center gap-2 mb-6 text-xs text-[#9CA3AF]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
        <span>Live · auto-sync enabled</span>
      </div>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-8">
        <div>
  <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase block mb-1">
    Control Plane / Overview
  </span>

  <h1 className="text-3xl font-bold tracking-tight text-white">
    Task throughput is{" "}
    <span
      className={`text-transparent bg-clip-text bg-gradient-to-r ${
        (stats?.totalThroughputPerMin || 0) > 0
          ? "from-[#10B981] to-[#3B82F6]"
          : "from-[#F59E0B] to-[#EF4444]"
      }`}
    >
      {(stats?.totalThroughputPerMin || 0) > 0
        ? "healthy"
        : "idle"}
    </span>
  </h1>

  <p className="text-sm text-slate-400 mt-1">
    <span className="font-semibold text-white">
      {stats?.activeWorkers || "0/4"}
    </span>{" "}
    workers online, processing{" "}
    <span className="font-semibold text-white">
      {stats?.totalThroughputPerMin || 0}
    </span>{" "}
    tasks/min.
  </p>
</div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0B0F19] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
        >
          <PlusCircle className="w-4 h-4" />
          Submit new task
        </button> 
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Total Tasks */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Total Tasks</span>
            <Activity className="w-4 h-4 text-[#10B981]" />
          </div>
{/*           <div className="text-2xl font-bold tracking-tight text-white">
            {stats
              ? (stats?.email?.completed || 0) +
                (stats?.image?.completed || 0) +
                (stats?.report?.completed || 0) +
                (stats?.email?.failed || 0) +
                (stats?.image?.failed || 0) +
                (stats?.report?.failed || 0)
              : "..."}
          </div> */}
<div className="text-2xl font-bold tracking-tight text-white">
  {stats ? totalTasks : "..."}
</div>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">
  Total processed tasks
</div>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">
            {stats
              ? (stats?.email?.waiting || 0) +
                (stats?.image?.waiting || 0) +
                (stats?.report?.waiting || 0)
              : "..."}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">
            {stats
              ? (stats?.email?.completed || 0) +
                (stats?.image?.completed || 0) +
                (stats?.report?.completed || 0)
              : "..."}
          </div>
         <div className="text-[11px] text-[#10B981] font-medium flex items-center gap-0.5 mt-1">
  <ArrowUpRight className="w-3 h-3" /> {successRate}% success
</div>
        </div>

        {/* Failed */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Failed</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-red-400">
            {stats
              ? (stats?.email?.failed || 0) +
                (stats?.image?.failed || 0) +
                (stats?.report?.failed || 0)
              : "..."}
          </div>
        </div>

        {/* Active Workers */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Active Workers</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
{/*           <div className="text-2xl font-bold tracking-tight text-white">
            {stats ? `${totalOnlineWorkers}/${systemTotalWorkers}` : ".../..."}
          </div> */}
<div className="text-2xl font-bold tracking-tight text-white">
  {stats?.activeWorkers || "0/4"}
</div>
        </div>
      </div>

      {/* CHARTS GRAPH SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  {/* Main Throughput Area Chart */}
<div className="lg:col-span-2 bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h3 className="font-bold text-base text-white">
        Task Execution Trend
      </h3>

      <p className="text-xs text-[#6B7280] mt-0.5">
        Completed vs failed tasks during last 24 hours
      </p>
    </div>

    <div className="flex items-center gap-4 text-xs font-medium">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
        <span className="text-[#9CA3AF]">Completed</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-[#9CA3AF]">Failed</span>
      </div>
    </div>
  </div>

  <div className="relative h-64 w-full">
    {/* Grid */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border-b border-[#1E2640]/40 w-full"
        />
      ))}
    </div>

    {chartData?.length > 0 ? (
      <>
        <svg
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient
              id="completedGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#10B981"
                stopOpacity="0.25"
              />
              <stop
                offset="100%"
                stopColor="#10B981"
                stopOpacity="0"
              />
            </linearGradient>

            <linearGradient
              id="failedGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#EF4444"
                stopOpacity="0.20"
              />
              <stop
                offset="100%"
                stopColor="#EF4444"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {(() => {
            const width = 800;
            const height = 220;

            // const yCeiling = Math.max(
            //   ...chartData.map((d) =>
            //     Math.max(
            //       d.completed || 0,
            //       d.failed || 0
            //     )
            //   ),
            //   5
            // );
            const yCeiling =
  Math.max(
    ...chartData.map((d) =>
      Math.max(
        d.completed || 0,
        d.failed || 0
      )
    )
  ) + 5;

            const completedPoints = chartData.map((d, i) => {
              const x =
                chartData.length > 1
                  ? (i / (chartData.length - 1)) * width
                  : width / 2;

              const y =
                height -
                ((d.completed || 0) / yCeiling) *
                  (height - 20);

              return { x, y };
            });

            const failedPoints = chartData.map((d, i) => {
              const x =
                chartData.length > 1
                  ? (i / (chartData.length - 1)) * width
                  : width / 2;

              const y =
                height -
                ((d.failed || 0) / yCeiling) *
                  (height - 20);

              return { x, y };
            });

            // const completedPath = completedPoints
            //   .map(
            //     (p, i) =>
            //       `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
            //   )
            //   .join(" ");
            const completedPath =
  completedPoints.length > 0
    ? completedPoints
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
        )
        .join(" ")
    : "";

            // const failedPath = failedPoints
            //   .map(
            //     (p, i) =>
            //       `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
            //   )
            //   .join(" ");
            const failedPath =
  failedPoints.length > 0
    ? failedPoints
        .map(
          (p, i) =>
            `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
        )
        .join(" ")
    : "";

            const completedArea =
              completedPoints.length > 0
                ? `${completedPath}
                   L ${
                     completedPoints[
                       completedPoints.length - 1
                     ].x
                   } ${height}
                   L ${completedPoints[0].x} ${height}
                   Z`
                : "";

            const failedArea =
              failedPoints.length > 0
                ? `${failedPath}
                   L ${
                     failedPoints[
                       failedPoints.length - 1
                     ].x
                   } ${height}
                   L ${failedPoints[0].x} ${height}
                   Z`
                : "";

            return (
              <>
                <path
                  d={completedArea}
                  fill="url(#completedGradient)"
                />

                <path
                  d={completedPath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d={failedArea}
                  fill="url(#failedGradient)"
                />

                <path
                  d={failedPath}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {completedPoints.map((p, i) => (
                  <circle
                    key={`completed-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#10B981"
                  />
                ))}

                {failedPoints.map((p, i) => (
                  <circle
                    key={`failed-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill="#EF4444"
                  />
                ))}
              </>
            );
          })()}
        </svg>

        {/* Hour Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[10px] text-[#6B7280] font-mono">
          {chartData.map((item, index) => (
            <span key={index}>
              {item.hour}
            </span>
          ))}
        </div>
      </>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
        No throughput data found
      </div>
    )}
  </div>
</div>

        {/* Queue Mix Donut Chart */}

        <div className="bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Queue mix</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Active tasks by type</p>
          </div>

          <div className="flex justify-center items-center my-6 relative">
            <div className="absolute text-center">
              <span className="block text-xl font-bold text-white">
                {((stats?.email?.completed || 0) + (stats?.email?.failed || 0) + 
                  (stats?.image?.completed || 0) + (stats?.image?.failed || 0) + 
                  (stats?.report?.completed || 0) + (stats?.report?.failed || 0))}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">Total</span>
            </div>
            
            {(() => {
//               const authPct = stats?.mixPercentages?.auth || 0;
//               const imgPct = stats?.mixPercentages?.image || 0;
//               const dataPct = stats?.mixPercentages?.data || 0;
// const emailMixPct = emailPct;
// const imageMixPct = imagePct;
// const reportMixPct = reportPct;

// // const emailOffset = 0;
// // const imageOffset = emailMixPct;
// // const reportOffset = emailMixPct + imageMixPct;
// const emailOffset = 0;
// const imageOffset = (emailMixPct / 100) * circumference;
// const reportOffset = ((emailMixPct + imageMixPct) / 100) * circumference;
const radius = 15.915;
const circumference = 2 * Math.PI * radius;

const emailLen = (emailPct / 100) * circumference;
const imageLen = (imagePct / 100) * circumference;
const reportLen = (reportPct / 100) * circumference;

const emailOffset = 0;
const imageOffset = emailLen;
const reportOffset = emailLen + imageLen;
              return (
                <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1E2640" strokeWidth="4.5" />
                {emailPct > 0 && (
  <circle
    cx="21"
    cy="21"
    r={radius}
    fill="transparent"
    stroke="#3B82F6"
    strokeWidth="4.5"
    strokeDasharray={`${emailLen} ${circumference - emailLen}`}
    strokeDashoffset={0}
  />
)}

{imagePct > 0 && (
  <circle
    cx="21"
    cy="21"
    r={radius}
    fill="transparent"
    stroke="#10B981"
    strokeWidth="4.5"
    strokeDasharray={`${imageLen} ${circumference - imageLen}`}
    strokeDashoffset={-emailOffset}
  />
)}

{reportPct > 0 && (
  <circle
    cx="21"
    cy="21"
    r={radius}
    fill="transparent"
    stroke="#F59E0B"
    strokeWidth="4.5"
    strokeDasharray={`${reportLen} ${circumference - reportLen}`}
    strokeDashoffset={-imageOffset}
  />
)}
                </svg>
              );
            })()}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#9CA3AF]">
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#3B82F6] mx-auto mb-1"></span>
              Email Tasks ({emailPct}%)
            </div>
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#10B981] mx-auto mb-1"></span>
             Image Tasks ({imagePct}%)
            </div>
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#F59E0B] mx-auto mb-1"></span>
Report Tasks ({reportPct}%)            </div>
          </div>
        </div> 
      </div>

      {/* LOWER SECTION: RECENT TASKS & TOP WORKERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks List */}
        <div className="lg:col-span-2 bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base text-white">Recent tasks</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Latest executions across all queues</p>
            </div>
{/*             <a href="#view-queue" className="text-xs text-[#10B981] hover:underline font-medium">View queue →</a> */}
{/* <button 
  onClick={() => {
    setIsQueueOpen(true);
    fetchAllTasks();   // ✅ ADD THIS
  }} 
  className="text-xs text-[#10B981] hover:underline font-medium"
>
  View full queue →
</button> */}
          </div>

          <div className="space-y-3">
            {stats?.recentTasks && stats.recentTasks.length > 0 ? (
              stats.recentTasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-[#141A2D] border border-[#1E2640] rounded-xl hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1E2640] rounded-lg text-slate-400">
                     {task.type === "email" ? (
                        <Mail className="w-4 h-4" />
                      ) : task.type === "image" ? (
                        <Image className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
{/*                     <div>
                      <h4 className="text-sm font-semibold text-white leading-tight">{task.title}</h4>
                      <span className="text-xs text-slate-500 font-mono">{task.id} <span className="mx-1">•</span> {task.w}</span>
                    </div> */}
<div>
  <h4 className="text-sm font-semibold text-white leading-tight">
    {task.title}
  </h4>

  <span className="text-xs text-slate-500 font-mono">
    {task.id}
    <span className="mx-1">•</span>
    {new Date(task.timestamp).toLocaleTimeString()}
  </span>
</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${
                      task.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      task.status === "FAILED" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono w-16 text-right">{task.ms}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                Waiting for incoming stream tasks...
              </div>
            )}
          </div>
        </div>

        {/* Top Workers Utilization */}
        <div className="bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-base text-white">Top workers</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Live utilization</p>
              </div>
{/*               <a href="#all-nodes" className="text-xs text-[#10B981] hover:underline font-medium">All nodes →</a> */}
            </div>

            <div className="space-y-5">
              {activeWorkersList.length > 0 ? (
                activeWorkersList.map((worker, index) => {
                  const isHighLoad = worker.cpu >= 80;
                  const isIdle = worker.cpu < 10;
                  const barColor = isHighLoad ? "bg-rose-500" : isIdle ? "bg-slate-500" : "bg-cyan-400";

                  return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${worker.online !== false ? "bg-[#10B981] animate-pulse" : "bg-red-500"}`}></span>
                          <span className="text-white font-mono">{worker.name}</span>
                        </div>
                        <span className={`font-mono ${isHighLoad ? "text-rose-400" : "text-slate-400"}`}>{worker.cpu}% cpu</span>
                      </div>
                      <div className="w-full bg-[#1E2640] h-1.5 rounded-full overflow-hidden">
                        <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(worker.cpu, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>{worker.region || "unknown-region"}</span>
                        <span>{Number(worker.processed || 0).toLocaleString()} processed</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 font-mono">
                  No active worker nodes detected...
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#1E2640] pt-4 mt-6 grid grid-cols-2 text-xs">
            <div>
              <span className="text-slate-500 block">Avg load</span>
              <span className="font-bold text-white text-sm">
                {activeWorkersList.length > 0
                  ? `${Math.round(activeWorkersList.reduce((acc, w) => acc + (w.cpu || 0), 0) / activeWorkersList.length)}%`
                  : stats?.avgCpuLoad ? `${stats.avgCpuLoad}%` : "0%"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Throughput</span>
              <span className="font-bold text-white text-sm font-mono">{stats?.totalThroughputPerMin || 0 }/min</span>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP TASK SUBMISSION DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F1422] border border-[#1E2640] rounded-2xl p-6 shadow-2xl relative mx-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Submit New Cluster Task</h3>
            <p className="text-xs text-slate-400 mb-5">Dispatch an asynchronous job directly into your BullMQ backend pipeline.</p>

            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Target Queue Pipeline</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                   onClick={() => setTaskType("email")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    taskType === "email"
                        ? "bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6]" 
                        : "bg-[#141A2D] border-[#1E2640] text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Mail className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-medium">Email Task</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskType("image")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      taskType === "image" 
                        ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]" 
                        : "bg-[#141A2D] border-[#1E2640] text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Image className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-medium">Image Proc</span>
                  </button>

                  <button
                    type="button"
               onClick={() => setTaskType("report")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      taskType === "report"
                        ? "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]" 
                        : "bg-[#141A2D] border-[#1E2640] text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <FileText className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-medium">Report Generation</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Execution Label / Custom Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., SendEmailJob execution"
                  className="w-full bg-[#141A2D] border border-[#1E2640] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-500 transition-all placeholder:text-slate-700"
                />
              </div>





<div>
  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
    Email Address
  </label>

  <input
    type="email"
    required={taskType === "email"}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="user@example.com"
    className="w-full bg-[#141A2D] border border-[#1E2640] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-500 transition-all placeholder:text-slate-700"
  />
</div>


              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-[#1E2640] hover:bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#10B981] hover:bg-[#059669] text-[#0B0F19] font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Queueing..." : "Dispatch Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* QUEUE SLIDE-OVER PANEL */}
{isQueueOpen && (
  <div className="fixed inset-0 z-50 flex justify-end">
    {/* Dark background overlay */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsQueueOpen(false)} />
    
    {/* Panel Content */}
    <div className="relative w-full max-w-2xl bg-[#0B0F19] border-l border-[#1E2640] shadow-2xl p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Full Task Queue</h2>
        <button onClick={() => setIsQueueOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Your Neat Table Here */}
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="text-xs uppercase text-slate-500 border-b border-[#1E2640]">
          <tr>
            <th className="pb-4">Task Name</th>
            <th className="pb-4">Status</th>
            <th className="pb-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((task) => (
            <tr key={task.id} className="border-b border-[#1E2640] hover:bg-[#141A2D]">
              <td className="py-4 text-white font-medium">{task.title}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                  task.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="py-4 text-right text-[#10B981] hover:underline cursor-pointer">Retry</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    </Layout>
  );
}