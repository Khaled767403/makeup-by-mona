import { useEffect, useState } from "react";
import { adminApi } from "../../api/admin.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Settings() {
  const { admin } = useAuth();

  // --- Store settings (WhatsApp number) ---
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [storeMessage, setStoreMessage] = useState("");
  const [storeError, setStoreError] = useState("");
  const [storeLoading, setStoreLoading] = useState(false);
  const [loadingStore, setLoadingStore] = useState(true);

  useEffect(() => {
    adminApi
      .getStoreSettings()
      .then((data) => setWhatsappNumber(data.whatsappNumber || ""))
      .finally(() => setLoadingStore(false));
  }, []);

  async function handleStoreSubmit(e) {
    e.preventDefault();
    setStoreError("");
    setStoreMessage("");
    setStoreLoading(true);
    try {
      await adminApi.updateStoreSettings({ whatsappNumber });
      setStoreMessage("WhatsApp number updated. New orders will go there immediately.");
    } catch (err) {
      setStoreError(err.response?.data?.message || "Could not update the WhatsApp number.");
    } finally {
      setStoreLoading(false);
    }
  }

  // --- Admin credentials ---
  const [form, setForm] = useState({ username: admin?.username || "", currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await adminApi.updateSettings(form);
      setMessage("Settings updated successfully.");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h1 className="mb-6 font-display text-2xl font-semibold">Store Settings</h1>
        <form onSubmit={handleStoreSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-nude/40">
          <Input
            label="WhatsApp Number (orders go here)"
            placeholder="201234567890"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
            disabled={loadingStore}
            required
          />
          <p className="text-xs text-ink-soft">
            Digits only, country code first, no "+" and no spaces — e.g. an Egyptian number is <code>201234567890</code>.
          </p>
          {storeMessage && <p className="text-sm text-green-600">{storeMessage}</p>}
          {storeError && <p className="text-sm text-red-500">{storeError}</p>}
          <Button type="submit" disabled={storeLoading || loadingStore} className="w-full">
            {storeLoading ? "Saving..." : "Save WhatsApp Number"}
          </Button>
        </form>
      </div>

      <div>
        <h1 className="mb-6 font-display text-2xl font-semibold">Admin Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-nude/40">
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
          <Input
            label="Current Password (required to save)"
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            required
          />
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
