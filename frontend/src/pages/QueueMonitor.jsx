// export default function QueueMonitor() {
//   return (
//     <div>
//       Queue Monitor Page
//     </div>
//   );
// }



import React, { useState } from "react";
import Layout from "../components/Layout"; // Imported layout structure wrapper
import { Search, RefreshCw, Mail, Image, FileText } from "lucide-react";

export default function QueueMonitor() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Counter metric groups exactly from top tab filter tracks
  const statusFilters = [
    { id: "All", label: "All", count: 64 },
    { id: "PENDING", label: "Pending", count: 14 },
    { id: "PROCESSING", label: "Processing", count: 12 },
    { id: "COMPLETED", label: "Completed", count: 33 },
    { id: "FAILED", label: "Failed", count: 5 },
  ];

  // Combined real-world dataset extracted straight from both screenshot logs
  const tasksData = [
    {
      id: "tsk_80800d",
      name: "2FA code — auth flow",
      type: "Email",
      status: "COMPLETED",
      worker: "worker-syd-01",
      priority: "High",
      duration: "5768ms",
      attempts: 1,
      created: "08:16 PM"
    },
    {
      id: "tsk_801efc",
      name: "Thumbnail gen — gallery_summer24",
      type: "Image",
      status: "COMPLETED",
      worker: "worker-fra-01",
      priority: "Normal",
      duration: "2515ms",
      attempts: 1,
      created: "06:11 PM"
    },
    {
      id: "tsk_803deb",
      name: "2FA code — auth flow",
      type: "Email",
      status: "PENDING",
      worker: "—",
      priority: "High",
      duration: "—",
      attempts: 1,
      created: "07:13 PM"
    },
    {
      id: "tsk_805cda",
      name: "Background remove — 18 SKUs",
      type: "Image",
      status: "PENDING",
      worker: "—",
      priority: "Normal",
      duration: "—",
      attempts: 1,
      created: "05:31 PM"
    },
    {
      id: "tsk_807bc9",
      name: "Resize batch — 320 product photos",
      type: "Image",
      status: "PROCESSING",
      worker: "worker-sin-01",
      priority: "Normal",
      duration: "1258ms",
      attempts: 1,
      created: "07:47 PM"
    },
    {
      id: "tsk_809ab8",
      name: "Monthly revenue — June 2026",
      type: "Report",
      status: "COMPLETED",
      worker: "worker-sin-01",
      priority: "Normal",
      duration: "5660ms",
      attempts: 1,
      created: "08:06 PM"
    },
    {
      id: "tsk_81eefd",
      name: "OCR scan — invoice_2026_06.pdf",
      type: "Image",
      status: "PROCESSING",
      worker: "worker-fra-01",
      priority: "High",
      duration: "125ms",
      attempts: 1,
      created: "05:21 PM"
    },
    {
      id: "tsk_828dec",
      name: "Receipt — order #A-77321",
      type: "Email",
      status: "PROCESSING",
      worker: "worker-fra-02",
      priority: "Normal",
      duration: "1934ms",
      attempts: 1,
      created: "09:14 PM"
    },
    {
      id: "tsk_822cdb",
      name: "Thumbnail gen — gallery_summer24",
      type: "Image",
      status: "FAILED",
      worker: "worker-iad-02",
      priority: "Low",
      duration: "3186ms",
      attempts: 3,
      created: "05:36 PM"
    },
    {
      id: "tsk_824bca",
      name: "Inventory snapshot — warehouse 8F",
      type: "Report",
      status: "COMPLETED",
      worker: "worker-fra-01",
      priority: "Normal",
      duration: "1861ms",
      attempts: 1,
      created: "06:34 PM"
    },
    {
      id: "tsk_826ab9",
      name: "Inventory snapshot — warehouse 8F",
      type: "Report",
      status: "COMPLETED",
      worker: "worker-iad-02",
      priority: "Low",
      duration: "5195ms",
      attempts: 1,
      created: "07:56 PM"
    },
    {
      id: "tsk_8289a8",
      name: "Receipt — order #A-77321",
      type: "Email",
      status: "COMPLETED",
      worker: "worker-iad-01",
      priority: "Normal",
      duration: "392ms",
      attempts: 1,
      created: "06:31 PM"
    },
    {
      id: "tsk_82a897",
      name: "Compliance audit log — EU region",
      type: "Report",
      status: "PROCESSING",
      worker: "worker-iad-01",
      priority: "High",
      duration: "487ms",
      attempts: 1,
      created: "05:58 PM"
    },
    {
      id: "tsk_82c786",
      name: "Compliance audit log — EU region",
      type: "Report",
      status: "COMPLETED",
      worker: "worker-iad-02",
      priority: "Normal",
      duration: "2140ms",
      attempts: 1,
      created: "09:27 PM"
    }
  ];

  // Search filter matching criteria
  const filteredTasks = tasksData.filter((task) => {
    const matchesFilter = activeFilter === "All" || task.status === activeFilter;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.worker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Icon switcher depending on task category
  const getTypeIcon = (type) => {
    switch (type) {
      case "Email": return <Mail className="w-4 h-4 text-slate-400" />;
      case "Image": return <Image className="w-4 h-4 text-slate-400" />;
      case "Report": return <FileText className="w-4 h-4 text-slate-400" />;
      default: return <Mail className="w-4 h-4 text-slate-400" />;
    }
  };

  // Micro layout statuses stylings matching system UI colors
  const renderStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
            COMPLETED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
            PENDING
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
            PROCESSING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-red-500/10 text-red-500 border border-red-500/20">
            FAILED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="text-[#F3F4F6] font-sans antialiased p-6 relative">
        
        {/* TOP TIMING INDICATOR BAR */}
        <div className="flex items-center gap-2 mb-6 text-xs text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          <span className="text-[#9CA3AF]">Live · syncing every 2s</span>
        </div>

        {/* CORE INFO SUMMARY TITLE MODULE */}
        <div className="mb-6">
          <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase block mb-1">Queue Monitor</span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Live queue inspector</h1>
              <p className="text-xs text-slate-400 mt-1">64 tasks · auto-refresh every 2s</p>
            </div>

            {/* SEARCH INTERACTION FILTERS */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search task id, worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131926] border border-[#222C44] rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#2A3454] transition-all"
                />
              </div>
              <button className="flex items-center gap-1.5 bg-[#131926] hover:bg-[#1E2640] text-slate-300 border border-[#222C44] px-4 py-2 rounded-xl text-xs font-semibold transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL COUNTER BADGES SUBTRACK */}
        <div className="flex items-center gap-2 mb-6 bg-[#0F1422] border border-[#1E2640] p-1.5 rounded-xl w-max">
          {statusFilters.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected 
                    ? "bg-[#10B981] text-[#0B0F19]" 
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#171E31]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isSelected ? "bg-[#0B0F19]/10 text-[#0B0F19]" : "bg-[#1E2640] text-[#9CA3AF]"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* DATATABLE ENGINE LOGS INTERACTION CONTAINER */}
        <div className="bg-[#0F1422] border border-[#1E2640] rounded-2xl overflow-hidden shadow-2xl mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E2640] text-[10px] uppercase font-mono tracking-wider text-slate-500">
                  <th className="py-4 px-6 font-bold">Task</th>
                  <th className="py-4 px-4 font-bold">Type</th>
                  <th className="py-4 px-4 font-bold">Status</th>
                  <th className="py-4 px-4 font-bold">Worker</th>
                  <th className="py-4 px-4 font-bold">Priority</th>
                  <th className="py-4 px-4 font-bold">Duration</th>
                  <th className="py-4 px-4 font-bold">Attempts</th>
                  <th className="py-4 px-6 font-bold text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2640]/40 text-xs font-medium text-slate-300">
                {filteredTasks.map((task, index) => (
                  <tr key={index} className="hover:bg-[#131926]/40 transition-colors">
                    
                    {/* Task details block containing icon wrapper */}
                    <td className="py-4 px-6 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#131926] border border-[#222C44] text-slate-400 shrink-0 mt-0.5">
                        {getTypeIcon(task.type)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm tracking-tight">{task.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{task.id}</div>
                      </div>
                    </td>

                    {/* Operational Type Category column */}
                    <td className="py-4 px-4 text-slate-400 font-normal">
                      {task.type}
                    </td>

                    {/* Status Box Column Row */}
                    <td className="py-4 px-4">
                      {renderStatusBadge(task.status)}
                    </td>

                    {/* Assigned Node Worker Name string */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {task.worker}
                    </td>

                    {/* Weighted Priorities Flag coloring */}
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${
                        task.priority === "High" ? "text-red-400" : 
                        task.priority === "Low" ? "text-slate-500" : "text-slate-300"
                      }`}>
                        {task.priority}
                      </span>
                    </td>

                    {/* Time Duration computation track row */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {task.duration}
                    </td>

                    {/* Run Retry Attempts Counter - Colors to Yellow if field exceeds 1 item */}
                    <td className={`py-4 px-4 font-mono ${task.attempts > 1 ? "text-amber-400 font-bold" : "text-slate-400"}`}>
                      {task.attempts}
                    </td>

                    {/* Created Time Timestamp label */}
                    <td className="py-4 px-6 text-right text-slate-500 font-mono text-[11px]">
                      {task.created}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* DATA PAGINATION FOOTER SUBELEMENT NOTE */}
          <div className="px-6 py-4 border-t border-[#1E2640]/40 flex justify-between items-center bg-[#0F1422]">
            <span className="text-xs text-slate-500">Showing 1-14 of 64</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 bg-[#131926] border border-[#222C44] rounded-lg text-[11px] text-slate-600 font-medium cursor-not-allowed">Prev</button>
              <button className="px-3 py-1 bg-[#131926] hover:bg-[#1E2640] border border-[#222C44] rounded-lg text-[11px] text-slate-300 font-medium transition-all">Next</button>
            </div>
          </div>
        </div>

        {/* ABSOLUTE FOOTER FLOATING HEALTH BANNER */}
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