import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { color, font, shadow } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { GoogleSignInButton } from "@/components/NavButtons";
import { AuthErrorToast } from "@/components/AuthErrorToast";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/app");
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "repeating-linear-gradient(45deg, transparent, transparent 22px, #EFE9D8 22px, #EFE9D8 23px)",
      }}
    >
      <div
        className="tp-login-card"
        style={{
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          textAlign: "center",
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.card,
          padding: 32,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Logo size={20} />
        </div>
        <p style={{ color: "#444", fontSize: 14, margin: "8px 0 28px" }}>
          Entre pra organizar suas vagas.
          <br />
          Sem senha, sem cadastro chato.
        </p>
        <GoogleSignInButton />
        <div style={{ marginTop: 20, fontSize: 12, color: "#777", fontFamily: font.mono }}>
          AO ENTRAR VOCÊ ACEITA OS TERMOS DE USO
        </div>
      </div>
      <AuthErrorToast error={error} />
    </div>
  );
}
