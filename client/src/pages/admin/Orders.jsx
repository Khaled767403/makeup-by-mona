import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Select from "../../components/ui/Select.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { formatEGP, formatDate } from "../../lib/format.js";

const STATUS_TONES = {
  PENDING: "gold",
  CONFIRMED: "rose",
  SHIPPED: "rose",
  DELIVERED: "green",
  CANCELLED: "red",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);

  function load() {
    setLoading(true);
    adminApi.getOrders({ status: statusFilter || undefined, limit: 100 })
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  async function handleStatusChange(id, status) {
    await adminApi.updateOrderStatus(id, status);
    load();
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-auto">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_TONES).map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {loading ? <Spinner /> : (
        <DataTable
          columns={[
            { key: "customerName", label: "Customer" },
            { key: "phone", label: "Phone" },
            { key: "grandTotal", label: "Total", render: (r) => formatEGP(r.grandTotal) },
            { key: "status", label: "Status", render: (r) => <Badge tone={STATUS_TONES[r.status]}>{r.status}</Badge> },
            { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
            {
              key: "actions", label: "", render: (r) => (
                <button onClick={() => setSelected(r)} className="rounded-lg p-1.5 hover:bg-blush"><Eye size={16} /></button>
              ),
            },
          ]}
          rows={orders}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Order Details" maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">{selected.customerName}</p>
              <p className="text-ink-soft">{selected.phone}</p>
              <p className="text-ink-soft">{selected.governorate} — {selected.address}</p>
              {selected.notes && <p className="text-ink-soft italic">Note: {selected.notes}</p>}
            </div>
            <ul className="divide-y divide-nude/60 rounded-xl border border-nude/60">
              {selected.items.map((item) => (
                <li key={item.id} className="flex justify-between px-3 py-2">
                  <span>{item.titleSnapshot} x{item.quantity}</span>
                  <span>{formatEGP(Number(item.priceSnapshot) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 rounded-xl bg-blush/40 p-3">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatEGP(selected.itemsTotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatEGP(selected.shippingFee)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatEGP(selected.grandTotal)}</span></div>
            </div>
            <Select
              label="Order Status"
              value={selected.status}
              onChange={(e) => handleStatusChange(selected.id, e.target.value)}
            >
              {Object.keys(STATUS_TONES).map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
}
