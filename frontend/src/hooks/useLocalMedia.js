import { useEffect, useRef, useState } from "react";

export default function useLocalMedia({ camOn, micOn }) {
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (streamRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: camOn,   // start camera only if camOn true
          audio: true,
        });

        stream.getAudioTracks().forEach((t) => (t.enabled = micOn));

        streamRef.current = stream;
        setReady(true);
      } catch (e) {
        console.log("getUserMedia error:", e);
      }
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  // ✅ camera on/off with real hardware release
  useEffect(() => {
    const toggleCam = async () => {
      const stream = streamRef.current;
      if (!stream) return;

      if (!camOn) {
        stream.getVideoTracks().forEach((t) => {
          t.stop();
          stream.removeTrack(t);
        });
        return;
      }

      if (stream.getVideoTracks().length > 0) return;

      try {
        const camStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        const videoTrack = camStream.getVideoTracks()[0];
        stream.addTrack(videoTrack);
      } catch (e) {
        console.log("camera restart failed:", e);
      }
    };

    toggleCam();
  }, [camOn]);

  return { streamRef, ready };
}
