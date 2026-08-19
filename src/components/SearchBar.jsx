export function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-sm">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-400 pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos..."
        className="h-10 w-full rounded-md border border-border bg-surface-input pl-8 pr-3 text-sm text-tactical-50 placeholder:text-tactical-500 transition-colors duration-200 focus:border-border-focus focus:outline-none"
      />
    </div>
  )
}
