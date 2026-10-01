"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export interface OrderDTO {
  id: string; projectType: string; addons: string[];
  comment: string | null; totalPrice: number;
  status: string; createdAt: string;
}

const STATUSES = ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function OrderList({ orders, isAdmin = false, onStatusChange }: {
  orders: OrderDTO[];
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: string) => Promise<void>;
}) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  if (orders.length === 0) {
    return <div className="data-table-wrap"><div className="empty-state">{t("account.orders.empty")}</div></div>;
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("orders.date")}</th>
            <th>{t("orders.type")}</th>
            <th>{t("orders.price")}</th>
            <th>{t("orders.status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <>
              <tr key={o.id}>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td><strong>{t(`type.${o.projectType}.title`)}</strong></td>
                <td><strong>{o.totalPrice} ₽</strong></td>
                <td>
                  {isAdmin && onStatusChange ? (
                    <select className="status-select" value={o.status}
                      onChange={(e) => onStatusChange(o.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                    </select>
                  ) : (
                    <span className={`status-badge status-${o.status}`}>{t(`status.${o.status}`)}</span>
                  )}
                </td>
                <td className="row-actions">
                  <button className="mini-btn" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                    {t("orders.details")}
                  </button>
                </td>
              </tr>
              {openId === o.id && (
                <tr key={`${o.id}-details`}>
                  <td colSpan={5}>
                    <div className="order-details">
                      <div className="price-summary-row"><span>{t("orders.addons")}</span>
                        <strong>{o.addons.length ? o.addons.map((a) => t(`addons.${a}.label`)).join(", ") : t("price.summaryNone")}</strong></div>
                      <div className="price-summary-row"><span>{t("orders.comment")}</span>
                        <strong>{o.comment || "—"}</strong></div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}