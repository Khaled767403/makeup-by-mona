export default function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>}
      <select
        className={`w-full rounded-xl border border-nude bg-white px-4 py-2.5 text-sm text-ink focus:border-rosegold focus:outline-none focus:ring-1 focus:ring-rosegold ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
