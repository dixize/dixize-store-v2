import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";
import type { ProjectDTO } from "@/lib/projects";

export const metadata = { title: "Админка — dixize.store" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [orders, users, projects] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { orders: true } } } }),
    prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  const projectDTOs: ProjectDTO[] = projects.map((p) => ({
    id: p.id, title: p.title, titleEn: p.titleEn, description: p.description,
    descriptionEn: p.descriptionEn, category: p.category, categoryEn: p.categoryEn,
    url: p.url, visual: p.visual, sortOrder: p.sortOrder,
  }));

  return (
    <div className="admin-page">
      <div className="section-container">
        <span className="meta-tag">dixize.store</span>
        <h1 className="section-title" data-i18n="admin.title" style={{ marginBottom: 30 }}>Панель администратора</h1>
        <AdminPanel
          orders={orders.map((o) => ({
            id: o.id, projectType: o.projectType, addons: o.addons, comment: o.comment,
            totalPrice: o.totalPrice, status: o.status, createdAt: o.createdAt.toISOString(),
            clientName: o.user.name, clientEmail: o.user.email,
          }))}
          users={users.map((u) => ({
            id: u.id, email: u.email, name: u.name, role: u.role,
            createdAt: u.createdAt.toISOString(), ordersCount: u._count.orders,
          }))}
          projects={projectDTOs}
        />
      </div>
    </div>
  );
}