"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import type { ProjectDTO } from "@/lib/projects";

const VISIBLE_BY_DEFAULT = 4;

export default function PortfolioSection({ projects }: { projects: ProjectDTO[] }) {
  const { lang, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(projects.length <= VISIBLE_BY_DEFAULT);
  const [revealed, setRevealed] = useState(false);

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((p) => filter === "all" || p.category === filter);
    return showAll ? filtered : filtered.slice(0, VISIBLE_BY_DEFAULT);
  }, [projects, filter, showAll]);

  const filteredCount = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter).length,
    [projects, filter]
  );

  useEffect(() => {
    if (!modalOpen) return;
    document.body.classList.add("modal-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Плавное появление карточек внутри модалки (как в исходном script.js)
    const timer = window.setTimeout(() => setRevealed(true), 60);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [modalOpen]);

  const localized = (p: ProjectDTO) => ({
    title: lang === "en" && p.titleEn ? p.titleEn : p.title,
    description: lang === "en" && p.descriptionEn ? p.descriptionEn : p.description,
    categoryLabel: lang === "en" && p.categoryEn ? p.categoryEn : p.category,
  });

  const filters = [
    { value: "all", key: "portfolio.filter.all" },
    { value: "web", key: "portfolio.filter.web" },
    { value: "store", key: "portfolio.filter.store" },
  ];

  return (
    <section id="portfolio" className="portfolio-section scroll-reveal">
      <div className="section-container">
        <div className="portfolio-teaser text-center">
          <span className="meta-tag" data-i18n="portfolio.eyebrow">{t("portfolio.eyebrow")}</span>
          <h2 className="section-title" data-i18n="portfolio.title">{t("portfolio.title")}</h2>
          <p className="portfolio-teaser-text" data-i18n="portfolio.text">{t("portfolio.text")}</p>

          <div className="portfolio-preview-strip" aria-hidden="true">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className={`preview-chip ${p.visual}`}></div>
            ))}
          </div>

          <button className="action-btn btn-prime" onClick={() => setModalOpen(true)}>
            <span data-i18n="portfolio.openBtn">{t("portfolio.openBtn")}</span>{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div id="portfolio-modal" className={`portfolio-modal ${modalOpen ? "" : "hidden"}`} role="dialog" aria-modal="true">
        <div className="portfolio-modal-backdrop" onClick={() => setModalOpen(false)}></div>
        <div className="portfolio-modal-panel">
          <div className="portfolio-modal-head">
            <h2 className="section-title" id="portfolio-modal-title" data-i18n="portfolio.modalTitle">
              {t("portfolio.modalTitle")}
            </h2>
            <button className="modal-close-btn" aria-label={t("portfolio.closeAria")} onClick={() => setModalOpen(false)}>
              ✕
            </button>
          </div>

          <div className="filter-controls" role="tablist">
            {filters.map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${filter === f.value ? "active" : ""}`}
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {t(f.key)}
              </button>
            ))}
          </div>

          <div className="portfolio-showcase-grid">
            {visibleProjects.map((p, i) => {
              const loc = localized(p);
              return (
                <div
                  key={p.id}
                  className={`portfolio-item-card ${revealed ? "scroll-reveal-active" : "js-prep"}`}
                  style={{ transitionDelay: `${i * 0.07}s` }}
                  data-category={p.category}
                >
                  <div className={`card-visual ${p.visual}`}>
                    <span className="tech-tag">{loc.categoryLabel}</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-project-title">{loc.title}</h3>
                    <p className="card-project-text">{loc.description}</p>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener" className="card-hyperlink">
                        <span>{t("portfolio.viewProject")}</span> <span aria-hidden="true">→</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {!showAll && filteredCount > VISIBLE_BY_DEFAULT && (
            <div className="portfolio-more-wrap">
              <button className="action-btn btn-glass" onClick={() => setShowAll(true)}>
                <span>{t("portfolio.showAll")}</span>{" "}
                <span className="show-all-count">(+{filteredCount - VISIBLE_BY_DEFAULT})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
