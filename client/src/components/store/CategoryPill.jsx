import { Link } from "react-router-dom";

export default function CategoryPill({ category }) {
  return (
    <Link
      to={`/catalog?category=${category.slug}`}
      className="group flex min-w-[110px] flex-col items-center gap-2 text-center"
    >
      <div className="h-20 w-20 overflow-hidden rounded-full bg-blush ring-1 ring-nude/50 transition-transform group-hover:scale-105 sm:h-24 sm:w-24">
        {category.imageUrl && (
          <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
        )}
      </div>
      <span className="text-xs font-medium text-ink sm:text-sm">{category.name}</span>
    </Link>
  );
}
