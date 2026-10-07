import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { publicApi } from "../../api/public.api.js";
import { openWhatsAppCheckout } from "../../lib/whatsapp.js";
import { formatEGP } from "../../lib/format.js";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [rates, setRates] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    governorate: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    publicApi.getShippingRates().then(setRates);
    publicApi.getStoreConfig().then((config) => setWhatsappNumber(config.whatsappNumber));
  }, []);

  useEffect(() => {
    if (items.length === 0) navigate("/catalog");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedFee = rates.find((r) => r.governorate === form.governorate)?.fee ?? 0;
  const estimatedTotal = subtotal + selectedFee;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.phone || !form.governorate || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await publicApi.createOrder({
        ...form,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      openWhatsAppCheckout(order, whatsappNumber);
      clearCart();
      navigate("/", { state: { orderPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 font-display text-2xl font-semibold">Checkout</h1>
      <p className="mb-6 text-sm text-ink-soft">
        We'll confirm payment (InstaPay, Vodafone Cash, or Card) with you directly on WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full Name *"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone Number *"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Select
          label="Governorate *"
          name="governorate"
          value={form.governorate}
          onChange={handleChange}
          required
        >
          <option value="">Select governorate</option>
          {rates.map((r) => (
            <option key={r.governorate} value={r.governorate}>
              {r.governorate} — {formatEGP(r.fee)} delivery
            </option>
          ))}
        </Select>
        <Input
          label="Full Address *"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Delivery Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="e.g. landmark, preferred delivery time..."
          />
        </div>

        <div className="sm:col-span-2 rounded-2xl bg-blush/50 p-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatEGP(subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>{formatEGP(selectedFee)}</span></div>
          <div className="mt-2 flex justify-between border-t border-nude/60 pt-2 font-bold">
            <span>Estimated Total</span><span>{formatEGP(estimatedTotal)}</span>
          </div>
        </div>

        {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="sm:col-span-2 w-full">
          {submitting ? "Placing Order..." : "Place Order via WhatsApp"}
        </Button>
        <Link to="/cart" className="sm:col-span-2 text-center text-sm text-ink-soft underline">
          Back to cart
        </Link>
      </form>
    </div>
  );
}
