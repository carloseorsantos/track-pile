import { color } from "@/lib/tokens";

/**
 * Suspense fallback for the /app segment. Renders instantly on navigation
 * (Dashboard / Perfil / Configurações) while the destination server component
 * awaits auth() + Prisma, so the sidebar click always gets immediate feedback.
 */
export default function AppLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: `4px solid ${color.gray}`,
          borderTopColor: color.ink,
          borderRadius: "50%",
          animation: "tp-spin 0.7s linear infinite",
        }}
      />
      <style>{`
        @keyframes tp-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
