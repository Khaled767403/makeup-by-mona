import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="h-72 w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-nude/40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#f0e6e0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#6b5f5a" />
          <YAxis tick={{ fontSize: 11 }} stroke="#6b5f5a" />
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} EGP`, "Sales"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e8d5c4" }}
          />
          <Line type="monotone" dataKey="total" stroke="#b76e79" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
