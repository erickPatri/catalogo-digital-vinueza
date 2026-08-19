import { Link, useLocation } from 'react-router-dom'
import { CONFIG } from '../config'
import logo from '../assets/creaciones-vinueza-logo.jpg'

export function Header() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2 no-underline">
          <img 
            src={logo} 
            alt="Creaciones Vinueza Logo" 
            className="h-9 w-9 rounded-md object-contain transition-transform duration-200 group-hover:scale-105" 
          />
          <span className="text-base font-semibold tracking-tight text-tactical-50 transition-colors duration-200 group-hover:text-accent-light">
            {CONFIG.businessName}
          </span>
        </Link>

        <nav className="flex items-center gap-4">


          {isAdmin && (
            <Link
              to="/"
              className="text-sm font-medium text-tactical-400 transition-colors duration-200 hover:text-tactical-200 no-underline"
            >
              ← Ver catálogo
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
