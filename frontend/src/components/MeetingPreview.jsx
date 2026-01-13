import { Video, Copy, Link2, ArrowLeft } from "lucide-react";
import Notice from "./Notice";
import MeetingControls from "./MeetingControls";
import { useEffect, useRef } from "react";

export default function MeetingPreview({
  roomId,
  notice,
  setNotice,
  navigate,
  micOn,
  camOn,
  sharing,
  onToggleMic,
  onToggleCam,
  onShareScreen,
  copyCode,
  copyLink,
  onJoin,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startPreview = async () => {
      try {
        if (streamRef.current) return;

        // ✅ only request camera if camOn
        const stream = await navigator.mediaDevices.getUserMedia({
          video: camOn,
          audio: true,
        });

        // Apply initial mic state
        stream.getAudioTracks().forEach((t) => (t.enabled = micOn));

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Preview camera/mic error:", err);
      }
    };

    startPreview();

    return () => {
      // ✅ cleanup when leaving preview page
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      // ✅ detach video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Mic toggle
  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = micOn;
    });
  }, [micOn]);

  // ✅ Camera toggle (REAL OFF = stop track + DETACH srcObject)
  useEffect(() => {
    const toggleCamera = async () => {
      if (!streamRef.current) return;
      const stream = streamRef.current;

      if (!camOn) {
        // ✅ Turn OFF camera completely
        stream.getVideoTracks().forEach((track) => {
          track.stop();
          stream.removeTrack(track);
        });

        // ✅ Detach so camera light turns off
        if (videoRef.current) videoRef.current.srcObject = null;

        return;
      }

      // ✅ Turn ON camera again
      try {
        // safety: remove old tracks
        stream.getVideoTracks().forEach((t) => {
          t.stop();
          stream.removeTrack(t);
        });

        const camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const newVideoTrack = camStream.getVideoTracks()[0];
        stream.addTrack(newVideoTrack);

        // stop temporary container tracks except added one
        camStream.getTracks().forEach((t) => {
          if (t !== newVideoTrack) t.stop();
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Camera restart failed:", err);
      }
    };

    toggleCamera();
  }, [camOn]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
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

      {/* Main */}
      <main className="mx-auto w-full max-w-6xl flex-1 min-h-0 px-6 pb-6">
        <Notice
          notice={notice}
          onClose={() => setNotice({ type: "", msg: "" })}
        />

        <div className="mx-auto max-w-4xl h-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl overflow-hidden flex flex-col">
          <p className="text-sm text-zinc-400">Meeting Preview</p>
          <h2 className="mt-2 text-2xl font-bold">
            You are about to join meeting
          </h2>

          <div className="flex-1 min-h-0 mt-3 flex flex-col gap-4">
            <div className="relative w-full flex-1 min-h-[260px] rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center text-zinc-500 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />

              {!camOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-zinc-300">
                  Camera is off
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md shadow-lg">
                <MeetingControls
                  micOn={micOn}
                  camOn={camOn}
                  sharing={sharing}
                  onToggleMic={onToggleMic}
                  onToggleCam={onToggleCam}
                  onShareScreen={onShareScreen}
                  compact
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/home")}
                className="w-full rounded-xl py-3 bg-white/10 hover:bg-white/15 transition font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={onJoin}
                className="w-full rounded-xl py-3 bg-blue-600 hover:bg-blue-700 transition font-semibold"
              >
                Join Meeting
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
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
          </div>
        </div>
      </main>
    </div>
  );
}
