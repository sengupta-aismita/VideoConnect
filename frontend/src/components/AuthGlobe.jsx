import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export default function AuthGlobe() {
  const globeEl = useRef();

  useEffect(() => {
    if (!globeEl.current) return;

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = false;
    controls.enablePan = false;
  }, []);

  return (
    <div className="h-[360px] w-[360px]">
      <Globe
        ref={globeEl}
        width={360}
        height={360}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="rgba(168,85,247,0.7)"
        atmosphereAltitude={0.25}
      />
    </div>
  );
}
