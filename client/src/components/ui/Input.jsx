export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>}
      <input
        className={`w-full rounded-xl border border-nude bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-rosegold focus:outline-none focus:ring-1 focus:ring-rosegold ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
