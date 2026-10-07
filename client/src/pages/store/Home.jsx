import { useEffect, useState } from "react";
import { publicApi } from "../../api/public.api.js";
import HeroCarousel from "../../components/store/HeroCarousel.jsx";
import CategoryPill from "../../components/store/CategoryPill.jsx";
import ProductCard from "../../components/store/ProductCard.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicApi.getBanners(),
      publicApi.getCategories(),
      publicApi.getProducts({ featured: true, limit: 8 }),
    ])
      .then(([b, c, p]) => {
        setBanners(b);
        setCategories(c);
        setFeatured(p.products);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <HeroCarousel banners={banners} />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-5 font-display text-xl font-semibold sm:text-2xl">Shop by Category</h2>
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <CategoryPill key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-5 font-display text-xl font-semibold sm:text-2xl">Featured Picks</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-sm text-ink-soft">No featured products yet — check back soon!</p>
        )}
      </section>
    </div>
  );
}
