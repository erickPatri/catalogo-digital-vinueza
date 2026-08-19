# Catálogo Digital — Creaciones Vinueza 🛒🛡️

Un e-commerce ligero y catálogo digital especializado en equipamiento táctico, diseñado con un enfoque "Mobile-First" y optimizado para canalizar ventas directamente hacia WhatsApp. 

Este proyecto incluye tanto la vista pública para clientes como un **panel de administración seguro (Dashboard)** para la gestión en tiempo real del inventario.

---

## 🚀 Características Principales (Features)

### 🛍️ Vista Pública (Frontend)
- **Diseño UI/UX Táctico:** Paleta de colores oscuros con acentos "Military Green" para transmitir robustez y profesionalidad.
- **Filtrado Dinámico:** Navegación instantánea por categorías (Navajas, Chalecos, Linternas, Botas).
- **Búsqueda en Tiempo Real:** Barra de búsqueda optimizada para encontrar productos sin recargar la página.
- **Integración con WhatsApp:** Cada producto genera automáticamente un enlace con un mensaje pre-formateado listo para enviar al vendedor.
- **Visualizador de Imágenes:** Modal integrado para ver las fotos de los productos a gran detalle junto con su descripción completa.

### 🔐 Panel de Administración (Backend)
- **Autenticación Segura:** Login protegido y gestionado por Supabase Auth (protección contra fuerza bruta y JWT sessions).
- **CRUD Completo:** Creación, lectura, actualización y eliminación de productos en tiempo real.
- **Storage en la Nube:** Subida de imágenes directamente a Supabase Storage, optimizando el rendimiento y la carga del frontend.
- **Control de Visibilidad:** Capacidad de ocultar productos (fuera de stock) sin necesidad de eliminarlos de la base de datos.

---

## 🛠️ Tecnologías y Stack (Tech Stack)

Este proyecto fue construido utilizando herramientas modernas enfocadas en el rendimiento y la experiencia de desarrollo:

- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (Rápido y ligero)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Diseño utilitario y responsivo)
- **Enrutamiento:** [React Router v6](https://reactrouter.com/) (Navegación fluida tipo SPA)
- **Backend as a Service (BaaS):** [Supabase](https://supabase.com/)
  - PostgreSQL (Base de datos relacional)
  - Supabase Storage (Almacenamiento de imágenes)
  - Supabase Auth (Autenticación)
- **Iconografía:** SVGs personalizados para mantener el peso del bundle al mínimo.

---

## 📂 Arquitectura (Folder Structure)

El código sigue buenas prácticas de separación de responsabilidades (Clean Code) y Custom Hooks para abstraer la lógica de negocio de los componentes de UI.

```text
src/
├── assets/          # Imágenes estáticas y logos
├── components/      # Componentes reutilizables (Header, ProductCard, Modal, etc.)
├── hooks/           # Lógica de negocio (useAuth, useProducts) conectada a Supabase
├── pages/           # Vistas principales (CatalogPage, AdminPage, LoginPage)
├── config.js        # Variables de configuración globales (Nombre, WhatsApp, Categorías)
├── main.jsx         # Punto de entrada de React
└── supabaseClient.js# Inicialización del cliente de Supabase
```

---

## ⚙️ Configuración Local (Setup)

Si deseas clonar y correr este proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/erickPatri/catalogo-digital-vinueza.git
   cd catalogo-digital-vinueza
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_project_url
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---
*Desarrollado con pasión para escalar negocios.*
