import { useEffect, useMemo, useRef, useState } from "react";
import { Video, ArrowLeft, Copy, Link2, MicOff } from "lucide-react";

import Notice from "./Notice";
import MeetingControls from "./MeetingControls";
import ParticipantsStrip from "./ParticipantsStrip";

// ✅ Remote video component OUTSIDE (important)
function RemoteVideo({ id, remoteStreams }) {
  const vRef = useRef(null);

  useEffect(() => {
    if (vRef.current && remoteStreams?.[id]) {
      vRef.current.srcObject = remoteStreams[id];
    }
  }, [id, remoteStreams]);

  return (
    <video
      ref={vRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover"
    />
  );
}

export default function MeetingStage({
  roomId,
  notice,
  setNotice,
  navigate,
  participants,
  micOn,
  camOn,
  sharing,
  onToggleMic,
  onToggleCam,
  onShareScreen,
  onLeave,
  copyCode,
  copyLink,

  // ✅ WebRTC
  localStreamRef,
  remoteStreams,
}) {
  const mySpeakerVideoRef = useRef(null);
  const myTileVideoRef = useRef(null);

  const [speakerId, setSpeakerId] = useState(null);

  const speaker = useMemo(() => {
    if (!participants?.length) return null;

    const remote = participants.find((p) => !p.isMe);
    const me = participants.find((p) => p.isMe);

    if (!speakerId) return remote || me;
    return participants.find((p) => p.id === speakerId) || remote || me;
  }, [participants, speakerId]);

  const others = useMemo(() => {
    if (!participants?.length) return [];
    return participants.filter((p) => p.id !== speaker?.id);
  }, [participants, speaker]);

  // ✅ attach local stream to local refs
  useEffect(() => {
    if (!localStreamRef?.current) return;

    if (mySpeakerVideoRef.current) {
      mySpeakerVideoRef.current.srcObject = localStreamRef.current;
    }
    if (myTileVideoRef.current) {
      myTileVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [localStreamRef]);

  // ✅ tile renderer (REMOTE tiles are name-only now)
  const renderTile = (p, onClick) => {
    const showMyVideoHere = p.isMe && !speaker?.isMe;

    return (
      <button
        data-id={p.id}
        onClick={onClick}
        className={`relative w-[210px] sm:w-[240px] h-[130px] md:h-[150px] shrink-0 rounded-2xl border overflow-hidden transition flex items-center justify-center
        ${
          p.id === speaker?.id
            ? "border-blue-500/50 ring-2 ring-blue-500/30 bg-black/60"
            : "border-white/10 bg-black/40 hover:bg-black/50"
        }`}
      >
        {/* ✅ ME tile */}
        {p.isMe ? (
          showMyVideoHere ? (
            <>
              <video
                ref={myTileVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {!camOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-zinc-200">
                  Camera is off
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-zinc-300">You</span>
          )
        ) : (
          // ✅ REMOTE tiles are name-only (prevents too many WebMediaPlayers)
          <span className="text-sm text-zinc-300">{p.name}</span>
        )}

        <div className="absolute bottom-2 left-2 rounded-lg bg-black/50 px-3 py-1 text-xs text-white border border-white/10">
          {p.name} {p.isMe ? "(You)" : ""}
        </div>
      </button>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* header */}
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
          className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </header>

      {/* content */}
      <main className="mx-auto max-w-6xl px-6 pb-40 flex flex-col h-[calc(100vh-96px)]">
        <Notice
          notice={notice}
          onClose={() => setNotice({ type: "", msg: "" })}
        />

        <div className="flex-1 min-h-0 mt-4 flex flex-col gap-4">
          {/* speaker */}
          <div className="relative flex-1 min-h-[320px] rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
            {/* ✅ ME as speaker */}
            {speaker?.isMe ? (
              <>
                <video
                  ref={mySpeakerVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />

                {!camOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-zinc-200 text-lg">
                    Camera is off
                  </div>
                )}

                {!micOn && (
                  <div className="absolute top-4 right-4 rounded-full bg-black/60 border border-white/10 p-2">
                    <MicOff className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </>
            ) : remoteStreams?.[speaker?.id] ? (
              // ✅ remote video ONLY in speaker view
              <div className="w-full h-full">
                <RemoteVideo id={speaker.id} remoteStreams={remoteStreams} />
              </div>
            ) : (
              <span className="text-sm md:text-base text-zinc-300">
                {speaker?.name}
              </span>
            )}

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1 text-xs text-white border border-white/10">
              {speaker?.name} {speaker?.isMe ? "(You)" : ""}
            </div>
          </div>

          {/* strip */}
          <ParticipantsStrip
            others={others}
            speaker={speaker}
            setSpeakerId={setSpeakerId}
            renderTile={(p, onClick) => renderTile(p, onClick)}
          />
        </div>
      </main>

      {/* controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md shadow-lg">
          <MeetingControls
            micOn={micOn}
            camOn={camOn}
            sharing={sharing}
            onToggleMic={onToggleMic}
            onToggleCam={onToggleCam}
            onShareScreen={onShareScreen}
            onLeave={onLeave}
          />
        </div>
      </div>

      {/* invite panel */}
      <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
        <div className="w-[340px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md shadow-lg opacity-95">
          <p className="text-xs text-zinc-400">Invite someone</p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-zinc-400">Meeting Code</p>
              <p className="text-xl font-bold tracking-widest text-white">
                {roomId}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 transition"
              >
                <Copy className="h-4 w-4" />
                Code
              </button>

              <button
                onClick={copyLink}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 transition"
              >
                <Link2 className="h-4 w-4" />
                Link
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-zinc-500">
            Share code or link to invite.
          </p>
        </div>
      </div>
    </div>
  );
}
