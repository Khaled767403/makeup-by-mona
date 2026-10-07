import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { formatEGP } from "../../lib/format.js";
import Button from "../../components/ui/Button.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="mb-4 text-ink-soft">Your cart is empty.</p>
        <Button as={Link} to="/catalog">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold">Your Cart</h1>
      <ul className="divide-y divide-nude/60 rounded-2xl bg-white ring-1 ring-nude/40">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-4">
            <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-ink-soft">{formatEGP(item.price)} each</p>
              <div className="mt-2 flex items-center gap-3 rounded-full border border-nude px-3 py-1.5 w-fit">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="font-semibold text-rosegold-dark">{formatEGP(item.price * item.quantity)}</span>
              <button onClick={() => removeItem(item.id)} className="text-ink-soft hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-blush/50 px-5 py-4">
        <span className="text-sm text-ink-soft">Subtotal (delivery calculated at checkout)</span>
        <span className="text-lg font-bold">{formatEGP(subtotal)}</span>
      </div>

      <Button as={Link} to="/checkout" className="mt-6 w-full">Proceed to Checkout</Button>
    </div>
  );
}
