import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Building2,
  CheckCircle2,
  TrendingUp,
  MapPin,
  DollarSign,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Phone,
  Database,
  Briefcase,
} from "lucide-react";
import { AddLeadModal, AddPropertyModal } from "@/components/dashboard/action-modals";

export const dynamic = "force-dynamic";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: "disponible" | "reservado" | "vendido" | string;
  user_id?: string;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  budget: number;
  status: "nuevo" | "contactado" | "en_negociacion" | "cerrado" | string;
  user_id?: string;
  created_at?: string;
}

function formatCurrency(amount: number | null | undefined): string {
  if (typeof amount !== "number" || isNaN(amount)) return "$0 USD";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getWhatsAppUrl(phone: string, name: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    `Hola ${name}, te contacto desde nuestra agencia inmobiliaria para dar seguimiento a tu búsqueda de propiedad.`
  );
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : "#";
}

function getLeadStatusBadge(status: string) {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "nuevo":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Nuevo
        </span>
      );
    case "contactado":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Contactado
        </span>
      );
    case "en_negociacion":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          En Negociación
        </span>
      );
    case "cerrado":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Cerrado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-700/30 text-zinc-400 border border-zinc-700/50 capitalize">
          {status || "Pendiente"}
        </span>
      );
  }
}

function getPropertyStatusBadge(status: string) {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "disponible":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Disponible
        </span>
      );
    case "reservado":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Reservado
        </span>
      );
    case "vendido":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-700/50 text-zinc-300 border border-zinc-600/40">
          Vendido
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700 capitalize">
          {status || "Sin estado"}
        </span>
      );
  }
}

export default async function ProtectedDashboardPage() {
  const supabase = await createClient();

  // 1. Validar autenticación de usuario
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  // 2. Consultas a las tablas properties y leads
  const [propertiesResult, leadsResult] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const properties: Property[] = (propertiesResult.data as Property[]) || [];
  const leads: Lead[] = (leadsResult.data as Lead[]) || [];

  // Verificación de si faltan tablas en Supabase
  const missingTables = Boolean(propertiesResult.error || leadsResult.error);

  // 3. Cálculo de métricas para la agencia
  const totalLeads = leads.length;
  const availableProperties = properties.filter(
    (p) => (p.status || "").toLowerCase() === "disponible"
  ).length;
  const closedDeals = leads.filter(
    (l) => (l.status || "").toLowerCase() === "cerrado"
  ).length;

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Alerta informativa en caso de que aún no existan las tablas en Supabase */}
      {missingTables && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-amber-300">
                Tablas de base de datos requeridas
              </p>
              <p className="text-amber-200/80">
                Asegúrate de haber creado las tablas <code className="bg-amber-900/50 px-1 rounded">properties</code> y <code className="bg-amber-900/50 px-1 rounded">leads</code> en tu proyecto de Supabase para persistir los datos.
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-amber-900/40 border border-amber-700/50 text-amber-300 font-mono shrink-0">
            RLS Ready
          </span>
        </div>
      )}

      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              SaaS Inmobiliario
            </span>
            <span className="text-xs text-zinc-500">·</span>
            <span className="text-xs text-zinc-400 truncate max-w-xs">
              {user.email}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Panel de Control Inmobiliario
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Resumen métrico de tu agencia, gestión de prospectos y catálogo disponible.
          </p>
        </div>

        {/* Acciones Rápidas Superiores */}
        <div className="flex items-center gap-3">
          <AddPropertyModal triggerText="Añadir Propiedad" variant="secondary" />
          <AddLeadModal triggerText="Nuevo Lead" variant="primary" />
        </div>
      </div>

      {/* Sección 1: Tarjetas de Resumen Métrico */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Leads */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 shadow-sm hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Total Leads
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-100">{totalLeads}</span>
            <span className="text-xs text-zinc-500">prospectos</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Embudo activo en CRM</span>
          </div>
        </div>

        {/* Propiedades Disponibles */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 shadow-sm hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Propiedades Disponibles
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-100">
              {availableProperties}
            </span>
            <span className="text-xs text-zinc-500">
              de {properties.length} en catálogo
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Listas para comercializar</span>
          </div>
        </div>

        {/* Tratos Cerrados */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 shadow-sm hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Tratos Cerrados
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-100">{closedDeals}</span>
            <span className="text-xs text-zinc-500">ventas / acuerdos</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Conversión exitosa</span>
          </div>
        </div>
      </div>

      {/* Sección 2: Leads Recientes (CRM) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                Leads Recientes (CRM)
              </h2>
              <p className="text-xs text-zinc-400">
                Prospectos interesados y contacto directo inmediato
              </p>
            </div>
          </div>
          <AddLeadModal triggerText="Nuevo Lead" variant="secondary" />
        </div>

        {leads.length === 0 ? (
          /* Empty State para Leads */
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              Sin prospectos registrados aún
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-5">
              Empieza a registrar los clientes interesados en tus propiedades. Podrás gestionar su presupuesto, etapa y escribirles por WhatsApp con un solo clic.
            </p>
            <AddLeadModal
              triggerText="Registrar primer Lead"
              variant="emptyState"
            />
          </div>
        ) : (
          /* Tabla / Tarjetas de Leads */
          <div className="overflow-hidden rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/60 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800 font-semibold">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Nombre
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Teléfono
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Presupuesto
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Estado
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {leads.map((lead) => {
                    const waUrl = getWhatsAppUrl(lead.phone, lead.name);
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-zinc-800/40 transition-colors group"
                      >
                        <td className="px-5 py-4 font-medium text-zinc-100 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 text-zinc-200 font-semibold flex items-center justify-center text-[11px] border border-zinc-700">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[160px] sm:max-w-none">
                            {lead.name}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-300 font-mono">
                          {lead.phone}
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-200">
                          {formatCurrency(lead.budget)}
                        </td>
                        <td className="px-5 py-4">
                          {getLeadStatusBadge(lead.status)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
                            title={`Contactar a ${lead.name} por WhatsApp`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sección 3: Inventario de Propiedades */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">
                Inventario de Propiedades
              </h2>
              <p className="text-xs text-zinc-400">
                Catálogo inmobiliario activo, precios y estado comercial
              </p>
            </div>
          </div>
          <AddPropertyModal triggerText="Añadir Propiedad" variant="secondary" />
        </div>

        {properties.length === 0 ? (
          /* Empty State para Propiedades */
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3 shadow-inner">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">
              Inventario de inmuebles vacío
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-5">
              Añade tus propiedades con precio, ubicación y disponibilidad para organizar las visitas y ofrecerlas a tus prospectos.
            </p>
            <AddPropertyModal
              triggerText="Publicar primera Propiedad"
              variant="emptyState"
            />
          </div>
        ) : (
          /* Cuadrícula de Propiedades */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700/80 shadow-sm transition-all group hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getPropertyStatusBadge(property.status)}
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ID: {property.id.slice(0, 6)}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-100 text-base leading-snug group-hover:text-blue-400 transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                      Precio de lista
                    </span>
                    <span className="text-lg font-bold text-zinc-100">
                      {formatCurrency(property.price)}
                    </span>
                  </div>

                  <span className="text-xs text-blue-400/90 font-medium group-hover:underline flex items-center gap-1">
                    Detalles
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}