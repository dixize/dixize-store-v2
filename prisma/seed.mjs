// Seed: creates the admin account (from env) and the four original portfolio projects.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PROJECTS = [
  {
    title: "Save Forest",
    titleEn: "Save Forest",
    description: "Интерактивный сайт, посвященный защите лесов и охране дикой природы. Каталог флоры и фауны, привлекает внимание к экологии через плавный визуал.",
    descriptionEn: "An interactive site dedicated to forest protection and wildlife conservation. A catalogue of flora and fauna, raising awareness through smooth visuals.",
    category: "web", categoryEn: "UI / Conservation",
    url: "https://dixize.github.io/foressttt/", visual: "visual-forest", sortOrder: 1,
  },
  {
    title: "Neon Gen",
    titleEn: "Neon Gen",
    description: "Футуристичный генератор случайных чисел и списков с неоновым интерфейсом. Гибкая настройка диапазона и мгновенная генерация результата.",
    descriptionEn: "A futuristic random number and list generator with a neon interface. Flexible range settings and instant results.",
    category: "web", categoryEn: "HTML / CSS / JS",
    url: "https://dixize.github.io/randomizer/", visual: "visual-random", sortOrder: 2,
  },
  {
    title: "Проектный офис",
    titleEn: "Project Office",
    description: "Корпоративный сайт-презентация для промышленной экосистемы: автоматизация, видеоаналитика и промышленный IoT в едином стильном интерфейсе.",
    descriptionEn: "A corporate presentation site for an industrial ecosystem: automation, video analytics and industrial IoT in one cohesive interface.",
    category: "web", categoryEn: "Corporate",
    url: "https://dixize.github.io/asdwqe/", visual: "visual-office", sortOrder: 3,
  },
  {
    title: "Ultra Tech",
    titleEn: "Ultra Tech",
    description: "Интернет-магазин премиальной техники с каталогом товаров, корзиной и продуманным пользовательским путём от выбора до покупки.",
    descriptionEn: "An online store for premium electronics with a product catalogue, cart, and a carefully designed path from browsing to checkout.",
    category: "store", categoryEn: "E-commerce",
    url: "https://dixize.github.io/dixize_store_web/", visual: "visual-store", sortOrder: 4,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (adminEmail && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: {
        email: adminEmail,
        name: process.env.ADMIN_NAME || "Admin",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Admin ensured: ${adminEmail}`);
  }

  for (const p of DEFAULT_PROJECTS) {
    await prisma.project.upsert({
      where: { id: `seed-${p.sortOrder}` },
      update: {},
      create: { id: `seed-${p.sortOrder}`, ...p },
    });
  }
  console.log(`Projects ensured: ${DEFAULT_PROJECTS.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
