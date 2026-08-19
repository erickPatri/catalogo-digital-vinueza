import { CONFIG } from '../config'

export function CategoryFilter({ activeCategory, onCategoryChange }) {
  const categories = ['Todos', ...CONFIG.categories]

  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar por categoría">
      {categories.map((category) => {
        const isActive = category === activeCategory
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(category)}
            className={`
              rounded-md px-3 py-[6px] text-[13px] font-medium transition-all duration-200 cursor-pointer border
              ${isActive
                ? 'border-accent bg-accent-dim text-accent-light'
                : 'border-transparent bg-tactical-800 text-tactical-300 hover:bg-tactical-700 hover:text-tactical-200'
              }
            `}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
