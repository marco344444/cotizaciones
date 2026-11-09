import { CotizacionForm } from "@/components/cotizacion/CotizacionForm";

export const metadata = {
  title: "Nueva cotización · Via Elevadores",
};

export default function NuevaCotizacionPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">
      <CotizacionForm />
    </div>
  );
}
