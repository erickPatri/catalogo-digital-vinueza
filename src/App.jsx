import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { AdminPage } from './pages/AdminPage'
import { useProducts } from './hooks/useProducts'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ isAuthenticated, loading, children }) {
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/admin" replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-tactical-600 border-t-accent" />
        <p className="text-sm text-tactical-400">Cargando...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { products, visibleProducts, addProduct, updateProduct, deleteProduct, toggleVisibility, loading: productsLoading } = useProducts()
  const { isAuthenticated, login, logout, loading: authLoading } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              productsLoading
                ? <LoadingScreen />
                : <CatalogPage visibleProducts={visibleProducts} />
            }
          />
          <Route
            path="/admin"
            element={
              authLoading
                ? <LoadingScreen />
                : isAuthenticated
                  ? <Navigate to="/admin/dashboard" replace />
                  : <LoginPage login={login} />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={authLoading}>
                {productsLoading
                  ? <LoadingScreen />
                  : <AdminPage
                      products={products}
                      addProduct={addProduct}
                      updateProduct={updateProduct}
                      deleteProduct={deleteProduct}
                      toggleVisibility={toggleVisibility}
                      logout={logout}
                    />
                }
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}
