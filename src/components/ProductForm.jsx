import { useState, useRef } from 'react'
import { CONFIG } from '../config'

export function ProductForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [price, setPrice] = useState(initialData?.price ?? '')
  const [category, setCategory] = useState(initialData?.category ?? CONFIG.categories[0])
  const [visible, setVisible] = useState(initialData?.visible ?? true)
  const [imagePreview, setImagePreview] = useState(initialData?.image ?? '')
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const isEditing = Boolean(initialData)

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !price || parseFloat(price) <= 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price,
        category,
        imageFile,
        image: imagePreview,
        visible,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClasses =
    'w-full rounded-md border border-border bg-surface-input px-3 py-[9px] text-sm text-tactical-50 placeholder:text-tactical-500 transition-colors duration-200 focus:border-border-focus focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-[6px]">
        <label htmlFor="product-name" className="text-[13px] font-medium text-tactical-200">
          Nombre del producto <span className="text-danger">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Navaja táctica Smith & Wesson"
          className={inputBaseClasses}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-[6px]">
        <label htmlFor="product-description" className="text-[13px] font-medium text-tactical-200">
          Descripción
        </label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción breve del producto..."
          rows={3}
          className={`${inputBaseClasses} resize-none`}
        />
      </div>

      {/* Price + Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="product-price" className="text-[13px] font-medium text-tactical-200">
            Precio (USD) <span className="text-danger">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className={inputBaseClasses}
            required
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label htmlFor="product-category" className="text-[13px] font-medium text-tactical-200">
            Categoría
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputBaseClasses} cursor-pointer appearance-none`}
          >
            {CONFIG.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image */}
      <div className="flex flex-col gap-[6px]">
        <label className="text-[13px] font-medium text-tactical-200">
          Imagen del producto
        </label>

        {imagePreview ? (
          <div className="relative overflow-hidden rounded-md border border-border">
            <img
              src={imagePreview}
              alt="Preview"
              className="aspect-[4/3] w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md bg-surface-base/80 text-tactical-300 backdrop-blur-sm transition-colors duration-150 hover:bg-danger hover:text-white cursor-pointer"
              aria-label="Eliminar imagen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-tactical-600 bg-surface-input text-tactical-400 transition-colors duration-200 hover:border-tactical-500 hover:text-tactical-300 cursor-pointer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[13px] font-medium">Subir imagen</span>
            <span className="text-[11px] text-tactical-500">JPG, PNG o WebP</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Visibility toggle */}
      <div className="flex items-center justify-between rounded-md border border-border bg-surface-input px-3 py-[10px]">
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-tactical-200">
            Visible en catálogo
          </span>
          <span className="text-[11px] text-tactical-400">
            {visible ? 'Los clientes pueden ver este producto' : 'Oculto para los clientes'}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={visible}
          onClick={() => setVisible(!visible)}
          className={`
            relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer
            ${visible ? 'bg-accent' : 'bg-tactical-600'}
          `}
        >
          <span
            className={`
              absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200
              ${visible ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-[9px] text-[13px] font-medium text-tactical-300 transition-colors duration-200 hover:bg-tactical-800 hover:text-tactical-200 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !price}
          className="rounded-md bg-accent px-4 py-[9px] text-[13px] font-medium text-white transition-all duration-200 hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
