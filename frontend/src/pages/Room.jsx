import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MeetingPreview from "../components/MeetingPreview";
import MeetingStage from "../components/MeetingStage";
import socket from "../socket";
import useWebRTC from "../hooks/useWebRTC";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isPreview = searchParams.get("preview") === "1";

  const [notice, setNotice] = useState({ type: "", msg: "" });
  const [joined, setJoined] = useState(!isPreview);
  const [micOn, setMicOn] = useState(() => {
    const saved = localStorage.getItem("vc_micOn");
    return saved !== null ? JSON.parse(saved) : false; // ✅ default false
  });

  const [camOn, setCamOn] = useState(() => {
    const saved = localStorage.getItem("vc_camOn");
    return saved !== null ? JSON.parse(saved) : false; // ✅ default false
  });

  const [sharing, setSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const myName =
    savedUser?.fullName || savedUser?.username || savedUser?.email || "You";

  const { localStreamRef, remoteStreams, callUser, removeUser } = useWebRTC({
    joined,

    micOn,
    camOn,
  });

  useEffect(() => {
    localStorage.setItem("vc_micOn", JSON.stringify(micOn));
  }, [micOn]);

  useEffect(() => {
    localStorage.setItem("vc_camOn", JSON.stringify(camOn));
  }, [camOn]);

  const showNotice = (type, msg, time = 2500) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: "", msg: "" }), time);
  };

  // ✅ auto copy invite link after join
  useEffect(() => {
    if (!roomId) return;
    if (!joined) return;

    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      showNotice("success", "Invite link copied ✅", 1600);
    });
    // eslint-disable-next-line
  }, [roomId, joined]);

  // ✅ join socket room + sync participants
  useEffect(() => {
  if (!roomId) return;
  if (!joined) return;

  socket.emit("join-call", { roomId, name: myName });

  const onUserJoined = (joinedId, list) => {
    const others = list
      .filter((p) => p.id !== socket.id)
      .map((p) => ({ id: p.id, name: p.name }));

    setRemoteUsers(others);

    if (joinedId === socket.id) {
      // I joined: call everyone already in room
      others.forEach((u) => {
        const tryCall = () => {
          if (localStreamRef?.current) callUser(u.id);
          else setTimeout(tryCall, 250);
        };
        tryCall();
      });
      return;
    }

    if (joinedId && joinedId !== socket.id) {
      // someone else joined after me: call them
      const tryCall = () => {
        if (localStreamRef?.current) callUser(joinedId);
        else setTimeout(tryCall, 250);
      };
      tryCall();
    }
  };

  const onUserLeft = (leftId) => {
    setRemoteUsers((prev) => prev.filter((u) => u.id !== leftId));
    removeUser(leftId);
  };

  socket.on("user-joined", onUserJoined);
  socket.on("user-left", onUserLeft);

  return () => {
    socket.off("user-joined", onUserJoined);
    socket.off("user-left", onUserLeft);
  };
}, [roomId, joined, myName, callUser, removeUser, localStreamRef]);

  // ✅ participants (only once!)
  const participants = [
    { id: socket.id || "me", name: myName, isMe: true },
    ...remoteUsers.map((u) => ({ ...u, isMe: false })),
  ];

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

  const handleScreenShare = async () => {
    try {
      if (!sharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        setSharing(true);
        showNotice("success", "Screen sharing started", 1200);

        stream.getVideoTracks()[0].onended = () => {
          setSharing(false);
          showNotice("success", "Screen sharing stopped", 1200);
        };
      } else {
        setSharing(false);
        showNotice("success", "Screen sharing stopped", 1200);
      }
    } catch (err) {
      console.log(err);
      showNotice("error", "Screen share denied", 1500);
    }
  };

  const getGridClass = (count) => {
    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-4";
  };

  // ✅ Preview Page UI
  if (isPreview && !joined) {
    return (
      <MeetingPreview
        roomId={roomId}
        notice={notice}
        setNotice={setNotice}
        navigate={navigate}
        micOn={micOn}
        camOn={camOn}
        sharing={sharing}
        onToggleMic={() => setMicOn((p) => !p)}
        onToggleCam={() => setCamOn((p) => !p)}
        onShareScreen={handleScreenShare}
        copyCode={copyCode}
        copyLink={copyLink}
        onJoin={() => {
          showNotice("success", "Joining meeting ✅", 1200);
          setTimeout(() => {
            setJoined(true);
            navigate(`/room/${roomId}`);
          }, 500);
        }}
      />
    );
  }

  // ✅ Actual Meeting UI
  return (
    <MeetingStage
      roomId={roomId}
      notice={notice}
      setNotice={setNotice}
      navigate={navigate}
      participants={participants}
      getGridClass={getGridClass}
      micOn={micOn}
      camOn={camOn}
      sharing={sharing}
      onToggleMic={() => setMicOn((p) => !p)}
      onToggleCam={() => setCamOn((p) => !p)}
      onShareScreen={handleScreenShare}
      onLeave={() => navigate("/home")}
      copyCode={copyCode}
      copyLink={copyLink}
      localStreamRef={localStreamRef}
      remoteStreams={remoteStreams}
    />
  );
}
