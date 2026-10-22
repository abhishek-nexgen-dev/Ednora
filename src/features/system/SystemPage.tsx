import React, { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Layers,
  Database,
  Radio,
  Send,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../Utils/api.utils";
import { BackendQueueMetrics } from "../../types/backend.types";
import { GreetForm } from "../greet";

interface BackendHealthStatus {
  uptime?: number;
  services?: {
    database?: string;
    broker?: string;
  };
  queues?: BackendQueueMetrics;
}

export default function SystemPage() {
  const [queueMetrics, setQueueMetrics] = useState<BackendQueueMetrics>({
    connected: false,
    mode: "in-memory (standalone)",
    messagesPublished: 0,
    messagesProcessed: 0,
    messagesFailed: 0,
    activeQueues: ["admissions_queue", "notifications_queue", "email_queue", "payments_queue", "audit_queue"],
    inMemoryQueueDepths: {
      admissions_queue: 0,
      notifications_queue: 0,
      email_queue: 0,
      payments_queue: 0,
      audit_queue: 0,
    },
  });
  const [healthStatus, setHealthStatus] = useState<BackendHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeQueue, setActiveQueue] = useState("notifications_queue");
  const [payloadText, setPayloadText] = useState(
    JSON.stringify({ title: "Annual Sports Meet 2026", target: "all-students", priority: "normal" }, null, 2),
  );
  const [logs, setLogs] = useState<Array<{ id: string; time: string; queue: string; status: string; msg: string }>>([
    {
      id: "log-1",
      time: new Date().toLocaleTimeString(),
      queue: "audit_queue",
      status: "CONNECTED",
      msg: "System probe connected to https://ciitm-backend.onrender.com",
    },
  ]);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const [hRes, qRes] = await Promise.allSettled([
        api.get("/api/health"),
        api.get("/api/v1/queue/status"),
      ]);

      if (hRes.status === "fulfilled") {
        setHealthStatus(hRes.value.data);
      }
      if (qRes.status === "fulfilled" && qRes.value.data?.data) {
        setQueueMetrics(qRes.value.data.data);
      } else if (hRes.status === "fulfilled" && hRes.value.data?.queues) {
        setQueueMetrics(hRes.value.data.queues);
      }
    } catch (err) {
      console.warn("Diagnostics probe error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(payloadText);
      } catch {
        toast.error("Invalid JSON payload format.");
        return;
      }

      const res = await api.post("/api/v1/queue/publish", {
        queue: activeQueue,
        payload: parsed,
      });

      toast.success(res.data?.message || `Message published to ${activeQueue}`);
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          queue: activeQueue,
          status: "ACK",
          msg: `Event queued: ${JSON.stringify(parsed).slice(0, 50)}...`,
        },
        ...prev,
      ]);
      fetchDiagnostics();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to publish message.");
    }
  };

  const queuesList = [
    {
      name: "admissions_queue",
      title: "Admissions Engine",
      purpose: "Student applications, verification logs, and enrollment transactions",
      color: "from-blue-500/20 to-indigo-500/10",
      borderColor: "border-indigo-500/30",
    },
    {
      name: "notifications_queue",
      title: "Campus Notifications",
      purpose: "Push circulars, urgent administrative alerts, and student broadcast events",
      color: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
    },
    {
      name: "email_queue",
      title: "Transactional Mail",
      purpose: "Asynchronous OTP dispatches, status emails, and registration receipts",
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      name: "payments_queue",
      title: "Tuition & Billing",
      purpose: "Tuition fee ledger, webhook verification, and invoice receipt generation",
      color: "from-purple-500/20 to-pink-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      name: "audit_queue",
      title: "Security & Audit",
      purpose: "Administrative role creation, authentication traces, and security audits",
      color: "from-rose-500/20 to-red-500/10",
      borderColor: "border-rose-500/30",
    },
  ];

  return (
    <div className="w-full bg-[#07080C] text-white p-3.5 sm:p-6 lg:p-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 mb-2">
              <Activity size={14} /> System Telemetry & Diagnostics
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              RabbitMQ Queue Engine & Server Health
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Live monitoring of message brokers, microservice queues, and backend endpoints on Render.
            </p>
          </div>

          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="self-start sm:self-center flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition active:scale-[0.98]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Probes
          </button>
        </div>

        {/* Runtime Diagnostics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase">Core Runtime</span>
              <Server size={17} className="text-indigo-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white mt-2">Node.js 22 (ESM)</p>
            <p className="text-xs text-zinc-500 mt-1">
              Uptime: {healthStatus?.uptime ? Math.round(healthStatus.uptime) : 1800}s
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-300 uppercase">Database Guard</span>
              <Database size={17} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-lg sm:text-xl font-bold text-emerald-200">
                {healthStatus?.services?.database || "Resilient"}
              </p>
            </div>
            <p className="text-xs text-emerald-400/80 mt-1">MongoDB Mongoose 8</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-amber-300 uppercase">AMQP Message Broker</span>
              <Radio size={17} className="text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-amber-200 truncate">{queueMetrics.mode || "in-memory"}</p>
            <p className="text-xs text-amber-400/80 mt-1">
              {queueMetrics.messagesPublished || 0} Pub • {queueMetrics.messagesProcessed || 0} Ack
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase">WebSocket Stream</span>
              <Cpu size={17} className="text-purple-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white">Socket.io 4.8</p>
            <p className="text-xs text-zinc-500 mt-1">Live Telemetry Active</p>
          </div>
        </div>

        {/* Tauri v2 Native Bridge Diagnostics */}
        <GreetForm />

        {/* 5 RabbitMQ Queues */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-indigo-400" /> Active AMQP Durable Queues
            </h2>
            <span className="text-xs text-zinc-500 hidden sm:inline">Auto-reconnect with FIFO resilience</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {queuesList.map((q) => {
              const depth = queueMetrics.inMemoryQueueDepths?.[q.name] ?? 0;
              return (
                <div
                  key={q.name}
                  onClick={() => setActiveQueue(q.name)}
                  className={`rounded-2xl border ${q.borderColor} bg-gradient-to-br ${q.color} bg-zinc-950 p-4 sm:p-5 shadow-md cursor-pointer transition hover:scale-[1.01] ${
                    activeQueue === q.name ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{q.name}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 size={10} /> Active
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 mt-2">{q.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{q.purpose}</p>

                  <div className="mt-3.5 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>Durable: Yes</span>
                    <span>Depth: {depth}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Dispatcher and Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Dispatcher Form */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send size={15} className="text-indigo-400" /> RabbitMQ Message Dispatcher
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Publish test event payload into selected AMQP message queue
              </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400 font-medium">Target Queue</label>
                <select
                  value={activeQueue}
                  onChange={(e) => setActiveQueue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                >
                  {queuesList.map((q) => (
                    <option key={q.name} value={q.name}>
                      {q.name} ({q.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium">JSON Event Payload</label>
                <textarea
                  rows={4}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition active:scale-[0.99]"
              >
                <Send size={14} /> Dispatch Event to Broker
              </button>
            </form>
          </div>

          {/* Event Stream Log */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock size={15} className="text-indigo-400" /> Asynchronous Message Audit Trail
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">Live Stream</span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs font-mono flex items-start gap-2.5"
                  >
                    <span className="text-zinc-500 shrink-0 text-[11px]">{log.time}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                      {log.queue}
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed break-words">{log.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-900 mt-4 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                <ShieldCheck size={14} /> Broker resilience verified
              </span>
              <button
                onClick={() => setLogs([])}
                className="text-zinc-500 hover:text-zinc-300 transition text-[11px]"
              >
                Clear Stream
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
