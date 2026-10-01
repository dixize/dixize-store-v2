import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VISUALS = ["visual-store", "visual-forest", "visual-office", "visual-random"] as const;

function parseProject(body: any) {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  if (!title || !description) return null;
  const category = body.category === "store" ? "store" : "web";
  const visual = (VISUALS as readonly string[]).includes(body.visual)
    ? body.visual
    : "visual-store";
  const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
  return {
    title,
    titleEn: String(body.titleEn || "").trim(),
    description,
    descriptionEn: String(body.descriptionEn || "").trim(),
    category,
    categoryEn: String(body.categoryEn || "").trim(),
    url: String(body.url || "").trim(),
    visual,
    sortOrder,
  };
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  try {
    const data = parseProject(await req.json());
    if (!data) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    const project = await prisma.project.create({ data });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
