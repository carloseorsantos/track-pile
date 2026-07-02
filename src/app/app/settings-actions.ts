"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSettings(input: {
  weeklyDigest: boolean;
  interviewEmails: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "Sua sessão expirou. Faça login novamente." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        weeklyDigest: input.weeklyDigest,
        interviewEmails: input.interviewEmails,
      },
    });
  } catch (err) {
    console.error("saveSettings failed", err);
    return { ok: false as const, error: "Não foi possível salvar a preferência. Tente novamente." };
  }

  revalidatePath("/app/settings");
  return { ok: true as const };
}
