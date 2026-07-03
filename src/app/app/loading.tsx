import { color, shadow } from "@/lib/tokens";

/**
 * Suspense fallback for the /app segment. Renders instantly on navigation
 * (Dashboard / Perfil / Configurações) while the destination server component
 * awaits auth() + Prisma, so the sidebar click always gets immediate feedback.
 */
export default function AppLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          height: 32,
          width: 220,
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.sm,
        }}
      />
      <div
        style={{
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.card,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 18,
              width: `${90 - i * 8}%`,
              background: color.gray,
            }}
          />
        ))}
      </div>
    </div>
  );
}
