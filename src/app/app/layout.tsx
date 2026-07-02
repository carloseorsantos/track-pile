import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // @ts-expect-error plan added in session callback
  const plan: string = session.user.plan ?? "FREE";

  return (
    <AppShell
      userName={session.user.name ?? "Você"}
      planLabel={plan === "PRO" ? "Plano Pro" : "Plano grátis"}
      image={session.user.image}
    >
      {children}
    </AppShell>
  );
}
