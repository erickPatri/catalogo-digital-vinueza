import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONFIG } from '../config'
import logo from '../assets/creaciones-vinueza-logo.jpg'

export function LoginPage({ login }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div
        className={`w-full max-w-sm animate-fade-in ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
      >
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <img 
            src={logo} 
            alt="Creaciones Vinueza Logo" 
            className="h-16 w-16 rounded-xl object-contain shadow-lg shadow-black/20" 
          />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-tactical-50">
              {CONFIG.businessName}
            </h1>
            <p className="mt-1 text-sm text-tactical-400">
              Panel de administración
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-surface-raised p-6"
        >
          {/* Email */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="admin-email" className="text-[13px] font-medium text-tactical-200">
              Correo electrónico
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="tu@correo.com"
              autoFocus
              required
              className={`
                w-full rounded-md border bg-surface-input px-3 py-[10px] text-sm text-tactical-50 placeholder:text-tactical-500 transition-colors duration-200 focus:outline-none
                ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-border-focus'}
              `}
            />
          </div>

          {/* Password */}
          <div className="mt-4 flex flex-col gap-[6px]">
            <label htmlFor="admin-password" className="text-[13px] font-medium text-tactical-200">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Ingresa tu contraseña"
              required
              className={`
                w-full rounded-md border bg-surface-input px-3 py-[10px] text-sm text-tactical-50 placeholder:text-tactical-500 transition-colors duration-200 focus:outline-none
                ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-border-focus'}
              `}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-3 text-[12px] text-danger animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-md bg-accent py-[10px] text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}
