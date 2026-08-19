import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Al montar, verificar si ya existe una sesión activa
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoading(false)
    }

    checkSession()

    // Escuchar cambios de sesión (login, logout, expiración de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error de autenticación:', error.message)
      return false
    }

    return true
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout, loading }
}
