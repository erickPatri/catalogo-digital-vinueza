import { useState } from 'react'
import { CONFIG } from '../config'
import { Modal } from './Modal'

export function ProductCard({ product, index = 0 }) {
  const [isImageOpen, setIsImageOpen] = useState(false)
  
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage(product.name))}`

  const formattedPrice = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <>
      <article
        className="group flex flex-col overflow-hidden rounded-md border border-border bg-surface-raised transition-all duration-300 hover:border-border-hover hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-tactical-900">
          {product.image ? (
            <button 
              onClick={() => setIsImageOpen(true)}
              className="h-full w-full cursor-pointer border-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Ver imagen de ${product.name}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-tactical-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-2 left-2 rounded-sm bg-surface-base/80 px-2 py-1 text-[11px] font-medium tracking-wide text-tactical-200 backdrop-blur-sm uppercase pointer-events-none">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="text-[15px] font-semibold leading-snug text-tactical-50 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[13px] leading-relaxed text-tactical-300 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <span className="tabular-nums text-lg font-bold text-accent-light tracking-tight">
              {formattedPrice}
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] rounded-md bg-accent px-3 py-[7px] text-[13px] font-medium text-white no-underline transition-all duration-200 hover:bg-accent-light active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar
            </a>
          </div>
        </div>
      </article>

      <Modal 
        isOpen={isImageOpen} 
        onClose={() => setIsImageOpen(false)} 
        title={product.name}
      >
        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="flex items-center justify-center bg-tactical-900 overflow-hidden rounded-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          </div>

          {/* Product details */}
          <div className="flex flex-col gap-3">
            {/* Category + Price row */}
            <div className="flex items-center justify-between">
              <span className="rounded-sm bg-tactical-800 px-2 py-1 text-[11px] font-medium tracking-wide text-tactical-300 uppercase">
                {product.category}
              </span>
              <span className="tabular-nums text-lg font-bold text-accent-light tracking-tight">
                {formattedPrice}
              </span>
            </div>

            {/* Full description */}
            {product.description && (
              <p className="text-[13px] leading-relaxed text-tactical-300 whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-[10px] text-[13px] font-medium text-white no-underline transition-all duration-200 hover:bg-accent-light active:scale-[0.97]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar
            </a>
          </div>
        </div>
      </Modal>
    </>
  )
}
