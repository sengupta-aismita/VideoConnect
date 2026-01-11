import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Video, Copy, Link2, ArrowLeft } from "lucide-react";
import Notice from "../components/Notice";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isPreview = searchParams.get("preview") === "1";

  const [notice, setNotice] = useState({ type: "", msg: "" });
  const [joined, setJoined] = useState(!isPreview); // ✅ if not preview, already joined

  const showNotice = (type, msg, time = 2500) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: "", msg: "" }), time);
  };

  // ✅ Auto copy invite link ONLY when meeting is started (not preview)
  useEffect(() => {
    if (!roomId) return;
    if (!joined) return;

    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      showNotice("success", "Invite link copied ✅", 1600);
    });
  }, [roomId, joined]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      showNotice("success", "Meeting code copied ✅");
    } catch {
      showNotice("error", "Failed to copy code ❌");
    }
  };

  const copyLink = async () => {
    try {
      const link = `${window.location.origin}/room/${roomId}`;
      await navigator.clipboard.writeText(link);
      showNotice("success", "Invite link copied ✅");
    } catch {
      showNotice("error", "Failed to copy link ❌");
    }
  };

  // ✅ Preview Page UI
  if (isPreview && !joined) {
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

          <button
            onClick={() => navigate("/home")}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-16">
          {/* Notice */}
          <Notice
            notice={notice}
            onClose={() => setNotice({ type: "", msg: "" })}
          />

          <div className="mx-auto max-w-4xl mt-10 rounded-2xl border border-white/10 bg-white/5 p-7 shadow-xl">
            <p className="text-sm text-zinc-400">Meeting Preview</p>

            <h2 className="mt-2 text-2xl font-bold">
              You are about to join meeting
            </h2>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Meeting Code</p>
                <p className="mt-1 text-2xl font-bold tracking-widest">
                  {roomId}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  Copy Code
                </button>

                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                >
                  <Link2 className="h-4 w-4" />
                  Copy Link
                </button>
              </div>
            </div>

            {/* Preview placeholders */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-zinc-500">
                Camera preview (coming)
              </div>

              <div className="aspect-video rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-zinc-500">
                Participant preview
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => navigate("/home")}
                className="w-full rounded-xl py-3 bg-white/10 hover:bg-white/15 transition font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  showNotice("success", "Joining meeting ✅", 1200);
                  setTimeout(() => {
                    setJoined(true);
                    navigate(`/room/${roomId}`); // ✅ remove preview param
                  }, 500);
                }}
                className="w-full rounded-xl py-3 bg-blue-600 hover:bg-blue-700 transition font-semibold"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Actual Meeting UI
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

        <button
          onClick={() => navigate("/home")}
          className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 pb-16">
        {/* Notice */}
        <Notice
          notice={notice}
          onClose={() => setNotice({ type: "", msg: "" })}
        />

        {/* Invite Panel */}
        <div className="mx-auto max-w-4xl mt-2 mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-lg">
          <p className="text-sm text-zinc-400">Invite someone to join</p>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Code display */}
            <div>
              <p className="text-xs text-zinc-400">Meeting Code</p>
              <p className="mt-1 text-2xl font-bold tracking-widest text-white">
                {roomId}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </button>

              <button
                onClick={copyLink}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
              >
                <Link2 className="h-4 w-4" />
                Copy Link
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Share the code or link with your friend — they can paste it in{" "}
            <b>Join with Code</b>.
          </p>
        </div>

        {/* Video Placeholder UI */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-video rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-zinc-400">
            Your video will appear here
          </div>

          <div className="aspect-video rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-zinc-400">
            Participant video will appear here
          </div>
        </div>

        {/* Controls placeholder */}
        <div className="mx-auto max-w-3xl mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
          <p className="text-sm text-zinc-300">
            Meeting running... (controls coming next)
          </p>

          <button
            onClick={() => navigate("/home")}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold hover:bg-red-600 transition cursor-pointer"
          >
            Leave Meeting
          </button>
        </div>
      </main>
    </div>
  );
}
