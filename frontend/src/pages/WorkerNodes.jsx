import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import socket from "../services/socket";
import { Cpu, HardDrive, WifiOff, Activity } from "lucide-react";

export default function WorkerNodes() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNodes = async () => {
    try {
      const res = await API.get("/queue/workers");
      setNodes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch worker nodes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    socket.on("worker:count", fetchNodes);
    socket.on("worker:telemetry", fetchNodes); // Listen for real-time updates
    return () => {
      socket.off("worker:count", fetchNodes);
      socket.off("worker:telemetry", fetchNodes);
    };
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE": return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      case "IDLE": return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
      default: return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Worker nodes</h1>
          <p className="text-xs text-slate-400 mt-1">Live cluster infrastructure monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div key={node.name} className="bg-[#0F1422] border border-[#1E2640] rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                  <div className="p-2.5 rounded-xl bg-[#131926] border border-[#222C44]">
                    {node.status === "OFFLINE" ? <WifiOff className="w-4 h-4 text-slate-500" /> : <Cpu className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{node.name}</h3>
                    <p className="text-[11px] font-mono text-slate-500">{node.region}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusStyle(node.status)}`}>
                  {node.status}
                </span>
              </div>

              {/* Metrics Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
                    <span>{node.cpu}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${node.cpu}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> MEM</span>
                    <span>{node.mem}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${node.mem}%` }} />
                  </div>
                </div>
              </div>

              {/* Runtime Stats */}
              <div className="grid grid-cols-3 gap-2 border-t border-[#1E2640] pt-4">
                <div><div className="text-[9px] text-slate-500 uppercase">Processed</div><div className="text-xs font-bold text-slate-300">{node.processed}</div></div>
                <div><div className="text-[9px] text-slate-500 uppercase">Failed</div><div className="text-xs font-bold text-red-500">{node.failed}</div></div>
                <div><div className="text-[9px] text-slate-500 uppercase">Uptime</div><div className="text-xs font-bold text-slate-400">{node.uptime}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}