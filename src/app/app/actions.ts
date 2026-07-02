"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jobSchema, FREE_JOB_LIMIT } from "@/lib/validation";

class AuthRequiredError extends Error {}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthRequiredError();
  return session.user.id;
}

/** Converts any thrown error into a user-facing PT-BR message, never leaking internals. */
function toFriendlyError(err: unknown): string {
  if (err instanceof AuthRequiredError) return "Sua sessão expirou. Faça login novamente.";
  if (err instanceof ZodError) return "Verifique os campos preenchidos e tente novamente.";
  console.error("Job action failed", err);
  return "Algo deu errado. Tente novamente em instantes.";
}

export async function createJob(raw: unknown) {
  try {
    const userId = await requireUser();
    const data = jobSchema.parse(raw);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, _count: { select: { jobs: true } } },
    });

    // Enforce the free-plan limit on the backend (the counter in the UI is
    // just a hint — the real gate lives here).
    if (user?.plan === "FREE" && user._count.jobs >= FREE_JOB_LIMIT) {
      return {
        ok: false as const,
        error: `Limite do plano grátis atingido (${FREE_JOB_LIMIT} vagas). Faça upgrade para o Pro.`,
      };
    }

    const job = await prisma.job.create({
      data: {
        userId,
        company: data.company,
        role: data.role,
        status: data.status,
        source: data.source,
        link: data.link || null,
        appliedAt: data.appliedAt || null,
        nextDate: data.nextDate || null,
        salary: data.salary || null,
        notes: data.notes || null,
        history: { create: { to: data.status } },
      },
    });

    revalidatePath("/app");
    return { ok: true as const, job };
  } catch (err) {
    return { ok: false as const, error: toFriendlyError(err) };
  }
}

export async function updateJobStatus(jobId: string, to: string) {
  try {
    const userId = await requireUser();
    const job = await prisma.job.findFirst({ where: { id: jobId, userId } });
    if (!job) return { ok: false as const, error: "Vaga não encontrada." };
    if (job.status === to) return { ok: true as const };

    await prisma.$transaction([
      prisma.job.update({ where: { id: jobId }, data: { status: to } }),
      prisma.statusHistory.create({
        data: { jobId, from: job.status, to },
      }),
    ]);

    revalidatePath("/app");
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: toFriendlyError(err) };
  }
}

export async function updateJob(jobId: string, raw: unknown) {
  try {
    const userId = await requireUser();
    const data = jobSchema.parse(raw);
    const existing = await prisma.job.findFirst({ where: { id: jobId, userId } });
    if (!existing) return { ok: false as const, error: "Vaga não encontrada." };

    const statusChanged = existing.status !== data.status;

    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: {
          company: data.company,
          role: data.role,
          status: data.status,
          source: data.source,
          link: data.link || null,
          appliedAt: data.appliedAt || null,
          nextDate: data.nextDate || null,
          salary: data.salary || null,
          notes: data.notes || null,
        },
      }),
      ...(statusChanged
        ? [
            prisma.statusHistory.create({
              data: { jobId, from: existing.status, to: data.status },
            }),
          ]
        : []),
    ]);

    revalidatePath("/app");
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: toFriendlyError(err) };
  }
}

export async function deleteJob(jobId: string) {
  try {
    const userId = await requireUser();
    const res = await prisma.job.deleteMany({ where: { id: jobId, userId } });
    revalidatePath("/app");
    if (res.count === 0) return { ok: false as const, error: "Vaga não encontrada." };
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: toFriendlyError(err) };
  }
}
