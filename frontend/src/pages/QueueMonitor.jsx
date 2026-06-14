

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
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Live queue inspector</h1>
            <p className="text-xs text-slate-400">Total {tasks.length} tasks</p>
          </div>
          <button onClick={fetchTasks} className="flex items-center gap-2 bg-[#131926] hover:bg-[#1E2640] border border-[#222C44] px-4 py-2 rounded-xl text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {statusFilters.map((tab) => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)} 
              className={`px-4 py-2 rounded-lg text-xs font-bold ${activeFilter === tab.id ? "bg-[#10B981] text-[#0B0F19]" : "bg-[#0F1422] text-[#9CA3AF]"}`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-[#0F1422] border border-[#1E2640] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#131926] text-[10px] uppercase text-slate-500">
              <tr>
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Worker</th>
                <th className="py-4 px-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2640]">
              {loading ? (<tr><td colSpan="4" className="py-10 text-center">Loading...</td></tr>) : 
                filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#131926]/40 text-xs">
                  <td className="py-4 px-6 flex items-center gap-3">
                    {getTypeIcon(task.type)}
                    <div><div className="font-bold">{task.name}</div><div className="text-slate-500 font-mono">{task.id}</div></div>
                  </td>
                  <td className="py-4 px-4">{renderStatusBadge(task.status)}</td>
                  <td className="py-4 px-4 font-mono text-slate-400">{task.worker}</td>
                  <td className="py-4 px-6 text-right text-slate-500">{task.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}