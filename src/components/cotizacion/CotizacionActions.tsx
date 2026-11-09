"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";

interface Props {
  slug: string;
  numero: string;
  sugerenciasPendientes: boolean;
  totalSugerencias: number;
}

/**
 * =========================================================
 * VISTA — Barra de acciones de una cotización (cliente)
 * ---------------------------------------------------------
 * Permite descargar el PDF, imprimir y sugerir cambios.
 * Las sugerencias se guardan y avisan al creador.
 * =========================================================
 */
export function CotizacionActions({
  slug,
  numero,
  sugerenciasPendientes,
  totalSugerencias,
}: Props) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function enviarSugerencia(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setEstado("idle");
    setError("");
    try {
      const res = await fetch(`/api/quotations/${slug}/sugerencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      const datos = await res.json();
      if (!res.ok) {
        throw new Error(datos.error || "Error al enviar");
      }
      setEstado("ok");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`/api/quotations/${slug}/pdf`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          ⬇ Descargar PDF
        </a>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          🖨 Imprimir
        </Button>
        <Button
          type="button"
          variant={sugerenciasPendientes ? "green" : "ghost"}
          onClick={() => setMostrarForm((v) => !v)}
        >
          💬 Sugerir cambios
          {totalSugerencias > 0 && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {totalSugerencias}
            </span>
          )}
        </Button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={enviarSugerencia}
          className="max-w-xl rounded-2xl border border-ui-border bg-ui-card p-5 shadow-sm"
        >
          <h3 className="mb-3 text-base font-bold text-ui-text">
            Sugerir cambios a la cotización {numero}
          </h3>
          {estado === "ok" && (
            <div className="mb-3 rounded-xl border border-brand-green-500/40 bg-ui-greenwash px-4 py-3 text-sm font-semibold text-brand-green-300">
              ✓ Gracias. Tu sugerencia fue enviada y el creador será notificado.
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Tu nombre" required>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" />
            </Field>
            <Field label="Tu email" required>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@.." />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Comentario / cambios sugeridos" required>
              <Textarea
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Describe qué debería ajustarse (precio, especificaciones, plazos, etc.)"
              />
            </Field>
          </div>
          {estado === "error" && (
            <p className="mt-2 text-xs font-medium text-brand-400">{error}</p>
          )}
          <div className="mt-4">
            <Button type="submit" variant="green" isLoading={enviando}>
              Enviar sugerencia
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
