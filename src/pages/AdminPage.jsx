import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { ProductForm } from '../components/ProductForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { SearchBar } from '../components/SearchBar'

export function AdminPage({ products, addProduct, updateProduct, deleteProduct, toggleVisibility, logout }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const stats = useMemo(() => ({
    total: products.length,
    visible: products.filter((p) => p.visible).length,
    hidden: products.filter((p) => !p.visible).length,
  }), [products])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const handleCreate = async (data) => {
    await addProduct(data)
    setIsFormOpen(false)
  }

  const handleUpdate = async (data) => {
    if (!editingProduct) return
    await updateProduct(editingProduct.id, data)
    setEditingProduct(null)
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    await deleteProduct(deletingProduct.id)
    setDeletingProduct(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin', { replace: true })
  }

  const formattedPrice = (price) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(price)

  return (
    <main className="min-h-screen pt-16">
      {/* ── Toolbar ── */}
      <section className="sticky top-16 z-40 border-b border-border bg-surface-base/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-semibold text-tactical-50">Productos</h1>

              {/* Stats */}
              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-md bg-tactical-800 px-2 py-1 text-[11px] font-medium text-tactical-300 tabular-nums">
                  {stats.total} total
                </span>
                <span className="rounded-md bg-accent-dim px-2 py-1 text-[11px] font-medium text-accent tabular-nums">
                  {stats.visible} visibles
                </span>
                {stats.hidden > 0 && (
                  <span className="rounded-md bg-warning-dim px-2 py-1 text-[11px] font-medium text-warning tabular-nums">
                    {stats.hidden} ocultos
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-md bg-accent px-3 py-[8px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.97] cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar
              </button>

              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-[8px] text-[13px] font-medium text-tactical-400 transition-colors duration-200 hover:bg-tactical-800 hover:text-tactical-200 cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product List ── */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-[1px] rounded-lg border border-border bg-border overflow-hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex items-center gap-4 bg-surface-raised px-4 py-3 transition-colors duration-150 hover:bg-tactical-800/50 ${
                  !product.visible ? 'opacity-60' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-tactical-900">
                  {product.image ? (
                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-tactical-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-tactical-50">
                      {product.name}
                    </span>
                    {!product.visible && (
                      <span className="shrink-0 rounded-sm bg-warning-dim px-[6px] py-[1px] text-[10px] font-medium text-warning uppercase tracking-wide">
                        Oculto
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-tactical-400">
                    <span>{product.category}</span>
                    <span>·</span>
                    <span className="font-medium text-accent tabular-nums">{formattedPrice(product.price)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-[2px]">
                  {/* Edit */}
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-tactical-400 transition-colors duration-150 hover:bg-tactical-700 hover:text-tactical-200 cursor-pointer"
                    title="Editar"
                    aria-label={`Editar ${product.name}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>

                  {/* Toggle visibility */}
                  <button
                    onClick={() => toggleVisibility(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-tactical-400 transition-colors duration-150 hover:bg-tactical-700 hover:text-tactical-200 cursor-pointer"
                    title={product.visible ? 'Ocultar' : 'Mostrar'}
                    aria-label={product.visible ? `Ocultar ${product.name}` : `Mostrar ${product.name}`}
                  >
                    {product.visible ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingProduct(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-tactical-400 transition-colors duration-150 hover:bg-danger-dim hover:text-danger cursor-pointer"
                    title="Eliminar"
                    aria-label={`Eliminar ${product.name}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          /* Search produced no results */
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-tactical-800 text-tactical-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-sm text-tactical-400">No se encontraron productos que coincidan.</p>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-tactical-800 text-tactical-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-tactical-200">
              No hay productos aún
            </h3>
            <p className="mt-2 max-w-xs text-sm text-tactical-400">
              Comienza agregando tu primer producto al catálogo.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-6 inline-flex items-center gap-[6px] rounded-md bg-accent px-4 py-[9px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.97] cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar primer producto
            </button>
          </div>
        )}
      </section>

      {/* ── Create Modal ── */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Nuevo producto"
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="Editar producto"
      >
        {editingProduct && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${deletingProduct?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </main>
  )
}
