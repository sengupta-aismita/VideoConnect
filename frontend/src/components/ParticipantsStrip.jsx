import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ParticipantsStrip({ others, speaker, setSpeakerId, renderTile }) {
  const stripRef = useRef(null);

  const scrollStrip = (dir) => {
    stripRef.current?.scrollBy({ left: 320 * dir, behavior: "smooth" });
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el || !speaker) return;

    const tile = el.querySelector(`[data-id="${speaker.id}"]`);
    if (!tile) return;

    el.scrollTo({
      left: tile.offsetLeft - el.clientWidth / 2 + tile.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [speaker?.id]);

  return (
    <div className="relative">
      <button
        onClick={() => scrollStrip(-1)}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 border border-white/10 items-center justify-center hover:bg-black/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scrollStrip(1)}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 border border-white/10 items-center justify-center hover:bg-black/60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={stripRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory md:px-12 pb-2 pt-1"
      >
        {others.map((p) => (
          <div key={p.id} data-id={p.id} className="snap-start">
            {renderTile(p, () => setSpeakerId(p.id))}
          </div>
        ))}
      </div>
    </div>
  );
}
