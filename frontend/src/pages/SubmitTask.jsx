// export default function SubmitTask() {
//   return (
//     <div>
//       Submit Task Page
//     </div>
//   );
// }



import React, { useState } from "react";
import Layout from "../components/Layout";
import { Mail, Image, FileText, HelpCircle, ArrowRight } from "lucide-react";

export default function SubmitTask() {
  // Task Type selection state
  const [taskType, setTaskType] = useState("email");
  // Priority toggle selection state
  const [priority, setPriority] = useState("Normal");

  // Form Fields State matching your UI structure
  const [formData, setFormData] = useState({
    taskName: "Welcome email — cohort #43",
    recipient: "user@acme.io",
    template: "welcome_v3",
    subject: "Welcome aboard",
    from: "hello@relay.dev",
    targetQueue: "email-pool",
    maxRetries: "3",
    timeout: "60",
    payload: JSON.stringify({
      to: "user@acme.io",
      template: "welcome_v3",
      vars: {
        name: "Mira"
      }
    }, null, 2)
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] font-sans antialiased pb-12">
        
        {/* TOP STATUS SUBBAR */}
        <div className="flex items-center gap-2 mb-6 text-xs text-[#10B981]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          <span className="text-[#9CA3AF]">Live · syncing every 2s</span>
        </div>

        {/* PAGE HEADER TITLE */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase block mb-1">Producer / Submit</span>
          <h1 className="text-4xl font-bold tracking-tight text-white">Enqueue a new task</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Tasks are pushed to the Redis queue and dispatched to the next available worker in the target pool.
          </p>
        </div>

        {/* 3-COLUMN SELECTION TABS FOR TASK TYPE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Email Type Tab */}
          <div 
            onClick={() => setTaskType("email")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
              taskType === "email" 
                ? "bg-[#0F1422] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                : "bg-[#0F1422]/60 border-[#1E2640] hover:border-[#2A3454]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${taskType === "email" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#171E31] text-[#9CA3AF]"}`}>
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">AVG ~2S</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Email</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Transactional or bulk delivery via the SMTP pool.</p>
          </div>

          {/* Image Processing Type Tab */}
          <div 
            onClick={() => setTaskType("image")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
              taskType === "image" 
                ? "bg-[#0F1422] border-[#10B981]" 
                : "bg-[#0F1422]/60 border-[#1E2640] hover:border-[#2A3454]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${taskType === "image" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#171E31] text-[#9CA3AF]"}`}>
                <Image className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">AVG ~6S</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Image processing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Resize, convert, OCR, or remove backgrounds.</p>
          </div>

          {/* Report Generation Type Tab */}
          <div 
            onClick={() => setTaskType("report")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
              taskType === "report" 
                ? "bg-[#0F1422] border-[#10B981]" 
                : "bg-[#0F1422]/60 border-[#1E2640] hover:border-[#2A3454]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${taskType === "report" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#171E31] text-[#9CA3AF]"}`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">AVG ~28S</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Report generation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Compile PDFs or CSV exports from warehouse data.</p>
          </div>
        </div>

        {/* CORE FORM ENTRY BLOCK GRID */}
        <div className="bg-[#0F1422] border border-[#1E2640] rounded-2xl p-6 shadow-xl">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT AREA FORM FIELDS (Span 2 Columns) */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Task Name Input */}
              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Task Name</label>
                <input 
                  type="text" 
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#10B981] transition-all"
                />
              </div>

              {/* Recipient & Template Two-Column row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Recipient</label>
                  <input 
                    type="text" 
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Template</label>
                  <input 
                    type="text" 
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] focus:border-[#10B981] rounded-xl px-4 py-3 text-sm font-medium text-[#10B981] font-mono focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Subject & From Two-Column row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">From</label>
                  <input 
                    type="text" 
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-3 text-sm font-medium text-white font-mono focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>

              {/* Payload TextArea Editor block */}
              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Payload (JSON)</label>
                <div className="relative rounded-xl overflow-hidden border border-[#222C44] bg-[#131926]">
                  <textarea 
                    name="payload"
                    rows={8}
                    value={formData.payload}
                    onChange={handleChange}
                    className="w-full bg-transparent p-4 text-xs font-mono font-medium text-cyan-400 focus:outline-none leading-relaxed resize-none scrollbar-thin scrollbar-thumb-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR PANEL FORM CONTROLS (Span 1 Column) */}
            <div className="flex flex-col justify-between space-y-6 lg:border-l lg:border-[#1E2640]/40 lg:pl-6">
              
              <div className="space-y-5">
                {/* Priority Selection Box Segment Toggle Container */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Priority</label>
                  <div className="grid grid-cols-3 bg-[#131926] border border-[#222C44] p-1 rounded-xl text-xs font-semibold text-center text-slate-400">
                    {["Low", "Normal", "High"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`py-2 rounded-lg transition-all ${
                          priority === lvl 
                            ? "bg-[#1E2640] text-white font-bold" 
                            : "hover:text-white"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Queue Input field box */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Target Queue</label>
                  <input 
                    type="text" 
                    name="targetQueue"
                    value={formData.targetQueue}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-2.5 text-xs font-mono font-medium text-slate-300 focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>

                {/* Max Retries Input field box */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Max Retries</label>
                  <input 
                    type="number" 
                    name="maxRetries"
                    value={formData.maxRetries}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-2.5 text-xs font-mono font-medium text-slate-300 focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>

                {/* Timeout Input field box */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">Timeout (s)</label>
                  <input 
                    type="number" 
                    name="timeout"
                    value={formData.timeout}
                    onChange={handleChange}
                    className="w-full bg-[#131926] border border-[#222C44] rounded-xl px-4 py-2.5 text-xs font-mono font-medium text-slate-300 focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>

                {/* Hint Informative Note Pop-box panel */}
                <div className="bg-[#131926]/50 border border-[#1E2640]/50 p-4 rounded-xl flex items-start gap-3 text-[11px] leading-relaxed text-slate-400">
                  <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>
                    Failed tasks are retried with exponential backoff. After max retries, they move to the dead-letter queue.
                  </p>
                </div>
              </div>

              {/* SUBMIT ENQUEUE BUTTON ACCENT BLOCK */}
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0B0F19] font-bold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.15)] text-sm"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                Enqueue task
              </button>

            </div>
          </form>
        </div>

        {/* LEFT ABSOLUTE FOOTER REDIS MONITOR COMPONENT CONTAINER */}
        <div className="absolute bottom-6 left-6 hidden lg:block bg-[#0F1422] border border-[#1E2640] p-4 rounded-xl min-w-[180px] z-20">
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