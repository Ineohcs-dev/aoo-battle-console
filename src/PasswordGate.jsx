import { useState } from "react";

const STORED_KEY = "aoo_auth";
const CORRECT = import.meta.env.VITE_PASSWORD;

export function isAuthenticated() {
  // If no password is configured, always open
  if (!CORRECT) return true;
  return sessionStorage.getItem(STORED_KEY) === CORRECT;
}

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (authed) return children;

  const attempt = () => {
    if (input === CORRECT) {
      sessionStorage.setItem(STORED_KEY, CORRECT);
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" }}>
      <div className={`w-80 border border-neutral-800 bg-[#0e0e0e] p-8 ${shake ? "animate-shake" : ""}`}
        style={shake ? { animation: "shake 0.4s ease" } : {}}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 border border-amber-700/60 flex items-center justify-center bg-amber-950/30">
            <div className="w-2 h-2 bg-amber-500" />
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600">AOO · Battle Sim</div>
            <div className="font-mono text-sm tracking-[0.15em] uppercase text-neutral-200">Access Control</div>
          </div>
        </div>

        <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4">
          Enter password
        </div>

        <input
          type="password"
          value={input}
          autoFocus
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          className="w-full bg-[#080808] border border-neutral-700 focus:border-amber-700 outline-none
                     font-mono text-sm text-neutral-200 px-3 h-9 mb-3 transition-colors"
        />

        {error && (
          <div className="font-mono text-[10px] text-red-500 mb-3 tracking-wider">
            ✗ Incorrect password
          </div>
        )}

        <button
          onClick={attempt}
          className="w-full h-9 border border-amber-700/60 hover:border-amber-600 bg-amber-950/40
                     hover:bg-amber-950/60 font-mono text-[10px] uppercase tracking-widest
                     text-amber-500 hover:text-amber-400 transition-colors">
          Authenticate
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
