import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, type AbacateWebhookEvent } from "@/lib/abacatepay";

/**
 * Receives AbacatePay webhook events for the Pro subscription.
 * Registered via POST /webhooks/create pointing here with
 * `?webhookSecret=<ABACATEPAY_WEBHOOK_SECRET>`.
 *
 * Verification is two-layered per https://docs.abacatepay.com/pages/webhooks:
 * 1. the `webhookSecret` query param must match what we registered the endpoint with;
 * 2. the `X-Webhook-Signature` header must be a valid HMAC-SHA256(secret, rawBody).
 */
export async function POST(req: NextRequest) {
  const querySecret = req.nextUrl.searchParams.get("webhookSecret");
  if (!querySecret || querySecret !== process.env.ABACATEPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "invalid webhookSecret" }, { status: 401 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: AbacateWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { data } = event;
  const userId = data.metadata?.userId ?? data.externalId ?? undefined;

  const findUser = () => {
    if (userId) return prisma.user.findUnique({ where: { id: userId } });
    if (data.id) return prisma.user.findFirst({ where: { abacatepaySubscriptionId: data.id } });
    if (data.customerId) return prisma.user.findFirst({ where: { abacatepayCustomerId: data.customerId } });
    return null;
  };

  switch (event.event) {
    case "subscription.completed":
    case "subscription.renewed": {
      const user = await findUser();
      if (!user) {
        console.error("abacatepay webhook: no matching user", event.event, data);
        break;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: "PRO",
          subscriptionStatus: "ACTIVE",
          abacatepaySubscriptionId: data.id ?? user.abacatepaySubscriptionId,
        },
      });
      break;
    }
    case "subscription.cancelled": {
      const user = await findUser();
      if (!user) {
        console.error("abacatepay webhook: no matching user", event.event, data);
        break;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: "FREE", subscriptionStatus: "CANCELLED" },
      });
      break;
    }
    default:
      // Unhandled event types (payouts, transfers, one-off checkouts, etc.) are ignored.
      break;
  }

  // Always 200 on a verified, parseable payload so AbacatePay doesn't retry indefinitely.
  return NextResponse.json({ received: true });
}
