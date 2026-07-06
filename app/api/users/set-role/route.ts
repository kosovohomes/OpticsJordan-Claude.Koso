import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json();
  const valid = ["CUSTOMER", "SHOP_OWNER", "SUPPLIER"];
  if (!valid.includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, { publicMetadata: { role } });
  await prisma.user.updateMany({ where: { clerkId: userId }, data: { role } });

  return NextResponse.json({ success: true });
}
