export default function Notice({ notice, onClose }) {
  if (!notice?.msg) return null;

  const isError = notice.type === "error";

  return (
    <div
      className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium flex items-start justify-between gap-4
      ${isError
        ? "border-red-500/30 bg-red-500/10 text-red-200"
        : "border-green-500/30 bg-green-500/10 text-green-200"
      }`}
    >
      <span>{notice.msg}</span>

      <button
        type="button"
        onClick={onClose}
        className="text-xs opacity-80 hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  );
}
