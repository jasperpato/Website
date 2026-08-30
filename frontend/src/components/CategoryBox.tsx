import { Category } from "../api";

interface CategoryProps {
  category: Category
}

export default function CategoryBox({ category }: CategoryProps) {
  if (!category) return <span className="text-muted">—</span>;
  return (
    <span className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: category.color }} />
      {category.name}
    </span>
  );
}
