import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { color, font, shadow } from "@/lib/tokens";
import { SettingsToggles } from "@/components/SettingsToggles";
import { LogoutButton, DeleteAccountButton } from "@/components/NavButtons";

export default async function SettingsPage() {
  const session = await auth();
  const dbUser = await prisma.user.findUnique({
    where: { id: session!.user!.id! },
    select: { weeklyDigest: true, interviewEmails: true, plan: true },
  });
  const isPro = dbUser?.plan === "PRO";

  return (
    <div>
      <h1 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, margin: "0 0 24px" }}>
        Configurações
      </h1>

      <SettingsToggles
        isPro={isPro}
        initialDigest={dbUser?.weeklyDigest ?? true}
        initialInterview={dbUser?.interviewEmails ?? false}
      />

      <div
        style={{
          border: `3px solid ${color.coral}`,
          background: color.paper,
          boxShadow: shadow.card,
          padding: 24,
          maxWidth: 640,
          marginTop: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "2px dashed #ccc" }}>
          <div><div style={{ fontWeight: 600, fontSize: 14, color: color.coral }}>Sair da conta</div></div>
          <LogoutButton />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: color.coral }}>Excluir conta</div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>Essa ação não pode ser desfeita</div>
          </div>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
