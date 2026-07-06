import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Webhook secret missing", { status: 500 });

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature)
    return new NextResponse("Missing svix headers", { status: 400 });

  const body = await req.text();
  const wh = new Webhook(secret);

  let evt: { type: string; data: Record<string, unknown> };
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof evt;
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const data = evt.data as {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    public_metadata: { role?: string };
  };

  if (evt.type === "user.created") {
    const email = data.email_addresses.find((e) => e.id === data.primary_email_address_id)?.email_address ?? "";
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email,
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        avatar: data.image_url,
        role: (data.public_metadata?.role as "CUSTOMER") ?? "CUSTOMER",
      },
    });
  }

  if (evt.type === "user.updated") {
    await prisma.user.updateMany({
      where: { clerkId: data.id },
      data: {
        firstName: data.first_name ?? undefined,
        lastName: data.last_name ?? undefined,
        avatar: data.image_url,
      },
    });
  }

  if (evt.type === "user.deleted") {
    await prisma.user.updateMany({ where: { clerkId: data.id }, data: { isActive: false } });
  }

  return NextResponse.json({ received: true });
}
