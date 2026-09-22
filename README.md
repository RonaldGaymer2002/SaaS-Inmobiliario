# 🏢 SaaS Inmobiliario — CRM & Gestión de Propiedades

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

Plataforma web integral orientada a agentes y agencias de bienes raíces. Permite centralizar la administración del inventario de inmuebles, realizar seguimiento activo del embudo comercial (CRM de prospectos/leads) y acelerar el cierre de ventas mediante integraciones directas con WhatsApp en un entorno seguro y de alto rendimiento.

---

## 👨‍💻 Desarrollador del Proyecto

* **Programador:** **Ronald Augusto Rodriguez Serrano**
* **Repositorio:** [RonaldGaymer2002/SaaS-Inmobiliario](https://github.com/RonaldGaymer2002/SaaS-Inmobiliario)

---

## 🚀 Funcionalidades Principales

### 1. Panel de Control y Métricas en Tiempo Real (KPIs)
* **Total de Propiedades:** Contador de inmuebles activos en cartera.
* **Prospectos Registrados:** Métrica consolidada de clientes potenciales.
* **Tratos Cerrados:** Seguimiento de conversiones exitosas.
* **Pipeline Estimado:** Cálculo dinámico del volumen monetario total de clientes en negociación o visitas activas.

### 2. CRM y Gestión de Leads
* **Ciclo de Vida del Prospecto:** Clasificación por estados (`Nuevo`, `Contactado`, `Visita Agendada`, `Negociación`, `Cerrado`).
* **Control Presupuestario:** Registro del presupuesto disponible por cada cliente.
* **Integración con WhatsApp en 1 Clic:** Enlace dinámico que abre WhatsApp Web o móvil con un mensaje de presentación contextualizado con el nombre del cliente.
* **Estados Vacíos Intuitivos:** Flujo guiado para registrar el primer prospecto cuando la base de datos está vacía.

### 3. Catálogo e Inventario de Inmuebles
* **Fichas Comerciales:** Título, ubicación geográfica, precio formateado en divisa y estado comercial (`Disponible`, `Reservado`, `Vendido`).
* **Modales Interactivos:** Formularios optimizados para el alta de propiedades con validación en servidor.
* **Tarjetas con Microinteracciones:** Diseño de interfaz moderna en modo oscuro con efectos sutiles de elevación y transiciones suaves.

### 4. Seguridad y Autenticación
* **Sesiones Seguras vía SSR:** Implementación de `@supabase/ssr` con cookies seguras (Server Components, Server Actions y Middleware).
* **Aislamiento Multi-usuario:** Cada agente o usuario gestiona exclusivamente sus propias propiedades y prospectos vinculados a su identificador único (`user_id`).
* **Rutas Protegidas:** Redirección automática al inicio de sesión si no existe una sesión activa y válida.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Fullstack** | [Next.js 15](https://nextjs.org/) | App Router, Server Components y renderizado dinámico (`force-dynamic`). |
| **Biblioteca de UI** | [React 19](https://react.dev/) | Primitivas y componentes reactivos modernos. |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático estricto para modelos de datos y Server Actions. |
| **Estilos y Diseño** | [Tailwind CSS](https://tailwindcss.com/) | Sistema de diseño responsivo y estética moderna Dark Mode. |
| **Componentes e Iconos**| [Lucide React](https://lucide.dev/) & [Radix UI](https://www.radix-ui.com/) | Iconografía nítida y accesibilidad nativa. |
| **Base de Datos & Auth** | [Supabase](https://supabase.com/) | PostgreSQL gestionado, Row Level Security (RLS) y autenticación segura. |
| **Backend Logic** | Next.js Server Actions | Mutaciones en servidor (`createPropertyAction`, `createLeadAction`) con `revalidatePath`. |

---

## 📂 Estructura del Proyecto

```text
saas-inmobiliario/
├── app/
│   ├── layout.tsx                # Layout principal de la aplicación y temas
│   ├── page.tsx                  # Landing page pública de bienvenida
│   └── protected/
│       ├── page.tsx              # Dashboard inmobiliario (KPIs, Leads, Inventario)
│       ├── actions.ts            # Server Actions para inserción y validación de datos
│       └── reset-password/       # Flujo de recuperación de contraseñas
├── components/
│   ├── auth-button.tsx           # Botón de autenticación e inicio/cierre de sesión
│   ├── dashboard/
│   │   └── action-modals.tsx     # Modales para añadir Propiedades y Leads
│   └── ui/                       # Componentes base reutilizables
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Cliente de Supabase para Client Components
│   │   ├── server.ts             # Cliente de Supabase adaptado a cookies de servidor
│   │   └── middleware.ts         # Verificación y actualización de sesión
│   └── utils.ts                  # Utilidades auxiliares de formato y clases
├── .env.example                  # Plantilla de variables de entorno requeridas
└── README.md                     # Documentación general del sistema
```

---

## 🗄️ Esquema de Base de Datos (Supabase / PostgreSQL)

Para inicializar la base de datos en tu proyecto de Supabase, ejecuta las siguientes sentencias SQL en el **SQL Editor**:

```sql
-- Tabla de Propiedades
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  location text not null,
  price numeric(12, 2) not null default 0,
  status text not null default 'disponible',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de Prospectos (Leads)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text not null,
  budget numeric(12, 2) not null default 0,
  status text not null default 'nuevo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.leads enable row level security;

-- Políticas de acceso para Properties
create policy "Usuarios gestionan sus propias propiedades"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Políticas de acceso para Leads
create policy "Usuarios gestionan sus propios leads"
  on public.leads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## ⚙️ Instalación y Puesta en Marcha Local

### 1. Prerrequisitos
* [Node.js](https://nodejs.org/) v18.18+ o superior.
* Gestor de paquetes `npm`, `pnpm` o `yarn`.
* Cuenta activa en [Supabase](https://supabase.com/) con un proyecto creado.

### 2. Clonar el repositorio
```bash
git clone https://github.com/RonaldGaymer2002/SaaS-Inmobiliario.git
cd SaaS-Inmobiliario
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto tomando como referencia `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-anon-o-publishable
```

### 5. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en ejecución. Accede a la ruta `/protected` tras iniciar sesión para visualizar el panel de control.

---

## 📄 Licencia

Este proyecto fue desarrollado por **Ronald Augusto Rodriguez Serrano** con fines profesionales y de gestión inmobiliaria.
