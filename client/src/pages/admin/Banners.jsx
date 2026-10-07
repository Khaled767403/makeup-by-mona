import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ImageUrlInput from "../../components/admin/ImageUrlInput.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

const emptyForm = { imageUrl: "", headline: "", subtitle: "", ctaLink: "", isActive: true, sortOrder: 0 };

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    adminApi.getBanners().then(setBanners).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(banner) {
    setEditing(banner);
    setForm({ ...banner, subtitle: banner.subtitle || "", ctaLink: banner.ctaLink || "" });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      if (editing) await adminApi.updateBanner(editing.id, payload);
      else await adminApi.createBanner(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  async function handleDelete() {
    await adminApi.deleteBanner(deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Banners</h1>
        <Button onClick={openCreate}><Plus size={16} /> New Banner</Button>
      </div>

      {loading ? <Spinner /> : (
        <DataTable
          columns={[
            { key: "imageUrl", label: "", render: (r) => <img src={r.imageUrl} alt="" className="h-10 w-16 rounded-lg object-cover" /> },
            { key: "headline", label: "Headline" },
            { key: "sortOrder", label: "Order" },
            { key: "isActive", label: "Status", render: (r) => <Badge tone={r.isActive ? "green" : "gray"}>{r.isActive ? "Active" : "Inactive"}</Badge> },
            {
              key: "actions", label: "", render: (r) => (
                <div className="flex gap-2">
                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 hover:bg-blush"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                </div>
              ),
            },
          ]}
          rows={banners}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Banner" : "New Banner"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUrlInput label="Banner Image URL" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
          <Input label="Headline" value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} required />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
          <Input label="CTA Link (e.g. /catalog)" value={form.ctaLink} onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))} />
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">{editing ? "Save Changes" : "Create Banner"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete banner?"
        description={`This will permanently delete "${deleteTarget?.headline}".`}
      />
    </div>
  );
}
