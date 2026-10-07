import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../../api/public.api.js";
import ProductCard from "../../components/store/ProductCard.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import { Search } from "lucide-react";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    publicApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    publicApi
      .getProducts({
        categorySlug: category || undefined,
        search: search || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        limit: 48,
      })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [category, search, minPrice, maxPrice]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold">Shop All</h1>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={16} />
          <Input
            placeholder="Search products..."
            defaultValue={search}
            className="pl-9"
            onChange={(e) => updateParam("search", e.target.value)}
          />
        </div>
        <Select value={category} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min EGP"
            defaultValue={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max EGP"
            defaultValue={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-soft">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
