import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import socket from "../services/socket";
import { Cpu, HardDrive, WifiOff } from "lucide-react";

export default function WorkerNodes() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNodes = async () => {
    try {
      const res = await API.get("/queue/workers");

      console.log("WORKERS =", res.data);

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
    socket.on("worker:telemetry", fetchNodes);

    return () => {
      socket.off("worker:count", fetchNodes);
      socket.off("worker:telemetry", fetchNodes);
    };
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ONLINE":
        return "text-green-400 bg-green-500/10 border-green-500/30";

      case "OFFLINE":
        return "text-red-400 bg-red-500/10 border-red-500/30";

      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-white">
          Loading workers...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Worker Nodes
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Live cluster infrastructure monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node, index) => {
            const workerName =
              typeof node.workerName === "object"
                ? node.workerName?.name
                : node.workerName;

            const region =
              node.region ||
              node.workerName?.region ||
              "local";

            return (
              <div
                key={workerName || index}
                className="bg-[#0F1422] border border-[#1E2640] rounded-2xl p-5 shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 rounded-xl bg-[#131926] border border-[#222C44]">
                      {node.status === "OFFLINE" ? (
                        <WifiOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Cpu className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {workerName || "Unknown Worker"}
                      </h3>

                      <p className="text-[11px] font-mono text-slate-500">
                        {region}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusStyle(
                      node.status
                    )}`}
                  >
                    {node.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-4 mb-6">
                  {/* CPU */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        CPU
                      </span>

                      <span>{node.cpu || 0}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${node.cpu || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        MEM
                      </span>

                      <span>{node.memory || 0}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-[#171E31] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${node.memory || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Runtime Stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-[#1E2640] pt-4">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">
                      Processed
                    </div>

                    <div className="text-xs font-bold text-slate-300">
                      {node.processed || 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">
                      Failed
                    </div>

                    <div className="text-xs font-bold text-red-500">
                      {node.failed || 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">
                      Uptime
                    </div>

                    <div className="text-xs font-bold text-slate-400">
                      {Math.floor((node.uptime || 0) / 3600)}h{" "}
                      {Math.floor(
                        ((node.uptime || 0) % 3600) / 60
                      )}
                      m
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {nodes.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            No workers found
          </div>
        )}
      </div>
    </Layout>
  );
}