"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureProProduct, ensureCustomer, createProSubscription } from "@/lib/abacatepay";

class AuthRequiredError extends Error {}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthRequiredError();
  return session.user.id;
}

function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

/** Kicks off an AbacatePay subscription checkout and returns the hosted checkout URL. */
export async function startProSubscription() {
  let userId: string;
  try {
    userId = await requireUser();
  } catch {
    return { ok: false as const, needsAuth: true as const };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, plan: true, abacatepayCustomerId: true },
    });
    if (!user?.email) {
      return { ok: false as const, error: "Sua sessão expirou. Faça login novamente." };
    }
    if (user.plan === "PRO") {
      return { ok: false as const, error: "Você já é Pro." };
    }

    const productId = await ensureProProduct();

    let customerId = user.abacatepayCustomerId;
    if (!customerId) {
      customerId = await ensureCustomer({ email: user.email, name: user.name });
      await prisma.user.update({ where: { id: userId }, data: { abacatepayCustomerId: customerId } });
    }

    const subscription = await createProSubscription({
      productId,
      customerId,
      userId,
      completionUrl: appUrl("/app/profile?upgrade=success"),
      returnUrl: appUrl("/pricing"),
    });

    await prisma.user.update({
      where: { id: userId },
      data: { abacatepaySubscriptionId: subscription.id, subscriptionStatus: "PENDING" },
    });

    return { ok: true as const, url: subscription.url };
  } catch (err) {
    console.error("startProSubscription failed", err);
    return { ok: false as const, error: "Não foi possível iniciar a assinatura. Tente novamente em instantes." };
  }
}
