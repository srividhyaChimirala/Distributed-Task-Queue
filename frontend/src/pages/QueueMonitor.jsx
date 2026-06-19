

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import socket from "../services/socket";
import { Search, RefreshCw, Mail, Image, FileText } from "lucide-react";

export default function QueueMonitor() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  const fetchTasks = async () => {
    try {
      const res = await API.get("/queue/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to sync queue logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("task:updated", fetchTasks);
    return () => socket.off("task:updated", fetchTasks);
  }, []);

  const statusFilters = [
    { id: "All", label: "All", count: tasks.length },
    { id: "PENDING", label: "Pending", count: tasks.filter(t => t.status === "PENDING").length },
    { id: "PROCESSING", label: "Processing", count: tasks.filter(t => t.status === "PROCESSING").length },
    { id: "COMPLETED", label: "Completed", count: tasks.filter(t => t.status === "COMPLETED").length },
    { id: "FAILED", label: "Failed", count: tasks.filter(t => t.status === "FAILED").length },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = activeFilter === "All" || task.status === activeFilter;
   const matchesSearch =
  (task.name || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||
  (task.id || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||
  (task.worker || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    const icons = { Email: Mail, Image: Image, Report: FileText };
    const Icon = icons[type] || Mail;
    return <Icon className="w-4 h-4 text-slate-400" />;
  };

  const renderStatusBadge = (status) => {
    const styles = {
      COMPLETED: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      PENDING: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
      PROCESSING: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
      FAILED: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="text-[#F3F4F6] font-sans antialiased p-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
  <div>
    <div className="mb-2">
      <span className="px-2 py-1 text-[10px] font-bold tracking-[0.2em] uppercase bg-[#2563EB] text-white rounded">
        Queue Monitor
      </span>
    </div>

    <h1 className="text-5xl font-bold text-white">
      Live queue inspector
    </h1>

    <p className="text-slate-400 mt-2">
      {tasks.length} tasks · auto-refresh every 2s
    </p>
  </div>

  <div className="flex gap-3">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search task id, worker..."
        className="w-80 bg-[#0F1422] border border-[#1E2640] rounded-xl pl-12 pr-4 py-3 outline-none"
      />
    </div>

    <button
      onClick={fetchTasks}
      className="flex items-center gap-2 bg-[#0F1422] border border-[#1E2640] rounded-xl px-4"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>
  </div>
</div>

        {/* Filters */}
       <div className="inline-flex bg-[#0F1422] border border-[#1E2640] rounded-2xl p-1 mb-6">
  {statusFilters.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveFilter(tab.id)}
      className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
        activeFilter === tab.id
          ? "bg-[#22C55E] text-black font-semibold"
          : "text-slate-400 hover:text-white"
      }`}
    >
      {tab.label}

      <span className="px-2 py-0.5 rounded bg-black/10 text-xs">
        {tab.count}
      </span>
    </button>
  ))}
</div>
        {/* Data Table */}
        <div className="bg-[#0F1422] border border-[#1E2640] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#131926] text-[11px] uppercase tracking-wider text-slate-500">
  <tr>
    <th className="py-5 px-6">Task</th>
    <th className="py-5 px-4">Type</th>
    <th className="py-5 px-4">Status</th>
    <th className="py-5 px-4">Worker</th>
    <th className="py-5 px-4 text-right">Created</th>
  </tr>
</thead>
            <tbody className="divide-y divide-[#1E2640]">
              {loading ? (<tr><td colSpan="4" className="py-10 text-center">Loading...</td></tr>) : 
                filteredTasks.map((task) => (
  <tr
    key={task.id}
    className="hover:bg-[#131926]/40 text-sm h-20 transition-colors"
  >
    <td className="py-5 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#131926] border border-[#1E2640] flex items-center justify-center">
          {getTypeIcon(task.type)}
        </div>

        <div>
          <div className="font-semibold text-white">
            {task.name}
          </div>

          <div className="text-slate-500 text-xs font-mono">
            {task.id}
          </div>
        </div>
      </div>
    </td>

    <td className="py-5 px-4 text-slate-300">
      {task.type}
    </td>

    <td className="py-5 px-4">
      {renderStatusBadge(task.status)}
    </td>

    <td className="py-5 px-4 font-mono text-slate-400">
      {task.worker || "—"}
    </td>

    <td className="py-5 px-6 text-right text-slate-500">
      {task.created}
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}