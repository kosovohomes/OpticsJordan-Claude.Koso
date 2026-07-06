import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    style: "currency",
    currency: "JOD",
    minimumFractionDigits: 3,
  }).format(amount);
}
