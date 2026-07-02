import { auth } from "@/lib/auth";
import { color, font, shadow } from "@/lib/tokens";
import { UpgradeButton } from "@/components/NavButtons";

function initialsOf(name?: string | null) {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
}

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user!;
  // @ts-expect-error plan from session
  const isPro = (user.plan ?? "FREE") === "PRO";

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
  } as const;

  return (
    <div>
      <h1 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, margin: "0 0 24px" }}>
        Perfil
      </h1>
      <div style={{ border: "3px solid #111", background: color.paper, boxShadow: shadow.card, padding: 24, maxWidth: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              border: "2px solid #111",
              background: color.coral,
              color: color.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
              backgroundImage: user.image ? `url(${user.image})` : undefined,
              backgroundSize: "cover",
            }}
          >
            {!user.image && initialsOf(user.name)}
          </div>
          <div>
            <h3 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, margin: 0 }}>
              {user.name}
            </h3>
            <div style={{ fontSize: 12, color: "#777" }}>{user.email}</div>
            <span
              style={{
                fontFamily: font.mono,
                fontWeight: 500,
                fontSize: 11,
                padding: "4px 9px",
                border: "2px solid #111",
                boxShadow: shadow.badge,
                background: color.gray,
                color: color.ink,
                display: "inline-block",
                marginTop: 8,
              }}
            >
              {isPro ? "Plano Pro" : "Plano grátis"}
            </span>
          </div>
        </div>

        <div style={{ ...rowStyle, borderBottom: "2px dashed #ccc" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Nome de exibição</div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Como aparece no sistema</div>
          </div>
          <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>{user.name}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: "2px dashed #ccc" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>E-mail</div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Vinculado à sua conta Google</div>
          </div>
          <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>{user.email}</span>
        </div>
        <div style={rowStyle}>
          <div><div style={{ fontWeight: 600, fontSize: 14 }}>Membro desde</div></div>
          <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 13 }}>Jun 2026</span>
        </div>

        {!isPro && (
          <div style={{ marginTop: 20 }}>
            <UpgradeButton />
          </div>
        )}
      </div>
    </div>
  );
}
