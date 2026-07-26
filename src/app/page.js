"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "ATTENDEE", passcode: "" });
  const [status, setStatus] = useState("idle");
  const [qrCode, setQrCode] = useState(null);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setQrCode(data.qrCode);
        setMessage("Registration successful! Here is your Z-Pass.");
      } else {
        setStatus("error");
        setMessage(data.error || "An error occurred during registration.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to connect to the server.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "ATTENDEE", passcode: "" });
    setStatus("idle");
    setQrCode(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tight">
            Z-Pass
          </h1>
          <p className="text-slate-400 text-sm">Event Registration System</p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg mb-6 w-full text-center border border-emerald-500/20">
              {message}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
              {qrCode && (
                <img 
                  src={qrCode} 
                  alt="Z-Pass QR Code" 
                  className="w-48 h-48"
                />
              )}
            </div>
            
            <div className="text-center mb-6 w-full">
              <p className="text-xl font-semibold">{formData.name}</p>
              <p className="text-slate-400 text-sm">{formData.role}</p>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
            >
              Register Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
            {status === "error" && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/20">
                {message}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="role" className="text-sm font-medium text-slate-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="SPEAKER">Speaker</option>
                <option value="VOLUNTEER">Volunteer</option>
              </select>
            </div>

            {formData.role !== "ATTENDEE" && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label htmlFor="passcode" className="text-sm font-medium text-slate-300">
                  Access Passcode
                </label>
                <input
                  id="passcode"
                  name="passcode"
                  type="password"
                  required
                  value={formData.passcode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter role passcode"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Generate Z-Pass"
              )}
            </button>
          </form>
        )}
      </main>
      
      <footer className="z-10 mt-12 text-slate-500 text-sm">
        <p>&copy; 2026 Z-Pass Events. All rights reserved.</p>
      </footer>
    </div>
  );
}
