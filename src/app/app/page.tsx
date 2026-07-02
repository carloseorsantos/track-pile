import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { Job } from "@/lib/types";
import { JobStatus } from "@/lib/tokens";

export default async function HomePage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const rows = await prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // @ts-expect-error plan from session callback
  const isPro = (session!.user!.plan ?? "FREE") === "PRO";

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
