"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, ProfileInput } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

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

export async function updateProfile(input: ProfileInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "Sua sessão expirou. Faça login novamente." };
  }

  try {
    const data = profileSchema.parse(input);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        language: data.language,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return { ok: false as const, error: "Verifique os campos preenchidos e tente novamente." };
    }
    console.error("updateProfile failed", err);
    return { ok: false as const, error: "Não foi possível salvar o perfil. Tente novamente." };
  }

  revalidatePath("/app/profile");
  revalidatePath("/app");
  return { ok: true as const };
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "Sua sessão expirou. Faça login novamente." };
  }

  try {
    await prisma.user.delete({ where: { id: session.user.id } });
  } catch (err) {
    console.error("deleteAccount failed", err);
    return { ok: false as const, error: "Não foi possível excluir a conta. Tente novamente." };
  }

  return { ok: true as const };
}
