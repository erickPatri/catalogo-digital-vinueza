export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Eliminar', onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-lg border border-border bg-surface-overlay/95 p-6 shadow-2xl backdrop-blur-xl animate-scale-in"
      >
        <h3 className="text-base font-semibold text-tactical-50">
          {title}
        </h3>
        <p className="mt-2 text-sm text-tactical-300 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-[8px] text-[13px] font-medium text-tactical-300 transition-colors duration-200 hover:bg-tactical-800 hover:text-tactical-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-danger px-4 py-[8px] text-[13px] font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
