import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CategoryBarChart({ data }) {
  return (
    <div className="h-72 w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-nude/40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#f0e6e0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b5f5a" />
          <YAxis tick={{ fontSize: 11 }} stroke="#6b5f5a" />
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} EGP`, "Revenue"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e8d5c4" }}
          />
          <Bar dataKey="revenue" fill="#b76e79" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
