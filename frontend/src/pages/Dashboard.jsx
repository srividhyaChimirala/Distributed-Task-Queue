// import Layout from "../components/Layout";

// export default function Dashboard() {
//   return (
//     <Layout>

//       <h1 className="text-5xl font-bold text-white">
//         Task throughput is healthy
//       </h1>

//       <p className="text-slate-400 mt-3">
//         4 of 6 workers online, processing 248 tasks/min.
//       </p>

//     </Layout>
//   );
// }

import Layout from "../components/Layout";
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
  FileText 
} from "lucide-react";

export default function Dashboard() {
  return (
    <Layout>
      {/* TOP LIVE SYNC BAR */}
      <div className="flex items-center gap-2 mb-6 text-xs text-[#9CA3AF]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
        <span>Live · syncing every 2s</span>
      </div>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase block mb-1">Control Plane / Overview</span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Task throughput is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">healthy</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            4 of 6 workers online, processing <span className="font-semibold text-white">248 tasks/min</span>.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0B0F19] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
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
          <div className="text-2xl font-bold tracking-tight text-white">12,544</div>
          <div className="text-[11px] text-[#10B981] font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12.4% this week
          </div>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">52</div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">12,413</div>
          <div className="text-[11px] text-[#10B981] font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> 99.4% success
          </div>
        </div>

        {/* Failed */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Failed</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-red-400">61</div>
        </div>

        {/* Active Workers */}
        <div className="bg-gradient-to-b from-[#131C2E] to-[#0F1422] border border-[#1E2640] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Active Workers</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">4/6</div>
        </div>
      </div>

      {/* CHARTS GRAPH SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Throughput Area Chart */}
        <div className="lg:col-span-2 bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base text-white">Throughput · last 24h</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Completed vs failed tasks per hour</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-[#9CA3AF]">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-[#9CA3AF]">Failed</span>
              </div>
            </div>
          </div>

          <div className="relative h-56 w-full flex flex-col justify-between pt-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-[#4B5563] font-mono">
              <div className="w-full border-b border-[#1E2640]/50 pb-1">260</div>
              <div className="w-full border-b border-[#1E2640]/50 pb-1">195</div>
              <div className="w-full border-b border-[#1E2640]/50 pb-1">130</div>
              <div className="w-full border-b border-[#1E2640]/50 pb-1">65</div>
            </div>
            
            <svg className="w-full h-full absolute inset-0 z-10 overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 130 Q 30 50 60 40 T 120 90 T 180 35 T 240 120 T 300 30 T 360 65 T 420 135 T 480 40 T 540 140 T 600 45 L 600 160 L 0 160 Z" 
                fill="url(#chartGradient)" 
              />
              <path 
                d="M 0 130 Q 30 50 60 40 T 120 90 T 180 35 T 240 120 T 300 30 T 360 65 T 420 135 T 480 40 T 540 140 T 600 45" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Queue Mix Donut Chart */}
        <div className="bg-[#0F1422] border border-[#1E2640] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Queue mix</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Active tasks by type</p>
          </div>

          <div className="flex justify-center items-center my-6 relative">
            <svg width="160" height="160" viewBox="0 0 42 42" className="transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1E2640" strokeWidth="4.5" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="40 60" strokeDashoffset="0" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="-40" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-75" />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#9CA3AF]">
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#3B82F6] mx-auto mb-1"></span>
              Auth Flows
            </div>
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#10B981] mx-auto mb-1"></span>
              Images
            </div>
            <div>
              <span className="block w-2.5 h-2.5 rounded-full bg-[#F59E0B] mx-auto mb-1"></span>
              Data Jobs
            </div>
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
            <a href="#view-queue" className="text-xs text-[#10B981] hover:underline font-medium">View queue →</a>
          </div>

          <div className="space-y-3">
            {[
              { title: "2FA code — auth flow", id: "tsk_00000d", w: "worker-syd-01", type: "mail", status: "COMPLETED", ms: "5768ms" },
              { title: "Thumbnail gen — gallery_summer24", id: "tsk_001efc", w: "worker-fra-01", type: "image", status: "COMPLETED", ms: "2515ms" },
              { title: "2FA code — auth flow", id: "tsk_003deb", w: "—", type: "mail", status: "PENDING", ms: "—" },
              { title: "Background remove — 18 SKUs", id: "tsk_005cda", w: "—", type: "image", status: "PENDING", ms: "—" },
              { title: "Resize batch — 320 product photos", id: "tsk_007bc9", w: "worker-sin-01", type: "image", status: "PROCESSING", ms: "1258ms" },
              { title: "Monthly revenue — June 2026", id: "tsk_009ab8", w: "worker-sin-01", type: "file", status: "COMPLETED", ms: "5660ms" },
              { title: "Monthly revenue — June 2026", id: "tsk_00b9a7", w: "—", type: "file", status: "PENDING", ms: "—" }
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#141A2D] border border-[#1E2640] rounded-xl hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1E2640] rounded-lg text-slate-400">
                    {task.type === "mail" && <Mail className="w-4 h-4" />}
                    {task.type === "image" && <Image className="w-4 h-4" />}
                    {task.type === "file" && <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{task.title}</h4>
                    <span className="text-xs text-slate-500 font-mono">{task.id} <span className="mx-1">•</span> {task.w}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${
                    task.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    task.status === "PROCESSING" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono w-16 text-right">{task.ms}</span>
                </div>
              </div>
            ))}
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
              <a href="#all-nodes" className="text-xs text-[#10B981] hover:underline font-medium">All nodes →</a>
            </div>

            <div className="space-y-5">
              {[
                { name: "worker-iad-01", region: "us-east-1", cpu: 58, processed: "12,628" },
                { name: "worker-iad-02", region: "us-east-1", cpu: 83, processed: "18,480" },
                { name: "worker-fra-01", region: "eu-central-1", cpu: 80, processed: "12,869" },
                { name: "worker-fra-02", region: "eu-central-1", cpu: 70, processed: "9,627" }
              ].map((worker, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                      <span className="text-white font-mono">{worker.name}</span>
                    </div>
                    <span className="text-slate-400">{worker.cpu}% cpu</span>
                  </div>
                  <div className="w-full bg-[#1E2640] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${worker.cpu}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>{worker.region}</span>
                    <span>{worker.processed} processed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1E2640] pt-4 mt-6 grid grid-cols-2 text-xs">
            <div>
              <span className="text-slate-500 block">Avg load</span>
              <span className="font-bold text-white text-sm">42%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Throughput</span>
              <span className="font-bold text-white text-sm font-mono">248/min</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}