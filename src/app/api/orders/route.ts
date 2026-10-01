import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isProjectType, normalizeAddons, calcPrice } from "@/lib/pricing";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const projectType = body.projectType;
    if (!isProjectType(projectType)) {
      return NextResponse.json({ error: "invalid_type" }, { status: 400 });
    }

    // The price is always recomputed server-side.
    const addons = normalizeAddons(projectType, body.addons);
    const totalPrice = calcPrice(projectType, addons);
    const comment = body.comment ? String(body.comment).slice(0, 2000) : null;

    const order = await prisma.order.create({
      data: {
        userId: session.sub,
        projectType,
        addons,
        comment,
        totalPrice,
      },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
