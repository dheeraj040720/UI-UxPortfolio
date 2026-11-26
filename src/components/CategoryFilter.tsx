interface CategoryFilterProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = active === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? 'border border-accent bg-accent-soft text-accent'
                : 'border border-line bg-surface text-slate hover:bg-subtle hover:text-ink'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
