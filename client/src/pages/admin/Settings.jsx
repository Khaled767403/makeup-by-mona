import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { adminApi } from "../../api/admin.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { detectPlatform, linkKey, normalizeUrl } from "../../lib/social.js";

// The API answers validation problems as { message, errors: { field: [text] } };
// show the specific text when there is one.
function apiError(err, fallback) {
  const fieldErrors = err.response?.data?.errors;
  const first = fieldErrors && Object.values(fieldErrors).flat()[0];
  return first || err.response?.data?.message || fallback;
}

export default function Settings() {
  const { admin } = useAuth();
  const [loadingStore, setLoadingStore] = useState(true);

  // --- WhatsApp number ---
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [storeMessage, setStoreMessage] = useState("");
  const [storeError, setStoreError] = useState("");
  const [storeLoading, setStoreLoading] = useState(false);

  // --- Social media links ---
  const [socialLinks, setSocialLinks] = useState([]);
  const [linkInput, setLinkInput] = useState("");
  const [socialDirty, setSocialDirty] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const [socialError, setSocialError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  useEffect(() => {
    adminApi
      .getStoreSettings()
      .then((data) => {
        setWhatsappNumber(data.whatsappNumber || "");
        setSocialLinks(data.socialLinks || []);
      })
      .finally(() => setLoadingStore(false));
  }, []);

  async function handleStoreSubmit(e) {
    e.preventDefault();
    setStoreError("");
    setStoreMessage("");
    setStoreLoading(true);
    try {
      await adminApi.updateStoreSettings({ whatsappNumber });
      setStoreMessage("WhatsApp number updated. New orders and the footer contact icon use it immediately.");
    } catch (err) {
      setStoreError(apiError(err, "Could not update the WhatsApp number."));
    } finally {
      setStoreLoading(false);
    }
  }

  // Live preview of which platform the typed link belongs to
  const typedUrl = normalizeUrl(linkInput);
  const detected = typedUrl ? detectPlatform(typedUrl) : null;

  function addLink() {
    setSocialError("");
    setSocialMessage("");
    const url = normalizeUrl(linkInput);
    if (!url) {
      setSocialError("Enter a valid link, e.g. https://instagram.com/yourpage");
      return;
    }
    if (socialLinks.some((u) => linkKey(u) === linkKey(url))) {
      setSocialError("This link is already in the list.");
      return;
    }
    if (socialLinks.length >= 10) {
      setSocialError("You can add up to 10 links.");
      return;
    }
    setSocialLinks((list) => [...list, url]);
    setLinkInput("");
    setSocialDirty(true);
  }

  function removeLink(url) {
    setSocialLinks((list) => list.filter((u) => u !== url));
    setSocialMessage("");
    setSocialDirty(true);
  }

  async function handleSocialSubmit(e) {
    e.preventDefault();
    setSocialError("");
    setSocialMessage("");
    setSocialLoading(true);
    try {
      const saved = await adminApi.updateStoreSettings({ socialLinks });
      setSocialLinks(saved.socialLinks || []);
      setSocialDirty(false);
      setSocialMessage("Social links saved. They now appear in the store footer.");
    } catch (err) {
      setSocialError(apiError(err, "Could not save the social links."));
    } finally {
      setSocialLoading(false);
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
      setError(apiError(err, "Could not update settings."));
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
            label="WhatsApp Number (orders & contact)"
            placeholder="201234567890"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
            disabled={loadingStore}
            required
          />
          <p className="text-xs text-ink-soft">
            Digits only, country code first, no "+" and no spaces — e.g. an Egyptian number is <code>201234567890</code>.
            This number receives the orders and also shows as the WhatsApp icon in the footer.
          </p>
          {storeMessage && <p className="text-sm text-green-600">{storeMessage}</p>}
          {storeError && <p className="text-sm text-red-500">{storeError}</p>}
          <Button type="submit" disabled={storeLoading || loadingStore} className="w-full">
            {storeLoading ? "Saving..." : "Save WhatsApp Number"}
          </Button>
        </form>
      </div>

      <div>
        <h1 className="mb-6 font-display text-2xl font-semibold">Social Media</h1>
        <form onSubmit={handleSocialSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-nude/40">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Add a link to your page"
                placeholder="https://instagram.com/yourpage"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLink();
                  }
                }}
                disabled={loadingStore}
              />
            </div>
            <Button type="button" variant="outline" onClick={addLink} disabled={loadingStore || !linkInput.trim()}>
              Add
            </Button>
          </div>

          {detected && (
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <detected.icon size={14} className="text-rosegold-dark" />
              Detected: <span className="font-medium text-ink">{detected.label}</span>
            </p>
          )}

          {socialLinks.length > 0 ? (
            <ul className="space-y-2">
              {socialLinks.map((url) => {
                const platform = detectPlatform(url);
                return (
                  <li key={url} className="flex items-center gap-3 rounded-xl border border-nude/60 px-3 py-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-rosegold-dark">
                      <platform.icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{platform.label}</p>
                      <p className="truncate text-xs text-ink-soft">{url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(url)}
                      aria-label={`Remove ${platform.label}`}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            !loadingStore && <p className="text-sm text-ink-soft">No social links yet.</p>
          )}

          <p className="text-xs text-ink-soft">
            Paste a link from any platform (Instagram, Facebook, TikTok, YouTube, Snapchat, X…). The store footer
            shows each one with its own icon automatically.
          </p>

          {socialDirty && <p className="text-sm text-amber-600">Unsaved changes — press Save to publish them.</p>}
          {socialMessage && <p className="text-sm text-green-600">{socialMessage}</p>}
          {socialError && <p className="text-sm text-red-500">{socialError}</p>}
          <Button type="submit" disabled={socialLoading || loadingStore || !socialDirty} className="w-full">
            {socialLoading ? "Saving..." : "Save Social Links"}
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
