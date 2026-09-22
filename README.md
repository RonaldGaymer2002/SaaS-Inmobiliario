# 🏢 SaaS Inmobiliario — CRM & Gestión de Propiedades

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

Plataforma web integral orientada a agentes y agencias de bienes raíces. Permite centralizar la administración del inventario de inmuebles, realizar seguimiento activo del embudo comercial (CRM de prospectos/leads) y acelerar el cierre de ventas mediante integraciones directas con WhatsApp en un entorno seguro y de alto rendimiento.

---

## 👨‍💻 Desarrollador del Proyecto

* **Programador:** **Ronald Augusto Rodriguez Serrano**
* **Repositorio:** [RonaldGaymer2002/SaaS-Inmobiliario](https://github.com/RonaldGaymer2002/SaaS-Inmobiliario)
* **Demo en Producción:** [saas-inmobiliario en Vercel](https://saas-inmobiliario-n6nmllvm-ronaldaugust2002-3680s-projects.vercel.app)

---

## 🚀 Funcionalidades Principales

### 1. Panel de Control y Métricas en Tiempo Real (KPIs)
* **Total de Propiedades:** Contador en tiempo real de inmuebles activos en cartera.
* **Prospectos Registrados:** Métrica consolidada de clientes potenciales en seguimiento.
* **Tratos Cerrados:** Conteo de conversiones y ventas concretadas con éxito.
* **Pipeline Estimado:** Cálculo dinámico acumulado del volumen monetario total de clientes en etapa de visita o negociación.

### 2. CRM y Pipeline de Leads
* **Ciclo de Vida del Prospecto:** Clasificación por estados (`Nuevo`, `Contactado`, `Visita Agendada`, `Negociación`, `Cerrado`).
* **Control Presupuestario:** Registro y visualización del presupuesto disponible por cada cliente.
* **Integración con WhatsApp en 1 Clic:** Enlace automático que abre WhatsApp Web o app móvil con un mensaje predeterminado y personalizado con el nombre del cliente.
* **Empty States Guiados:** Flujo interactivo que invita al usuario a registrar su primer prospecto cuando no existen registros.

### 3. Catálogo e Inventario de Inmuebles
* **Fichas Comerciales:** Título de propiedad, ubicación geográfica, precio formateado en divisa internacional y estado comercial (`Disponible`, `Reservado`, `Vendido`).
* **Modales Reactivos:** Formularios con validación en servidor para dar de alta inmuebles sin recargar la página.
* **Diseño Dark Mode Elegante:** Tarjetas modernas con microinteracciones sutiles, efectos de elevación (*hover*) y contraste visual optimizado.

### 4. Seguridad, Autenticación y Multi-inquilino
* **Redirección Inteligente:** La ruta raíz (`/`) detecta automáticamente la sesión: redirige al **Dashboard** (`/protected`) si el usuario está autenticado, o a **/Login** si no lo está.
* **Sesiones Seguras vía SSR:** Implementación oficial de `@supabase/ssr` basada en cookies seguras (Server Components, Server Actions y Middleware).
* **Aislamiento Multi-usuario:** Cada agente gestiona exclusivamente sus propias propiedades y prospectos gracias a políticas **Row Level Security (RLS)** en PostgreSQL vinculadas a su `user_id`.
* **Sanitización de URLs y Claves:** Limpieza preventiva de espacios en blanco y barras finales para evitar errores de pasarela (*Kong Gateway 404*).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework Fullstack** | [Next.js 15](https://nextjs.org/) | App Router, Server Components y renderizado dinámico bajo demanda. |
| **Biblioteca de UI** | [React 19](https://react.dev/) | Primitivas y componentes reactivos modernos con soporte Server Actions. |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático estricto para entidades, modelos y Server Actions. |
| **Estilos y Diseño** | [Tailwind CSS](https://tailwindcss.com/) | Sistema de diseño responsivo con paleta oscura refinada. |
| **Componentes e Iconos**| [Lucide React](https://lucide.dev/) & [Radix UI](https://www.radix-ui.com/) | Iconografía nítida y componentes accesibles (WAI-ARIA). |
| **Base de Datos & Auth** | [Supabase](https://supabase.com/) | PostgreSQL gestionado, Row Level Security (RLS) y Auth Engine. |
| **Backend Logic** | Next.js Server Actions | Mutaciones en servidor (`createPropertyAction`, `createLeadAction`) con `revalidatePath`. |
| **Despliegue / CI/CD** | [Vercel](https://vercel.com/) | Hosting serverless con CI/CD automático conectado a GitHub. |

---

## 📂 Estructura del Proyecto

```text
saas-inmobiliario/
├── app/
│   ├── auth/
│   │   ├── login/                # Pantalla de inicio de sesión
│   │   ├── sign-up/              # Pantalla de registro de nuevos usuarios
│   │   ├── sign-up-success/      # Confirmación de registro exitoso
│   │   └── forgot-password/      # Recuperación de contraseñas
│   ├── protected/
│   │   ├── page.tsx              # Dashboard inmobiliario (KPIs, Leads, Inventario)
│   │   └── actions.ts            # Server Actions para inserción y validación de datos
│   ├── layout.tsx                # Layout raíz de la aplicación con temas
│   └── page.tsx                  # Enrutador inteligente (Login / Dashboard)
├── components/
│   ├── dashboard/
│   │   └── action-modals.tsx     # Modales para añadir Propiedades y Leads
│   ├── login-form.tsx            # Formulario cliente de inicio de sesión
│   ├── sign-up-form.tsx          # Formulario cliente de registro
│   └── ui/                       # Primitivas de UI reutilizables (Botones, Cards, Inputs)
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Cliente browser de Supabase con sanitización
│   │   ├── server.ts             # Cliente servidor de Supabase adaptado a cookies
│   │   └── proxy.ts              # Middleware para refresco continuo de sesiones
│   └── utils.ts                  # Formateadores de moneda, badges y clases CSS
├── .npmrc                        # Configuración de logs limpios en CI/CD
├── .env.example                  # Plantilla de variables de entorno requeridas
└── README.md                     # Documentación completa del sistema
```

---

## 🗄️ Esquema de Base de Datos (Supabase / PostgreSQL)

Para inicializar la base de datos en tu proyecto de Supabase, ejecuta el siguiente script en el **SQL Editor** de tu consola:

```sql
-- 1. Tabla de Propiedades
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  location text not null,
  price numeric(12, 2) not null default 0,
  status text not null default 'disponible',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Prospectos (Leads)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text not null,
  budget numeric(12, 2) not null default 0,
  status text not null default 'nuevo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habilitar Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.leads enable row level security;

-- 4. Políticas de aislamiento para Propiedades (cada usuario solo ve lo suyo)
create policy "Usuarios gestionan sus propias propiedades"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Políticas de aislamiento para Leads
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

### 4. Variables de Entorno Locales
Crea un archivo `.env.local` en la raíz del proyecto tomando como modelo `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-anon-o-publishable
```

### 5. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en ejecución.

---

## ☁️ Guía de Despliegue en Vercel

1. **Importar el Repositorio:**  
   Conecta tu cuenta de GitHub con Vercel e importa el repositorio `RonaldGaymer2002/SaaS-Inmobiliario`.
2. **Configurar Variables de Entorno en Vercel:**  
   En **Settings** ➔ **Environment Variables**, agrega:
   * `NEXT_PUBLIC_SUPABASE_URL`: La URL base de tu proyecto Supabase (ej. `https://xxxx.supabase.co`, sin barra final).
   * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Tu clave anónima o publishable.
3. **Configurar Redirecciones en Supabase:**  
   En **Supabase Console** ➔ **Authentication** ➔ **URL Configuration**:
   * **Site URL:** La URL de tu app en Vercel (ej. `https://tu-proyecto.vercel.app`).
   * **Redirect URLs:** Agrega `https://*.vercel.app/**` y `http://localhost:3000/**`.
4. **Desplegar:**  
   Vercel compilará automáticamente con cada `git push` a la rama `main`.

---

## 📄 Licencia

Este proyecto fue concebido y desarrollado por **Ronald Augusto Rodriguez Serrano** con fines profesionales y de gestión inmobiliaria de alto rendimiento.
