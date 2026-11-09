import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // Compatibilidad con URLs antiguas (en español): redirigen a las nuevas.
  // 308 preserva método y body (POST de la API sigue funcionando).
  async redirects() {
    return [
      { source: "/nueva", destination: "/new", permanent: false },
      { source: "/c/:slug", destination: "/q/:slug", permanent: false },
      { source: "/api/cotizaciones", destination: "/api/quotations", permanent: false },
      {
        source: "/api/c/:slug/:action",
        destination: "/api/quotations/:slug/:action",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

