# MediaHub — App de publicaciones internacionalizado

Gestor de noticias/publicaciones con soporte multilingüe (ES / EN).

---

## Tecnologías utilizadas

### Backend
| Herramienta | Versión | Rol |
|---|---|---|
| Node.js | 20+ | Entorno de ejecución |
| Express 5 | 5.x | Framework HTTP |
| TypeScript | 5.x | Tipado estático |
| Prisma 5 | 5.x | ORM / acceso a la BD |
| PostgreSQL | 14+ | Base de datos relacional |
| Zod | 3.x | Validación de esquemas |
| dotenv | — | Variables de entorno |
| CORS | — | Política de origen cruzado |

### Frontend
| Herramienta | Versión | Rol |
|---|---|---|
| Next.js | 16.x | Framework React (App Router) |
| React | 19.x | Biblioteca de UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utilitarios |
| next-intl | 4.x | Internacionalización (i18n) |
| Material Symbols | — | Iconografía (Google Fonts) |

---

## Estructura del repositorio

```
root/
├── backend/          # API REST con Express + Prisma
│   ├── prisma/       # Esquema y migraciones de BD
│   └── src/
│       ├── config/       # Configuración de Prisma
│       ├── controllers/  # Manejo de solicitudes HTTP
│       ├── middlewares/  # Validación, manejo de errores
│       ├── routes/       # Definición de rutas
│       ├── services/     # Lógica de negocio
│       ├── types/        # Interfaces TypeScript
│       └── validators/   # Esquemas Zod
├── frontend/         # Aplicación Next.js
│   └── src/
│       ├── app/          # Páginas (App Router)
│       ├── components/   # Componentes reutilizables
│       ├── i18n/         # i18n
│       ├── lib/          # Cliente de la API
│       └── messages/     # Traducciones ES / EN
└── database.sql      # Script SQL alternativo para crear la BD
```

---

## Instrucciones de ejecución

### Prerrequisitos

- Node.js 20 o superior
- PostgreSQL 14 o superior corriendo localmente (o en la nube)
- npm 9+

---

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

---

### 2. Configurar y levantar el Backend

```bash
cd backend
npm install
```

Crea el archivo de variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/mediahub_db"
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DEEPL_API_KEY="api_key_deepL"
```

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE mediahub_db;
```

Aplica el esquema con Prisma:

```bash
npm run db:push        # aplica el esquema sin crear archivos de migración
# o bien:
npm run db:migrate     # crea y aplica migraciones
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:4000`.
Endpoint de salud: `GET http://localhost:4000/health`

---

### 3. Configurar y levantar el Frontend

Abre una nueva terminal:

```bash
cd frontend
npm install
```

Crea el archivo de variables de entorno:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.
Accede en español: `http://localhost:3000/es`
Accede en inglés: `http://localhost:3000/en`

---

### 4. Scripts disponibles

#### Backend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta el build de producción |
| `npm run db:push` | Aplica el esquema Prisma a la BD |
| `npm run db:migrate` | Crea y aplica migraciones |
| `npm run db:studio` | Abre Prisma Studio (GUI de la BD) |

#### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Ejecuta el build de producción |

---

## API REST — Endpoints

Base URL: `http://localhost:4000/api`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/posts` | Lista todas las publicaciones |
| `GET` | `/posts/:id` | Obtiene una publicación por ID |
| `GET` | `/posts/slug/:slug` | Obtiene una publicación por slug |
| `POST` | `/posts` | Crea una nueva publicación |
| `PUT` | `/posts/:id` | Actualiza una publicación |
| `DELETE` | `/posts/:id` | Elimina una publicación |

### Cuerpo de solicitud — Crear publicación (`POST /posts`)

```json
{
  "title": "Título de la noticia",
  "content": "Contenido del artículo...",
  "imageUrl": "https://images.unsplash.com/photo-xxx"
}
```

> **Nota sobre imágenes:** `imageUrl` debe ser una URL directa al archivo de imagen (`.jpg`, `.png`, `.webp`). En Unsplash, clic derecho sobre la imagen → "Copiar dirección de imagen".

---

## Manejo de imágenes

El proyecto utiliza **referencias por URL externa**. No se almacenan archivos en el servidor. El usuario ingresa una URL pública directa a una imagen al crear o editar una publicación.

**Fuentes sugeridas:**
- [Unsplash](https://unsplash.com) — clic derecho → copiar dirección de imagen
- [imgbb.com](https://imgbb.com) — subir imagen y copiar el "Direct link"
- Cualquier CDN o almacenamiento público (Cloudinary, Supabase Storage)

---

## Internacionalización (i18n)

El proyecto implementa dos capas de traducción independientes:

### 1. Interfaz de usuario — next-intl

La UI está disponible en **español** e **inglés**. El idioma se selecciona desde la barra de navegación y se persiste en la URL (`/es/...` o `/en/...`).

Los archivos de traducción se encuentran en:
```
frontend/src/messages/
├── es.json   # Español
└── en.json   # Inglés
```

### 2. Contenido de publicaciones — DeepL API

El título y el cuerpo de cada publicación se traducen automáticamente al idioma activo mediante la **API de DeepL**. La detección del idioma original es automática, por lo que las publicaciones pueden escribirse en cualquier idioma.

- Una sola llamada a DeepL traduce todas las publicaciones del feed simultáneamente.
- Si la clave no está configurada o la llamada falla, se muestra el texto original sin error.

#### Obtener una clave de DeepL (gratuita)

1. Ir a [deepl.com/pro#developer](https://deepl.com/pro#developer)
2. Registrarse con el plan **DeepL API Free** (1 000 000 caracteres)
3. Copiar la clave de API desde el panel de cuenta
4. Agregarla al archivo `.env` del backend:

```env
DEEPL_API_KEY="api_key_deepL"
```

---

## Patrones de diseño aplicados

### Backend

| Patrón | Dónde | Descripción |
|---|---|---|
| **Service Layer** | `src/services/post.service.ts` | Concentra toda la lógica de negocio (generación de slug, validación de existencia) separada de los controladores HTTP |
| **DTO (Data Transfer Object)** | `src/validators/post.validator.ts` | `CreatePostDTO` y `UpdatePostDTO` definen y validan exactamente los datos que entran a cada operación |
| **Middleware Chain** | `src/middlewares/` | Cadena de responsabilidad: CORS → JSON parser → validación → ruta → manejo de errores |
| **Singleton** | `src/config/database.ts` | Una única instancia de `PrismaClient` compartida en toda la aplicación para evitar múltiples conexiones |

### Frontend

| Patrón | Dónde | Descripción |
|---|---|---|
| **Container / Presentational** | `app/[locale]/*/page.tsx` vs `components/` | Las páginas gestionan estado y llamadas a la API; los componentes solo reciben props y renderizan |
| **Component reutilizable** | `components/posts/PostForm.tsx` | El mismo formulario se usa para crear y editar, adaptando su comportamiento según la prop `datosIniciales` |
| **Proxy / Interceptor** | `src/proxy.ts` (next-intl) | Intercepta todas las rutas para inyectar el locale antes de que la solicitud llegue a la página |
| **Strategy** | `src/messages/` (next-intl) | El sistema selecciona la estrategia de texto según el locale activo sin que el componente lo sepa |

---

## Separación de responsabilidades

```
Backend
├── routes/       → ¿Qué URL activa qué función?
├── controllers/  → ¿Cómo se recibe y responde la solicitud HTTP?
├── services/     → ¿Cuál es la lógica de negocio?
├── validators/   → ¿Qué datos son válidos?
└── middlewares/  → ¿Qué pasa antes y después de cada ruta?

Frontend
├── app/          → Orquestación de datos y estado por página
├── components/   → Piezas de UI reutilizables sin lógica de fetch
├── lib/api.ts    → Capa de comunicación con el backend
└── messages/     → Contenido textual separado del código
```

---

## Flujo de trabajo — Git Flow

El desarrollo del proyecto se gestionó con **Git Flow**, una estrategia de ramificación que separa el trabajo en progreso del código estable, el cual fue empleado de manera local.

### Ramas principales

| Rama | Propósito |
|---|---|
| `main` | Código estable listo para producción. Solo recibe merges desde `release`. |
| `develop` | Rama de integración. Aquí se acumulan las features antes de salir a producción. |

### Ramas de soporte

| Prefijo | Propósito | Se crea desde | Se fusiona en |
|---|---|---|---|
| `feature/` | Nuevas funcionalidades | `develop` | `develop` |
| `release/` | Preparación de una versión | `develop` | `main` + `develop` |

### Diagrama del flujo

```
develop  ──┬────────────┬──────────┬────────┬──────────────►
           │            │          │        │
           │  feature/  │          │        │
           │            │          │        │
           ▼            ▼          ▼        ▼
         backend    frontend   i18n     ui-design
           │            │          │        │
           └────────────┴──────────┴────────┘
                        merges → develop
```

### Comandos utilizados

```bash
# Iniciar una nueva feature
git flow feature start nombre-feature

# Trabajar y hacer commits en la feature
git add .
git commit -m "descripción del cambio"

# Finalizar la feature y fusionar en develop
git flow feature finish nombre-feature

```
Este es un estracto de el flujo de trabajo utilizado en el desarrollo del proyecto.

![Git Flow](./screenshots/gitflow.png)

---

## Variables de entorno requeridas

### Backend (`.env`)

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@localhost:5432/mediahub_db` | Cadena de conexión a PostgreSQL |
| `PORT` | `4000` | Puerto del servidor Express |
| `FRONTEND_URL` | `http://localhost:3000` | Origen permitido por CORS |
| `NODE_ENV` | `development` | Entorno de ejecución |
| `DEEPL_API_KEY` | `api_key_deepL` | API DeepL para traducción de publicaciones |


### Frontend (`.env.local`)

| Variable | Ejemplo | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | URL base de la API del backend |

---

## Capturas de pantalla

| Feed público | Panel de administración | Crear / Editar publicación | Publicación |
| ![Feed](./screenshots/feed.png) | ![Admin](./screenshots/admin.png) | ![Formulario](./screenshots/form.png) | ![Publicación](./screenshots/post.png) |
