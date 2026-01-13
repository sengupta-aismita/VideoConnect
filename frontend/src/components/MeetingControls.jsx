// src/components/MeetingControls.jsx
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
} from "lucide-react";

export default function MeetingControls({
  micOn,
  camOn,
  sharing,
  onToggleMic,
  onToggleCam,
  onShareScreen,
  onLeave,
  compact = false,
}) {
  const btnSize = compact ? "h-10 w-10" : "h-11 w-11";
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className={`flex items-center justify-center gap-3 ${compact ? "" : "flex-wrap"}`}>
      {/* Mic */}
      <button
        onClick={onToggleMic}
        className={`${btnSize} rounded-full border border-white/10 flex items-center justify-center transition cursor-pointer
          ${micOn ? "bg-white/10 hover:bg-white/15" : "bg-red-500/20 hover:bg-red-500/30"}`}
        title="Toggle Mic"
      >
        {micOn ? (
          <Mic className={`${iconSize} text-white`} />
        ) : (
          <MicOff className={`${iconSize} text-red-300`} />
        )}
      </button>

      {/* Camera */}
      <button
        onClick={onToggleCam}
        className={`${btnSize} rounded-full border border-white/10 flex items-center justify-center transition cursor-pointer
          ${camOn ? "bg-white/10 hover:bg-white/15" : "bg-red-500/20 hover:bg-red-500/30"}`}
        title="Toggle Camera"
      >
        {camOn ? (
          <VideoIcon className={`${iconSize} text-white`} />
        ) : (
          <VideoOff className={`${iconSize} text-red-300`} />
        )}
      </button>

      {/* Screen Share */}
      <button
        onClick={onShareScreen}
        className={`${btnSize} rounded-full border border-white/10 flex items-center justify-center transition cursor-pointer
          ${sharing ? "bg-blue-500/20 hover:bg-blue-500/30" : "bg-white/10 hover:bg-white/15"}`}
        title="Share Screen"
      >
        {sharing ? (
          <ScreenShare className={`${iconSize} text-blue-300`} />
        ) : (
          <ScreenShareOff className={`${iconSize} text-red-500`} />
        )}
      </button>

      {/* Leave (only if provided) */}
      {onLeave && (
        <button
          onClick={onLeave}
          className={`flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 transition cursor-pointer
            ${compact ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"} font-semibold`}
          title="Leave meeting"
        >
          <PhoneOff className={compact ? "h-3 w-3" : "h-4 w-4"} />
          Leave
        </button>
      )}
    </div>
  );
}
