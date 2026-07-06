import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type UserRole = "CUSTOMER" | "SHOP_OWNER" | "SUPPLIER" | "ADMIN";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  return (user?.publicMetadata?.role as UserRole) ?? "CUSTOMER";
}

export async function requireAuth(locale = "ar") {
  const { userId } = await auth();
  if (!userId) redirect(`/${locale}/auth/sign-in`);
  return userId;
}

export async function requireRole(roles: UserRole[], locale = "ar") {
  const role = await getCurrentUserRole();
  if (!role || !roles.includes(role)) redirect(`/${locale}`);
  return role;
}
