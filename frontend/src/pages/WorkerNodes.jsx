// export default function WorkerNodes() {
//   return (
//     <div>
//       Worker Nodes Page
//     </div>
//   );
// }




import React from "react";
import Layout from "../components/Layout"; // Dynamic frame wrapper
import { Cpu, HardDrive, Activity, WifiOff } from "lucide-react";

export default function WorkerNodes() {
  // Global aggregate counters matching top-right headers
  const summaryStats = {
    processed: "60,704",
    failed: "344",
    successRate: "99.43%"
  };

  // Exact 6-node dataset structure extracted from the user interface panel states
  const workersData = [
    {
      name: "worker-iad-01",
      region: "us-east-1",
      status: "ACTIVE",
      cpu: 58,
      mem: 69,
      processed: "12,628",
      failed: 17,
      uptime: "8d 1h",
      health: "99.9% success",
      executingTask: "tsk_02a897"
    },
    {
      name: "worker-iad-02",
      region: "us-east-1",
      status: "ACTIVE",
      cpu: 83,
      mem: 56,
      processed: "10,480",
      failed: 38,
      uptime: "6d 13h",
      health: "99.6% success",
      executingTask: "tsk_819238"
    },
    {
      name: "worker-fra-01",
      region: "eu-central-1",
      status: "ACTIVE",
      cpu: 80,
      mem: 47,
      processed: "12,069",
      failed: 77,
      uptime: "1d 3h",
      health: "99.4% success",
      executingTask: "tsk_81eefd"
    },
    {
      name: "worker-fra-02",
      region: "eu-central-1",
      status: "ACTIVE",
      cpu: 70,
      mem: 56,
      processed: "9,627",
      failed: 79,
      uptime: "9d 0h",
      health: "99.2% success",
      executingTask: "tsk_828dec"
    },
    {
      name: "worker-sin-01",
      region: "ap-southeast-1",
      status: "IDLE",
      cpu: 53,
      mem: 55,
      processed: "7,074",
      failed: 71,
      uptime: "11d 12h",
      health: "99.0% success",
      executingTask: null
    },
    {
      name: "worker-syd-01",
      region: "ap-southeast-2",
      status: "OFFLINE",
      cpu: 0,
      mem: 0,
      processed: "8,914",
      failed: 62,
      uptime: "—",
      health: "unreachable",
      executingTask: null
    }
  ];

  // Logic switcher determining color scheme presets for standard nodes status tags
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[10px] font-bold tracking-wide">● ACTIVE</span>;
      case "IDLE":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 text-[10px] font-bold tracking-wide">● IDLE</span>;
      case "OFFLINE":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold tracking-wide">● OFFLINE</span>;
      default:
        return null;
    }
  };

  // Helper macro deciding dynamic inline loading progress bar coloring tracks
  const getProgressBarColor = (percentage, status) => {
    if (status === "OFFLINE") return "bg-slate-850";
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-[#F59E0B]";
    return "bg-sky-500";
  };

  return (
    <Layout>
      <div className="text-[#F3F4F6] font-sans antialiased p-6 relative">
        
        {/* LIVE SYNC STATUS TRACK */}
        <div className="flex items-center gap-2 mb-6 text-xs text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          <span className="text-[#9CA3AF]">Live · syncing every 2s</span>
        </div>

        {/* COMPONENT HEADER ZONE & AGGREGATE META CARDS */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase block mb-1">Cluster / Workers</span>
            <h1 className="text-3xl font-bold tracking-tight text-white">Worker nodes</h1>
            <p className="text-xs text-slate-400 mt-1">4 active · 1 idle · 1 offline</p>
          </div>

          {/* AGGREGATED UI STAT COUNTERS ROW */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="bg-[#0F1422] border border-[#1E2640] px-5 py-3 rounded-xl min-w-[110px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">Processed</div>
              <div className="text-xl font-bold text-slate-300 font-mono tracking-tight">{summaryStats.processed}</div>
            </div>
            <div className="bg-[#0F1422] border border-[#1E2640] px-5 py-3 rounded-xl min-w-[110px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">Failed</div>
              <div className="text-xl font-bold text-red-500 font-mono tracking-tight">{summaryStats.failed}</div>
            </div>
            <div className="bg-[#0F1422] border border-[#1E2640] px-5 py-3 rounded-xl min-w-[110px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">Success</div>
              <div className="text-xl font-bold text-emerald-400 font-mono tracking-tight">{summaryStats.successRate}</div>
            </div>
          </div>
        </div>

        {/* WORKER CLUSTER GRIDS PANEL ENGINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {workersData.map((node) => (
            <div key={node.name} className={`bg-[#0F1422] border ${node.status === 'OFFLINE' ? 'border-[#1E2640]/40' : 'border-[#1E2640]'} rounded-2xl p-5 relative shadow-xl hover:border-[#2A3454] transition-all`}>
              
              {/* NODE TOP INFO PROFILE CONTAINER */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-[#131926] border border-[#222C44] text-slate-400 shrink-0">
                    {node.status === "OFFLINE" ? <WifiOff className="w-4 h-4 text-slate-500" /> : <Cpu className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{node.name}</h3>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{node.region}</p>
                  </div>
                </div>
                {getStatusBadge(node.status)}
              </div>

              {/* DYNAMIC METRIC SLIDERS (CPU & MEMORY INFRASTRUCTURE ARRAYS) */}
              <div className="space-y-3 mb-5">
                {/* CPU Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span className="flex items-center gap-1 uppercase font-bold"><Cpu className="w-3 h-3 text-slate-500" /> CPU</span>
                    <span className="font-bold">{node.cpu}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getProgressBarColor(node.cpu, node.status)}`}
                      style={{ width: `${node.cpu}%` }}
                    />
                  </div>
                </div>

                {/* Memory Bar */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span className="flex items-center gap-1 uppercase font-bold"><HardDrive className="w-3 h-3 text-slate-500" /> Mem</span>
                    <span className="font-bold">{node.mem}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${node.status === "OFFLINE" ? "bg-slate-800" : "bg-sky-500"}`}
                      style={{ width: `${node.mem}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* OPERATIONAL RUNTIME COUNTERS LIST GRIDS */}
              <div className="grid grid-cols-3 gap-2 border-b border-[#1E2640]/40 pb-4 mb-4 text-left">
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-0.5">Processed</div>
                  <div className="text-xs font-bold text-slate-300 font-mono">{node.processed}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-0.5">Failed</div>
                  <div className={`text-xs font-bold font-mono ${node.failed > 0 && node.status !== "OFFLINE" ? "text-red-500" : "text-slate-400"}`}>{node.failed}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold mb-0.5">Uptime</div>
                  <div className="text-xs font-bold text-slate-400 font-mono">{node.uptime}</div>
                </div>
              </div>

              {/* HEALTH RATE & REALTIME TASK ASSIGNMENT EXECUTORS TRACK */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-semibold"><Activity className="w-3.5 h-3.5" /> Health</span>
                  <span className={`font-mono text-[11px] font-bold ${node.status === "OFFLINE" ? "text-red-500" : "text-emerald-400"}`}>
                    {node.health}
                  </span>
                </div>

                <div className="mt-1">
                  {node.executingTask ? (
                    <div className="flex items-center justify-between bg-[#131926] border border-[#222C44] px-3 py-1.5 rounded-lg text-[11px]">
                      <span className="text-slate-500 font-mono font-medium">► executing</span>
                      <span className="font-mono text-slate-300 font-bold">{node.executingTask}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[#131926]/20 border border-[#1E2640]/20 px-3 py-1.5 rounded-lg text-[11px] text-slate-600 font-mono">
                      <span>—</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* BOTTOM REDIS STATUS CLUSTER FIELD */}
        <div className="bg-[#0F1422] border border-[#1E2640] p-4 rounded-xl max-w-[240px]">
          <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            Redis cluster · healthy
          </div>
          <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
            <div>redis://primary:6379</div>
            <div>replicas: 3 · lag 0.4ms</div>
          </div>
        </div>

      </div>
    </Layout>
  );
}