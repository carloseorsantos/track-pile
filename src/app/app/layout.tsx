import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Name comes from the DB, not the session: the session is JWT-backed and
  // only reflects name/image as of the last login, so an in-app profile edit
  // wouldn't otherwise show up here until the user signs in again.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id! },
    select: { name: true, image: true, plan: true },
  });

  const plan = dbUser?.plan ?? "FREE";

  return (
    <AppShell
      userName={dbUser?.name ?? "Você"}
      planLabel={plan === "PRO" ? "Plano Pro" : "Plano grátis"}
      image={dbUser?.image}
    >
      {children}
    </AppShell>
  );
}
