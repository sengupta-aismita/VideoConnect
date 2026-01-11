import { useState } from "react";
import { Link } from "react-router-dom";
import { Video, Mail, Lock, User } from "lucide-react";
import AuthGlobe from "../components/AuthGlobe";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide">
            VideoConnect
          </span>
        </Link>

        <Link
          to="/"
          className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 transition"
        >
          Back to Home
        </Link>
      </header>

      {/* Auth */}
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Globe Panel (no card, pure black bg) */}
          <div className="hidden lg:flex relative h-[520px] rounded-[2rem] overflow-hidden bg-black">
            {/* subtle glow only */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

            <div className="relative w-full p-10 flex flex-col justify-between">
              <div>
                <p className="text-3xl font-bold">Connect globally.</p>
                <p className="mt-2 text-sm text-zinc-300 max-w-sm leading-relaxed">
                  Real-time peer-to-peer video meetings with secure rooms and
                  JWT login.
                </p>
              </div>

              {/* Globe */}
              <div className="flex-1 flex items-center justify-center">
                <AuthGlobe />
              </div>

              <p className="text-xs text-zinc-400">
                WebRTC • Socket.io • Secure rooms
              </p>
            </div>
          </div>

          {/* Right card */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem]" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
              {/* Toggle */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/30 border border-white/10 p-2">
                <button
                  onClick={() => setMode("login")}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {mode === "login"
                  ? "Login to start or join meetings instantly."
                  : "Sign up to access your meeting history."}
              </p>

              {/* Form */}
              <form className="mt-6 space-y-4">
                {mode === "signup" && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                    <User className="h-5 w-5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-500"
                    />
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-500"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                  <Lock className="h-5 w-5 text-zinc-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-500"
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-2xl px-6 py-3 font-semibold bg-white text-black hover:bg-zinc-200 transition"
                >
                  {mode === "login" ? "Login" : "Create account"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl px-6 py-3 font-semibold bg-white/10 hover:bg-white/15 transition"
                >
                  Continue with Google
                </button>

                {mode === "login" && (
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Forgot password?</span>
                    <button
                      type="button"
                      className="hover:text-white transition"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </form>

              <p className="mt-6 text-xs text-zinc-500">
                By continuing, you agree to our{" "}
                <span className="text-zinc-300 hover:text-white cursor-pointer transition">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-zinc-300 hover:text-white cursor-pointer transition">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
