import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import DataTable from "../../components/admin/DataTable.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import ImageUrlInput from "../../components/admin/ImageUrlInput.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { formatEGP } from "../../lib/format.js";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  offerPrice: "",
  mainImage: "",
  galleryImages: "",
  categoryId: "",
  inStock: true,
  featured: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    Promise.all([adminApi.getProducts({ limit: 100 }), adminApi.getCategories()])
      .then(([p, c]) => {
        setProducts(p.products);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      title: product.title,
      description: product.description || "",
      price: product.price,
      offerPrice: product.offerPrice || "",
      mainImage: product.mainImage,
      galleryImages: (product.galleryImages || []).join(", "),
      categoryId: product.categoryId,
      inStock: product.inStock,
      featured: product.featured,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      offerPrice: form.offerPrice ? Number(form.offerPrice) : null,
      galleryImages: form.galleryImages
        ? form.galleryImages.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editing) {
        await adminApi.updateProduct(editing.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  async function handleDelete() {
    await adminApi.deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <Button onClick={openCreate}><Plus size={16} /> New Product</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={[
            { key: "mainImage", label: "", render: (r) => <img src={r.mainImage} alt="" className="h-10 w-10 rounded-lg object-cover" /> },
            { key: "title", label: "Title" },
            { key: "category", label: "Category", render: (r) => r.category?.name },
            { key: "price", label: "Price", render: (r) => formatEGP(r.offerPrice || r.price) },
            { key: "inStock", label: "Stock", render: (r) => <Badge tone={r.inStock ? "green" : "red"}>{r.inStock ? "In Stock" : "Out of Stock"}</Badge> },
            { key: "featured", label: "Featured", render: (r) => r.featured ? <Badge tone="gold">Featured</Badge> : "—" },
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
          rows={products}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "New Product"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <Input label="Price (EGP)" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
          <Input label="Offer Price (EGP, optional)" type="number" step="0.01" value={form.offerPrice} onChange={(e) => setForm((f) => ({ ...f, offerPrice: e.target.value }))} />
          <Select label="Category" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
              Featured
            </label>
          </div>
          <div className="sm:col-span-2">
            <ImageUrlInput label="Main Image URL" value={form.mainImage} onChange={(e) => setForm((f) => ({ ...f, mainImage: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Gallery Image URLs (comma-separated)"
              value={form.galleryImages}
              onChange={(e) => setForm((f) => ({ ...f, galleryImages: e.target.value }))}
              placeholder="https://... , https://..."
            />
          </div>
          {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
          <Button type="submit" className="sm:col-span-2 w-full">{editing ? "Save Changes" : "Create Product"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete product?"
        description={`This will permanently delete "${deleteTarget?.title}".`}
      />
    </div>
  );
}
