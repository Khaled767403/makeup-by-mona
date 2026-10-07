import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { formatEGP } from "../../lib/format.js";
import Button from "../ui/Button.jsx";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-cream shadow-xl">
        <div className="flex items-center justify-between border-b border-nude/60 px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Your Cart</h2>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-blush">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-soft">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <button onClick={() => removeItem(item.id)} className="text-ink-soft hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-nude px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-rosegold-dark">
                        {formatEGP(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-nude/60 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-semibold">{formatEGP(subtotal)}</span>
            </div>
            <p className="mb-3 text-xs text-ink-soft">Delivery fee is calculated at checkout.</p>
            <Button
              as={Link}
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
