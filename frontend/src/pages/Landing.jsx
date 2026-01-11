import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Video,
  Wifi,
  ShieldCheck,
  Clock,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
} from "lucide-react";

export default function Landing() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 h-full rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <Video className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-semibold tracking-wide text-white">
            VideoConnect
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/auth"
            className="h-full rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-red-500 transition"
          >
            Login
          </Link>
          <Link
            to="/auth"
            className="h-full rounded-xl px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-red-200 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Connect instantly with friends using{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                peer-to-peer video calls
              </span>
              .
            </h1>

            <p className="mt-4 text-zinc-300 text-base md:text-lg leading-relaxed">
              VideoConnect is a modern WebRTC video meeting platform with JWT
              authentication, meeting history, and room-based calling — built
              for speed and simplicity.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {/* Start a Meeting */}
              <Link
                to="/auth"
                className="h-full rounded-2xl px-6 py-3 font-semibold bg-white text-black hover:bg-red-200 transition text-center"
              >
                Start a Meeting
              </Link>

              {/* Join with Code Input */}
              <div className="flex items-center gap-2 h-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  className="bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 w-full sm:w-40  focus:ring-2 focus:ring-purple-500/40"
                />

                <Link
                  to="/home"
                  className="h-full rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-red-600 hover:text-white transition whitespace-nowrap  shadow-md shadow-black/30"
                >
                  Join
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="group h-full rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Wifi className="h-5 w-5 text-white/70 group-hover:text-white transition" />
                  </div>
                  <div>
                    <p className="text-base font-bold">P2P</p>
                  </div>
                </div>
              </div>

              <div className="group h-full rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-white/70 group-hover:text-white transition" />
                  </div>
                  <div>
                    <p className="text-base font-bold">Secure auth</p>
                    
                  </div>
                </div>
              </div>
              <div className="group h-full rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white/70 group-hover:text-white transition" />
                  </div>
                  <div>
                    <p className="text-base font-bold">History</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 h-full rounded-[2rem]" />
            <div className="relative h-full rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white-300 font-semibold">
                  Meeting Preview
                </p>
                <span className="text-xs h-full rounded-full bg-green-600/20 text-white-300 px-3 py-1">
                  Live
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="aspect-video h-full rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl">
                  <img
                    src="/p-1.webp"
                    alt="User 1"
                    className="h-full w-full object-cover h-full rounded-2xl"
                  />
                </div>
                <div className="aspect-video h-full rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl">
                  <img
                    src="/p-2.webp"
                    alt="Person 2"
                    className="h-full w-full object-cover h-full rounded-2xl"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between h-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMicOn((prev) => !prev)}
                    className={`group h-full rounded-xl px-3 py-2 transition border ${
                      micOn
                        ? "bg-white/10 hover:bg-white/15 border-white/10"
                        : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30"
                    }`}
                  >
                    {micOn ? (
                      <Mic className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                    ) : (
                      <MicOff className="h-5 w-5 text-red-400 group-hover:text-red-300 transition" />
                    )}
                  </button>
                  <button
                    onClick={() => setCamOn((prev) => !prev)}
                    className={`group h-full rounded-xl px-3 py-2 transition border ${
                      camOn
                        ? "bg-white/10 hover:bg-white/15 border-white/10"
                        : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30"
                    }`}
                  >
                    {camOn ? (
                      <Video className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                    ) : (
                      <VideoOff className="h-5 w-5 text-red-400 group-hover:text-red-300 transition" />
                    )}
                  </button>
                  <button
                    onClick={() => setScreenOn((prev) => !prev)}
                    className={`group h-full rounded-xl px-3 py-2 transition border ${
                      screenOn
                        ? "bg-white/10 hover:bg-white/15 border-white/10"
                        : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30"
                    }`}
                  >
                    {screenOn ? (
                      <ScreenShare className="h-5 w-5 text-white/80 group-hover:text-white transition" />
                    ) : (
                      <ScreenShareOff className="h-5 w-5 text-red-400 group-hover:text-red-300 transition" />
                    )}
                  </button>
                </div>

                <button className="h-full rounded-xl bg-red-500 px-4 py-2 font-semibold hover:bg-red-600 transition">
                  Leave
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-white/10 pt-8 text-sm text-zinc-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} VideoConnect. Built by Aismita.</p>
          <div className="flex gap-4">
            <a className="hover:text-white transition" href="#">
              Privacy
            </a>
            <a className="hover:text-white transition" href="#">
              Terms
            </a>
            <a className="hover:text-white transition" href="#">
              Support
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
