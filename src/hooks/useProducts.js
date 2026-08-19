import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'

/**
 * Sube una imagen al bucket de Supabase Storage y retorna su URL pública.
 * Si no hay archivo, retorna cadena vacía.
 */
async function uploadImage(file) {
  if (!file) return ''

  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error al subir imagen:', error)
    throw new Error('No se pudo subir la imagen. Intenta de nuevo.')
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Elimina una imagen del bucket de Supabase Storage usando su URL pública.
 */
async function deleteImage(imageUrl) {
  if (!imageUrl) return

  try {
    const url = new URL(imageUrl)
    // El path dentro del bucket está después de /object/public/product-images/
    const bucketPath = url.pathname.split('/object/public/product-images/')[1]
    if (bucketPath) {
      await supabase.storage.from('product-images').remove([bucketPath])
    }
  } catch {
    // Si falla el borrado de imagen, no bloqueamos la operación
    console.warn('No se pudo eliminar la imagen del storage:', imageUrl)
  }
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos desde Supabase al montar
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error al cargar productos:', fetchError)
        setError('No se pudieron cargar los productos.')
        setProducts([])
      } else {
        // Mapear image_url de Supabase a image para compatibilidad con los componentes
        setProducts(
          data.map((p) => ({
            ...p,
            image: p.image_url || '',
          }))
        )
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  const visibleProducts = useMemo(
    () => products.filter((product) => product.visible),
    [products]
  )

  const addProduct = useCallback(async ({ name, description, price, category, imageFile, visible }) => {
    const imageUrl = await uploadImage(imageFile)

    const newProduct = {
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      image_url: imageUrl,
      visible: visible ?? true,
    }

    const { data, error: insertError } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single()

    if (insertError) {
      console.error('Error al crear producto:', insertError)
      throw new Error('No se pudo crear el producto. Verifica tu sesión.')
    }

    const mapped = { ...data, image: data.image_url || '' }
    setProducts((prev) => [mapped, ...prev])
    return mapped
  }, [])

  const updateProduct = useCallback(async (id, { name, description, price, category, imageFile, image: existingImage, visible }) => {
    let imageUrl = existingImage || ''

    // Si hay un nuevo archivo, subir la nueva imagen
    if (imageFile) {
      // Intentar borrar la imagen anterior si existe
      const currentProduct = products?.find((p) => p.id === id)
      if (currentProduct?.image_url) {
        await deleteImage(currentProduct.image_url)
      }
      imageUrl = await uploadImage(imageFile)
    }

    const updates = {
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      image_url: imageUrl,
      visible: visible ?? true,
    }

    const { data, error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error al actualizar producto:', updateError)
      throw new Error('No se pudo actualizar el producto. Verifica tu sesión.')
    }

    const mapped = { ...data, image: data.image_url || '' }
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? mapped : product))
    )
  }, [products])

  const deleteProduct = useCallback(async (id) => {
    // Encontrar el producto para eliminar su imagen
    const product = products?.find((p) => p.id === id)
    if (product?.image_url) {
      await deleteImage(product.image_url)
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error al eliminar producto:', deleteError)
      throw new Error('No se pudo eliminar el producto. Verifica tu sesión.')
    }

    setProducts((prev) => prev.filter((product) => product.id !== id))
  }, [products])

  const toggleVisibility = useCallback(async (id) => {
    const product = products?.find((p) => p.id === id)
    if (!product) return

    const newVisible = !product.visible

    const { error: updateError } = await supabase
      .from('products')
      .update({ visible: newVisible })
      .eq('id', id)

    if (updateError) {
      console.error('Error al cambiar visibilidad:', updateError)
      throw new Error('No se pudo cambiar la visibilidad. Verifica tu sesión.')
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, visible: newVisible, updated_at: new Date().toISOString() } : p
      )
    )
  }, [products])

  return {
    products,
    visibleProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
    loading,
    error,
  }
}
