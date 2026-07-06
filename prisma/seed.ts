import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");
  const cats = [
    { slug: "eyeglasses", nameAr: "نظارات طبية", nameEn: "Eyeglasses", sortOrder: 1 },
    { slug: "sunglasses", nameAr: "نظارات شمسية", nameEn: "Sunglasses", sortOrder: 2 },
    { slug: "contact-lenses", nameAr: "عدسات لاصقة", nameEn: "Contact Lenses", sortOrder: 3 },
    { slug: "accessories", nameAr: "إكسسوارات", nameEn: "Accessories", sortOrder: 4 },
  ];
  for (const cat of cats) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  const brands = [
    { slug: "ray-ban", nameAr: "راي بان", nameEn: "Ray-Ban" },
    { slug: "oakley", nameAr: "أوكلي", nameEn: "Oakley" },
    { slug: "acuvue", nameAr: "أكيوفيو", nameEn: "Acuvue" },
    { slug: "gucci", nameAr: "غوتشي", nameEn: "Gucci" },
  ];
  for (const brand of brands) {
    await prisma.brand.upsert({ where: { slug: brand.slug }, update: {}, create: brand });
  }
  console.log("✅ Done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
