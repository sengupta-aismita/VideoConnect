import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            🎥
          </div>
          <span className="text-xl font-semibold tracking-wide">VideoConnect</span>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/auth"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 transition"
          >
            Login
          </Link>
          <Link
            to="/auth"
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-200">
              ✅ Secure • ⚡ Fast • 🔥 Peer-to-peer
            </p>

            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Connect instantly with friends using{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                peer-to-peer video calls
              </span>
              .
            </h1>

            <p className="mt-4 text-zinc-300 text-base md:text-lg leading-relaxed">
              VideoConnect is a modern WebRTC video meeting platform with JWT
              authentication, meeting history, and room-based calling — built for speed
              and simplicity.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth"
                className="rounded-2xl px-6 py-3 font-semibold bg-white text-black hover:bg-zinc-200 transition text-center"
              >
                Start a Meeting
              </Link>

              <Link
                to="/home"
                className="rounded-2xl px-6 py-3 font-semibold bg-white/10 hover:bg-white/15 transition text-center"
              >
                Join with Code
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xl font-bold">P2P</p>
                <p className="text-sm text-zinc-300">WebRTC calls</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xl font-bold">JWT</p>
                <p className="text-sm text-zinc-300">Secure auth</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xl font-bold">History</p>
                <p className="text-sm text-zinc-300">Meeting logs</p>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem]" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-300">Meeting Preview</p>
                <span className="text-xs rounded-full bg-green-500/20 text-green-300 px-3 py-1">
                  Live
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="aspect-video rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl">
                  🙂
                </div>
                <div className="aspect-video rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl">
                  👤
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-black/30 border border-white/10 px-4 py-3">
                <div className="flex gap-2">
                  <button className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/15 transition">
                    🎤
                  </button>
                  <button className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/15 transition">
                    🎥
                  </button>
                  <button className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/15 transition">
                    🖥️
                  </button>
                </div>

                <button className="rounded-xl bg-red-500 px-4 py-2 font-semibold hover:bg-red-600 transition">
                  Leave
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                Built with WebRTC + Socket.io • Designed with React + Tailwind
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-white/10 pt-8 text-sm text-zinc-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} VideoConnect. Built by Aismita.</p>
          <div className="flex gap-4">
            <a className="hover:text-white transition" href="#">Privacy</a>
            <a className="hover:text-white transition" href="#">Terms</a>
            <a className="hover:text-white transition" href="#">Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
