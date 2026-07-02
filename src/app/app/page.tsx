import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { Job } from "@/lib/types";
import { JobStatus } from "@/lib/tokens";

export default async function HomePage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [rows, dbUser] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    // Read the plan fresh from the DB rather than the JWT session — the session
    // is only refreshed at login, so a webhook-driven upgrade wouldn't show up
    // here until the user signed in again otherwise.
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
  ]);

  const isPro = dbUser?.plan === "PRO";

  const jobs: Job[] = rows.map((r: (typeof rows)[number]) => ({
    id: r.id,
    company: r.company,
    role: r.role,
    status: r.status as JobStatus,
    link: r.link,
    source: r.source,
    appliedAt: r.appliedAt,
    nextDate: r.nextDate,
    salary: r.salary,
    notes: r.notes,
  }));

  return <HomeClient initialJobs={jobs} isPro={isPro} />;
}
