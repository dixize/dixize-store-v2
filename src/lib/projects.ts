import { prisma } from "./prisma";

export interface ProjectDTO {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  url: string;
  visual: string;
  sortOrder: number;
}

// The four original projects — used as a fallback so the homepage still
// renders before DATABASE_URL is configured, and as seed data.
export const DEFAULT_PROJECTS: ProjectDTO[] = [
  {
    id: "seed-1",
    title: "Save Forest",
    titleEn: "Save Forest",
    description: "Интерактивный сайт, посвященный защите лесов и охране дикой природы. Каталог флоры и фауны, привлекает внимание к экологии через плавный визуал.",
    descriptionEn: "An interactive site dedicated to forest protection and wildlife conservation. A catalogue of flora and fauna, raising awareness through smooth visuals.",
    category: "web",
    categoryEn: "UI / Conservation",
    url: "https://dixize.github.io/foressttt/",
    visual: "visual-forest",
    sortOrder: 1,
  },
  {
    id: "seed-2",
    title: "Neon Gen",
    titleEn: "Neon Gen",
    description: "Футуристичный генератор случайных чисел и списков с неоновым интерфейсом. Гибкая настройка диапазона и мгновенная генерация результата.",
    descriptionEn: "A futuristic random number and list generator with a neon interface. Flexible range settings and instant results.",
    category: "web",
    categoryEn: "HTML / CSS / JS",
    url: "https://dixize.github.io/randomizer/",
    visual: "visual-random",
    sortOrder: 2,
  },
  {
    id: "seed-3",
    title: "Проектный офис",
    titleEn: "Project Office",
    description: "Корпоративный сайт-презентация для промышленной экосистемы: автоматизация, видеоаналитика и промышленный IoT в едином стильном интерфейсе.",
    descriptionEn: "A corporate presentation site for an industrial ecosystem: automation, video analytics and industrial IoT in one cohesive interface.",
    category: "web",
    categoryEn: "Corporate",
    url: "https://dixize.github.io/asdwqe/",
    visual: "visual-office",
    sortOrder: 3,
  },
  {
    id: "seed-4",
    title: "Ultra Tech",
    titleEn: "Ultra Tech",
    description: "Интернет-магазин премиальной техники с каталогом товаров, корзиной и продуманным пользовательским путём от выбора до покупки.",
    descriptionEn: "An online store for premium electronics with a product catalogue, cart, and a carefully designed path from browsing to checkout.",
    category: "store",
    categoryEn: "E-commerce",
    url: "https://dixize.github.io/dixize_store_web/",
    visual: "visual-store",
    sortOrder: 4,
  },
];

export async function getProjects(): Promise<ProjectDTO[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (projects.length === 0) return DEFAULT_PROJECTS;
    return projects;
  } catch {
    // DB not configured yet — fall back to the original four projects.
    return DEFAULT_PROJECTS;
  }
}
