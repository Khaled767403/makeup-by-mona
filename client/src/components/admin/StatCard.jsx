import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, changePct, prefix = "", suffix = "" }) {
  const isPositive = changePct >= 0;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-nude/40">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
      </p>
      {typeof changePct === "number" && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(changePct)}% vs previous period
        </div>
      )}
    </div>
  );
}
