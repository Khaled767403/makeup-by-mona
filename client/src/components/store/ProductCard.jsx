import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { formatEGP } from "../../lib/format.js";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasOffer = product.offerPrice && Number(product.offerPrice) < Number(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-nude/40 transition-shadow hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-blush/30">
        <img
          src={product.mainImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {hasOffer && (
          <span className="absolute left-2 top-2 rounded-full bg-rosegold px-2.5 py-1 text-[11px] font-bold text-white">
            OFFER
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-ink">{product.title}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-rosegold-dark">
              {formatEGP(hasOffer ? product.offerPrice : product.price)}
            </span>
            {hasOffer && (
              <span className="text-xs text-ink-soft/60 line-through">{formatEGP(product.price)}</span>
            )}
          </div>
          <button
            disabled={!product.inStock}
            onClick={() => addItem(product, 1)}
            className="rounded-full bg-blush p-2 text-rosegold-dark transition-colors hover:bg-rosegold hover:text-white disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
