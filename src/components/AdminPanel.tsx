"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import OrderList, { type OrderDTO } from "./OrderList";
import type { ProjectDTO } from "@/lib/projects";

interface AdminOrder extends OrderDTO { clientName: string; clientEmail: string; }
interface AdminUser { id: string; email: string; name: string; role: string; createdAt: string; ordersCount: number; }

const EMPTY_FORM = { title: "", titleEn: "", description: "", descriptionEn: "", category: "web", categoryEn: "", url: "", visual: "visual-store", sortOrder: 0 };

export default function AdminPanel({ orders, users, projects: initial }: { orders: AdminOrder[]; users: AdminUser[]; projects: ProjectDTO[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<"orders" | "users" | "projects">("orders");
  const [projects, setProjects] = useState(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const changeStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, { method: "PATCH",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    router.refresh();
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    if (res.ok) { setForm(EMPTY_FORM); setEditingId(null); router.refresh(); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
    router.refresh();
  };

  const startEdit = (p: ProjectDTO) => {
    setEditingId(p.id);
    setForm({ title: p.title, titleEn: p.titleEn, description: p.description, descriptionEn: p.descriptionEn,
      category: p.category, categoryEn: p.categoryEn, url: p.url, visual: p.visual, sortOrder: p.sortOrder });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const f = (k: keyof typeof EMPTY_FORM) => ({
    value: String(form[k]),
    onChange: (e: React.ChangeEvent<any>) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <>
      <div className="admin-tabs">
        {(["orders", "users", "projects"] as const).map((x) => (
          <button key={x} className={`admin-tab ${tab === x ? "active" : ""}`} onClick={() => setTab(x)}>
            {t(`admin.tab.${x}`)}
          </button>
        ))}
      </div>

      {tab === "orders" && (orders.length ? (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>{t("orders.client")}</th><th>{t("orders.date")}</th><th>{t("orders.type")}</th><th>{t("orders.price")}</th><th>{t("orders.status")}</th></tr></thead>
            <tbody>{orders.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.clientName}</strong><br /><span style={{ fontSize: 12 }}>{o.clientEmail}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{t(`type.${o.projectType}.title`)}</td>
                <td><strong>{o.totalPrice} ₽</strong></td>
                <td>
                  <select className="status-select" value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                    {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <div className="data-table-wrap"><div className="empty-state">{t("admin.orders.empty")}</div></div>)}

      {tab === "users" && (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Email</th><th>{t("auth.name")}</th><th>{t("account.role")}</th><th>{t("orders.date")}</th><th>{t("admin.tab.orders")}</th></tr></thead>
            <tbody>{users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.email}</strong></td><td>{u.name}</td>
                <td><span className={`status-badge ${u.role === "ADMIN" ? "status-NEW" : "status-COMPLETED"}`}>{t(`account.role.${u.role}`)}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td><td>{u.ordersCount}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {tab === "projects" && (
        <>
          <form className="admin-form" onSubmit={saveProject}>
            <div className="admin-form-grid">
              <div className="input-wrapper"><label>{t("admin.projects.field.title")}</label><input required {...f("title")} /></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.titleEn")}</label><input {...f("titleEn")} /></div>
              <div className="input-wrapper full"><label>{t("admin.projects.field.description")}</label><textarea rows={2} required {...f("description")} /></div>
              <div className="input-wrapper full"><label>{t("admin.projects.field.descriptionEn")}</label><textarea rows={2} {...f("descriptionEn")} /></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.category")}</label>
                <select {...f("category")}><option value="web">web</option><option value="store">store</option></select></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.categoryEn")}</label><input {...f("categoryEn")} /></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.url")}</label><input {...f("url")} /></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.visual")}</label>
                <select {...f("visual")}>
                  {["visual-store", "visual-forest", "visual-office", "visual-random"].map((v) => <option key={v}>{v}</option>)}
                </select></div>
              <div className="input-wrapper"><label>{t("admin.projects.field.sortOrder")}</label><input type="number" {...f("sortOrder")} /></div>
            </div>
            <div className="wizard-nav">
              <button type="submit" className="action-btn btn-prime">{editingId ? t("admin.projects.save") : t("admin.projects.add")}</button>
              {editingId && <button type="button" className="action-btn btn-glass" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>{t("admin.projects.cancel")}</button>}
            </div>
          </form>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>{t("admin.projects.field.title")}</th><th>{t("admin.projects.field.category")}</th><th>#</th><th></th></tr></thead>
              <tbody>{projects.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td><td>{p.category}</td><td>{p.sortOrder}</td>
                  <td className="row-actions">
                    <button className="mini-btn" onClick={() => startEdit(p)}>{t("admin.projects.edit")}</button>
                    <button className="mini-btn danger" onClick={() => deleteProject(p.id)}>{t("admin.projects.delete")}</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}