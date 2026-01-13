import { useAuth0 } from "@auth0/auth0-react";
import { Video, LogOut, VideoIcon, Hash, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Notice from "../components/Notice";

export default function Home() {
 

  const { user, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");
  const [displayUser, setDisplayUser] = useState("");
  const [notice, setNotice] = useState({ type: "", msg: "" });

  const showNotice = (type, msg, time = 2500) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: "", msg: "" }), time);
  };

  // ✅ show name for both auth0 + jwt users
  useEffect(() => {
    if (isAuthenticated && user) {
      setDisplayUser(user?.name || user?.email || "");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));
    

    if (savedUser) {
       const niceName =
    savedUser?.fullName ||
    savedUser?.username ||
    (savedUser?.email ? savedUser.email.split("@")[0] : "Guest");
      setDisplayUser(niceName);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
  console.log("HOME TOKEN:", localStorage.getItem("accessToken"));
  console.log("HOME USER:", localStorage.getItem("user"));
}, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
    localStorage.removeItem("user");

    if (isAuthenticated) {
      logout({
        logoutParams: { returnTo: window.location.origin + "/auth" },
      });
      return;
    }

    navigate("/auth");
  };

  const handleStartMeeting = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:8080/api/v1/auth/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        showNotice("error", data?.message || "Room creation failed");
        return;
      }

      const meetingCode = data?.data?.meetingCode || data?.meetingCode;

    showNotice("success", "Room created ✅ Redirecting...", 1200);
    setTimeout(() => navigate(`/room/${meetingCode}`), 600);
    } catch (err) {
      console.log(err);
      showNotice("error", err?.message ||"Something went wrong while creating room");
    }
  };

  const handleJoinMeeting = async () => {
  try {
    if (!joinCode.trim()) {
      showNotice("error", "Please enter a meeting code!");
      return;
    }

    const token = localStorage.getItem("accessToken");

    const res = await fetch("http://localhost:8080/api/v1/auth/join-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ meetingCode: joinCode.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotice("error", data?.message || "Invalid meeting code");
      return;
    }

    const meetingCode = data?.data?.meetingCode || joinCode.trim();

    showNotice("success", "Code verified ✅", 1200);

    setTimeout(() => navigate(`/room/${meetingCode}?preview=1`), 600);
  } catch (err) {
    console.log(err);
    showNotice("error", "Something went wrong while joining room");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide">
            VideoConnect
          </span>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-zinc-300 font-semibold hidden sm:block">
            {displayUser || "Guest"}
          </p>

          <button
            onClick={handleLogout}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-red-600 transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <Notice notice={notice} onClose={() => setNotice({ type: "", msg: "" })} />

        <h1 className="text-3xl md:text-4xl font-bold">Welcome !</h1>
        <p className="mt-2 text-zinc-300">
          Start a meeting or join using a code.
        </p>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleStartMeeting}
            className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-6 text-left hover:-translate-y-1 duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <VideoIcon className="h-5 w-5 text-purple-300" />
              </div>
              <p className="text-lg font-semibold">Start an Instant Meeting</p>
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              Create a new secure room instantly.
            </p>
          </button>

          <div className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-6 text-left hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Hash className="h-5 w-5 text-blue-300" />
              </div>
              <p className="text-lg font-semibold">Join with Code</p>
            </div>

            <p className="text-sm text-zinc-400 mt-2">
              Enter room code and connect.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter room ID"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
              />

              <button
                onClick={handleJoinMeeting}
                className="rounded-xl px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Meeting history */}
        <div
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition cursor-pointer"
          onClick={() => navigate("/history")}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white/70" />
            </div>
            <p className="text-lg font-semibold">Meeting History</p>
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            View your past meetings here.
          </p>
        </div>
      </main>
    </div>
  );
}
