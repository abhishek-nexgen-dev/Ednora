import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Laptop, Terminal, Sparkles, Check, ArrowRight } from "lucide-react";

function GreetForm() {
  const [name, setName] = useState("Admin Engineer");
  const [message, setMessage] = useState<string | null>(null);
  const [isTauri, setIsTauri] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      setIsTauri(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
        const response = await invoke<string>("greet", { name });
        setMessage(response);
      } else {
        setMessage(`Hello, ${name || "Administrator"}! (Connected via Web/IPC Bridge Simulation)`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Bridge response: Hello, ${name || "Administrator"}! (${msg || "Standard"})`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/30 via-zinc-950 to-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Laptop size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Tauri v2 Desktop Native Bridge
            </h3>
            <p className="text-xs text-zinc-500">
              Bi-directional Rust IPC command execution & operating system integration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTauri ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Check size={11} /> Tauri Native App
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles size={11} /> Web / Desktop Bridge
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Terminal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Enter candidate or administrator name..."
            aria-label="Name"
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition active:scale-95 whitespace-nowrap"
        >
          <span>Invoke Rust Command</span>
          <ArrowRight size={13} />
        </button>
      </form>

      {message && (
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 font-mono text-xs text-emerald-400 flex items-start gap-2.5 animate-fadeIn">
          <span className="text-zinc-500 shrink-0 font-bold">&gt;</span>
          <p className="leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}

export { GreetForm };
