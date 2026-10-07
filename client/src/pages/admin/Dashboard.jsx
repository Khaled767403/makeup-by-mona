import { useEffect, useState } from "react";
import { adminApi } from "../../api/admin.api.js";
import StatCard from "../../components/admin/StatCard.jsx";
import SalesChart from "../../components/admin/SalesChart.jsx";
import CategoryBarChart from "../../components/admin/CategoryBarChart.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Select from "../../components/ui/Select.jsx";
import Input from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { formatEGP } from "../../lib/format.js";

const RANGE_OPTIONS = [
  { value: "daily", label: "Last 30 Days" },
  { value: "monthly", label: "Last 12 Months" },
  { value: "yearly", label: "Last 5 Years" },
  { value: "custom", label: "Custom Range" },
];

export default function Dashboard() {
  const [range, setRange] = useState("daily");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = { range };
    if (range === "custom") {
      if (!customFrom || !customTo) return;
      params.from = customFrom;
      params.to = customTo;
    }

    setLoading(true);
    Promise.all([
      adminApi.getOverview(params),
      adminApi.getSalesTrend(params),
      adminApi.getTopProducts({ ...params, limit: 5 }),
      adminApi.getTopCategories(params),
    ])
      .then(([o, t, tp, tc]) => {
        setOverview(o);
        setTrend(t);
        setTopProducts(tp);
        setTopCategories(tc);
      })
      .finally(() => setLoading(false));
  }, [range, customFrom, customTo]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-auto">
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          {range === "custom" && (
            <>
              <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </>
          )}
        </div>
      </div>

      {loading || !overview ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Revenue" value={overview.revenue.value} changePct={overview.revenue.changePct} suffix=" EGP" />
            <StatCard label="Orders" value={overview.orders.value} changePct={overview.orders.changePct} />
            <StatCard label="Avg. Order Value" value={overview.avgOrderValue.value} changePct={overview.avgOrderValue.changePct} suffix=" EGP" />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-ink-soft">Sales Trend</h2>
              <SalesChart data={trend} />
            </div>
            <div>
              <h2 className="mb-3 text-sm font-semibold text-ink-soft">Revenue by Category</h2>
              <CategoryBarChart data={topCategories} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-ink-soft">Best-Selling Products</h2>
            <DataTable
              columns={[
                { key: "title", label: "Product" },
                { key: "quantity", label: "Units Sold" },
                { key: "revenue", label: "Revenue", render: (r) => formatEGP(r.revenue) },
              ]}
              rows={topProducts}
              emptyMessage="No sales in this period yet."
            />
          </div>
        </>
      )}
    </div>
  );
}
