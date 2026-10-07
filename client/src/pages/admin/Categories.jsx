import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Button from "../../components/ui/Button.jsx";
import ImageUrlInput from "../../components/admin/ImageUrlInput.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

const emptyForm = { name: "", description: "", imageUrl: "" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    adminApi.getCategories().then(setCategories).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", imageUrl: cat.imageUrl || "" });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await adminApi.updateCategory(editing.id, form);
      } else {
        await adminApi.createCategory(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  async function handleDelete() {
    try {
      await adminApi.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Categories</h1>
        <Button onClick={openCreate}><Plus size={16} /> New Category</Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={[
            {
              key: "imageUrl",
              label: "",
              render: (r) => r.imageUrl && <img src={r.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />,
            },
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "products", label: "Products", render: (r) => r._count?.products ?? 0 },
            {
              key: "actions",
              label: "",
              render: (r) => (
                <div className="flex gap-2">
                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 hover:bg-blush"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                </div>
              ),
            },
          ]}
          rows={categories}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <ImageUrlInput label="Image URL" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">{editing ? "Save Changes" : "Create Category"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete category?"
        description={`This will permanently delete "${deleteTarget?.name}". Products must be moved first.`}
      />
    </div>
  );
}
