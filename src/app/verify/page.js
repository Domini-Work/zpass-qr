"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const [uuid, setUuid] = useState("");
  const [status, setStatus] = useState("idle");
  const [participant, setParticipant] = useState(null);
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!uuid.trim()) return;

    setStatus("loading");
    setMessage("");
    setParticipant(null);

    try {
      const response = await fetch(`/api/verify?id=${encodeURIComponent(uuid.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setParticipant(data.participant);
      } else {
        setStatus("error");
        setMessage(data.error || "Participant not found.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tight">
            Verify Pass
          </h1>
          <p className="text-slate-400 text-sm">Volunteer Check-in Scanner</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 mb-8">
          <div>
            <label htmlFor="uuid" className="text-sm font-medium text-slate-300">
              Scanned QR Code (UUID)
            </label>
            <input
              id="uuid"
              type="text"
              required
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              className="w-full mt-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="e.g. a4cfb7a2-b1b6-..."
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || !uuid}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Verifying..." : "Look Up Participant"}
          </button>
        </form>

        {status === "error" && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-center border border-red-500/20 animate-in zoom-in duration-300">
            {message}
          </div>
        )}

        {status === "success" && participant && (
          <div className="bg-slate-900/50 border border-emerald-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{participant.name}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                participant.role === 'SPEAKER' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                participant.role === 'VOLUNTEER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-slate-700 text-slate-300'
              }`}>
                {participant.role}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Email</span>
                <span className="text-white text-right">{participant.email}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-400">Registered</span>
                <span className="text-white text-right">
                  {new Date(participant.timestamp).toLocaleDateString()} at {new Date(participant.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="mt-8">
         <a href="/" className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2">
           &larr; Back to Registration
         </a>
      </div>
    </div>
  );
}
