import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;
  const banner = banners[index];

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-blush sm:aspect-[21/9]">
      <img src={banner.imageUrl} alt={banner.headline} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
        <h2 className="font-display text-2xl font-semibold sm:text-4xl">{banner.headline}</h2>
        {banner.subtitle && <p className="mt-1 text-sm text-white/90 sm:text-base">{banner.subtitle}</p>}
        {banner.ctaLink && (
          <Link
            to={banner.ctaLink}
            className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink hover:bg-blush"
          >
            Shop Now
          </Link>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
