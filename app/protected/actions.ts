"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success?: boolean;
  error?: string;
}

export async function createPropertyAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Sesión no válida o usuario no autenticado." };
    }

    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr) || 0;
    const status = (formData.get("status") as string)?.trim() || "disponible";

    if (!title) return { error: "El título de la propiedad es obligatorio." };
    if (!location) return { error: "La ubicación es obligatoria." };
    if (price <= 0) return { error: "El precio debe ser un número mayor a cero." };

    const { error } = await supabase.from("properties").insert({
      title,
      location,
      price,
      status,
      user_id: user.id,
    });

    if (error) {
      return { error: `Error al guardar en Supabase: ${error.message}` };
    }

    revalidatePath("/protected");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error inesperado al registrar la propiedad.";
    return { error: message };
  }
}

export async function createLeadAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Sesión no válida o usuario no autenticado." };
    }

    const name = (formData.get("name") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const budgetStr = formData.get("budget") as string;
    const budget = parseFloat(budgetStr) || 0;
    const status = (formData.get("status") as string)?.trim() || "nuevo";

    if (!name) return { error: "El nombre del prospecto es obligatorio." };
    if (!phone) return { error: "El teléfono es obligatorio para el contacto vía WhatsApp." };

    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      budget,
      status,
      user_id: user.id,
    });

    if (error) {
      return { error: `Error al guardar en Supabase: ${error.message}` };
    }

    revalidatePath("/protected");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error inesperado al registrar el prospecto.";
    return { error: message };
  }
}
