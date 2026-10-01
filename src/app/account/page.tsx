import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import OrderList from "@/components/OrderList";

export const metadata = { title: "Аккаунт — dixize.store" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireUser();

  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[ACCOUNT ORDERS ERROR]", error);
  }

  const serialized = orders.map((o) => ({
    id: o.id,
    projectType: o.projectType,
    addons: o.addons,
    comment: o.comment,
    totalPrice: o.totalPrice,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="account-page">
      <div className="section-container">
        <div className="account-head">
          <div>
            <span className="meta-tag">dixize.store</span>

            <h1 className="section-title" data-i18n="account.title">
              Мой аккаунт
            </h1>

            <div className="account-meta">
              <span>
                {session.name} · {session.email}
              </span>
            </div>
          </div>

          <Link href="/#contact" className="action-btn btn-prime">
            Новая заявка
          </Link>
        </div>

        <OrderList orders={serialized} />
      </div>
    </div>
  );
}