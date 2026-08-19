import { useState, useMemo } from 'react'
import { ProductCard } from '../components/ProductCard'
import { SearchBar } from '../components/SearchBar'
import { CategoryFilter } from '../components/CategoryFilter'
import { CONFIG } from '../config'

export function CatalogPage({ visibleProducts }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredProducts = useMemo(() => {
    let results = visibleProducts

    if (activeCategory !== 'Todos') {
      results = results.filter((product) => product.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    return results
  }, [visibleProducts, activeCategory, searchQuery])

  const hasProducts = visibleProducts.length > 0
  const hasResults = filteredProducts.length > 0

  return (
    <main className="min-h-screen pt-16">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-tactical-850/40 to-surface-base" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Equipamiento táctico &amp; seguridad
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-tactical-50 sm:text-4xl lg:text-5xl">
              {CONFIG.businessName}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-tactical-300 sm:text-lg">
              Explora nuestro catálogo de productos tácticos, equipamiento de seguridad y accesorios para actividades al aire libre.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      {hasProducts && (
        <section className="sticky top-16 z-40 border-b border-border bg-surface-base/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </section>
      )}

      {/* ── Product Grid ── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {hasResults ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : hasProducts ? (
          /* No search results */
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-tactical-800 text-tactical-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-tactical-200">
              Sin resultados
            </h3>
            <p className="mt-2 max-w-xs text-sm text-tactical-400">
              No se encontraron productos que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
          </div>
        ) : (
          /* No products at all */
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-tactical-800 text-tactical-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-tactical-200">
              Catálogo en preparación
            </h3>
            <p className="mt-2 max-w-xs text-sm text-tactical-400">
              Estamos preparando nuestro catálogo de productos. Vuelve pronto o contáctanos directamente por WhatsApp.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
