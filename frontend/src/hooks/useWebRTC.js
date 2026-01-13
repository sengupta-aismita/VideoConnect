import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function useWebRTC({ joined, micOn, camOn }) {
  const localStreamRef = useRef(null);
  const peersRef = useRef({}); // remoteId -> RTCPeerConnection
  const [remoteStreams, setRemoteStreams] = useState({}); // remoteId -> MediaStream
  const offeredRef = useRef(new Set());


  // ✅ init local media once
  useEffect(() => {
    const initLocal = async () => {
      if (!joined) return;
      if (localStreamRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // apply initial state
        stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
        stream.getVideoTracks().forEach((t) => (t.enabled = camOn));

        localStreamRef.current = stream;

        console.log(
          "✅ got local stream",
          stream.getTracks().map((t) => `${t.kind}:${t.label}`)
        );
      } catch (err) {
        console.log("❌ getUserMedia failed", err.name, err.message);
      }
    };

    initLocal();
    // eslint-disable-next-line
  }, [joined]);

  // ✅ mic toggle
  useEffect(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  // ✅ cam toggle
  useEffect(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  // ✅ helper: wait until local stream exists
  const waitForLocalStream = () =>
    new Promise((resolve) => {
      const check = () => {
        if (localStreamRef.current) resolve();
        else setTimeout(check, 200);
      };
      check();
    });

  const createPeerConnection = (remoteId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    console.log("🧩 creating pc for", remoteId);

    // state logs
    pc.onconnectionstatechange = () => {
      console.log("🔗 conn state", remoteId, pc.connectionState);
    };
    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ice state", remoteId, pc.iceConnectionState);
    };

    // add local tracks (NOW stream guaranteed)
    const localStream = localStreamRef.current;
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    // remote tracks
    pc.ontrack = (event) => {
      console.log("🎥 remote track event from", remoteId, event.streams);

      const stream = event.streams[0];
      if (!stream) return;

      setRemoteStreams((prev) => {
        // avoid unnecessary rerender spam
        if (prev[remoteId] === stream) return prev;
        return { ...prev, [remoteId]: stream };
      });
    };

    // ice candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", remoteId, {
          type: "ice",
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  // ✅ handle signaling only
  useEffect(() => {
    if (!joined) return;

    const handleSignal = async (fromId, message) => {
      if (!fromId || !message) return;

      console.log("📩 signal from", fromId, message.type);

      let pc = peersRef.current[fromId];

      // ✅ CRITICAL FIX: wait for local stream BEFORE creating pc
      if (!pc) {
        await waitForLocalStream();
        pc = createPeerConnection(fromId);
        peersRef.current[fromId] = pc;
      }

      try {
        if (message.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(message.offer));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit("signal", fromId, { type: "answer", answer });
          console.log("📤 sent ANSWER to", fromId);
        }

        if (message.type === "answer") {

            if (pc.signalingState === "stable") {
    console.log("⚠️ duplicate ANSWER ignored from", fromId);
    return;
  }
          await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
          console.log("✅ answer applied from", fromId);
        }

        if (message.type === "ice") {
          await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      } catch (err) {
        console.log("❌ Signal handling error:", err);
      }
    };

    socket.on("signal", handleSignal);

    return () => {
      socket.off("signal", handleSignal);
    };
  }, [joined]);

  // ✅ called from Room.jsx when someone joins
  const callUser = async (remoteId) => {
    if (!remoteId) return;

    // wait for local stream
    await waitForLocalStream();

    // prevent duplicates
    if (peersRef.current[remoteId]) return;

    console.log("📞 calling user", remoteId);

    const pc = createPeerConnection(remoteId);
    peersRef.current[remoteId] = pc;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("signal", remoteId, { type: "offer", offer });
    console.log("📤 sent OFFER to", remoteId);

    if (offeredRef.current.has(remoteId)) return;
offeredRef.current.add(remoteId);

  };

  // ✅ called from Room.jsx when someone leaves
  const removeUser = (remoteId) => {
    if (!remoteId) return;

    if (peersRef.current[remoteId]) {
      peersRef.current[remoteId].close();
      delete peersRef.current[remoteId];
    }

    setRemoteStreams((prev) => {
      const updated = { ...prev };
      delete updated[remoteId];
      return updated;
    });
  };

  // ✅ cleanup
  useEffect(() => {
    return () => {
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  return { localStreamRef, remoteStreams, callUser, removeUser };
}
