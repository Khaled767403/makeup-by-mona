import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApi } from "../../api/public.api.js";
import { useCart } from "../../context/CartContext.jsx";
import { formatEGP } from "../../lib/format.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import { Minus, Plus, ShoppingBag } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    publicApi
      .getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
        setQuantity(1);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="mb-4 text-ink-soft">Product not found.</p>
        <Link to="/catalog" className="text-rosegold underline">Back to catalog</Link>
      </div>
    );
  }

  const images = [product.mainImage, ...(product.galleryImages || [])];
  const hasOffer = product.offerPrice && Number(product.offerPrice) < Number(product.price);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-blush/30">
            <img src={images[activeImage]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg ring-2 ${i === activeImage ? "ring-rosegold" : "ring-transparent"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rosegold">
            {product.category?.name}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{product.title}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-rosegold-dark">
              {formatEGP(hasOffer ? product.offerPrice : product.price)}
            </span>
            {hasOffer && (
              <span className="text-base text-ink-soft/60 line-through">{formatEGP(product.price)}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-nude px-3 py-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span className="w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}><Plus size={16} /></button>
            </div>
            <Button
              disabled={!product.inStock}
              onClick={() => addItem(product, quantity)}
              className="flex-1"
            >
              <ShoppingBag size={16} />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
