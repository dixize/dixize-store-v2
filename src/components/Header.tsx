"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

interface Me {
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export default function Header() {
  const { lang, t, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data?.user ?? null))
      .catch(() => setMe(null));
  }, []);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.getElementById("burger-toggle")?.classList.toggle("active", next);
    document.getElementById("burger-toggle")?.setAttribute("aria-expanded", String(next));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.getElementById("burger-toggle")?.classList.remove("active");
    document.getElementById("burger-toggle")?.setAttribute("aria-expanded", "false");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    closeMenu();
    window.location.href = "/";
  };

  const navItems = [
    { href: "/#advantages", key: "nav.advantages" },
    { href: "/#about", key: "nav.about" },
    { href: "/#portfolio", key: "nav.portfolio" },
    { href: "/#contact", key: "nav.contact" },
  ];

  const authLinks = me ? (
    <>
      {me.role === "ADMIN" && (
        <Link href="/admin" className="nav-link-item" onClick={closeMenu}>
          {t("nav.admin")}
        </Link>
      )}
      <Link href="/account" className="nav-link-item" onClick={closeMenu}>
        {t("nav.account")}
      </Link>
      <button
        type="button"
        onClick={logout}
        className="nav-link-item"
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
      >
        {t("nav.logout")}
      </button>
    </>
  ) : (
    <Link href="/login" className="nav-link-item" onClick={closeMenu}>
      {t("nav.login")}
    </Link>
  );

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            dixize<span>.store</span>
          </Link>

          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="nav-link-item" data-section={item.key === "nav.advantages" ? "advantages" : item.key === "nav.about" ? "about" : item.key === "nav.portfolio" ? "portfolio" : "contact"}>
                  <span data-i18n={item.key}>{t(item.key)}</span>
                </Link>
              </li>
            ))}
            <li className="nav-auth-desktop">{authLinks}</li>
          </ul>

          <div className="nav-controls">
            <div className="lang-switch" role="group" aria-label="Language switch">
              <span className="lang-switch-indicator" data-active-lang={lang} aria-hidden="true"></span>
              <button
                type="button"
                className={`lang-switch-btn ${lang === "ru" ? "active" : ""}`}
                aria-pressed={lang === "ru"}
                onClick={() => setLang("ru")}
              >
                RU
              </button>
              <button
                type="button"
                className={`lang-switch-btn ${lang === "en" ? "active" : ""}`}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
            <button
              id="burger-toggle"
              className={`burger-toggle ${menuOpen ? "active" : ""}`}
              aria-label={t("nav.menuLabel")}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-nav-overlay" className={`mobile-nav-overlay ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="mobile-nav-link" onClick={closeMenu}>
                <span data-i18n={item.key}>{t(item.key)}</span>
              </Link>
            </li>
          ))}
          {me && (
            <li>
              <Link href="/account" className="mobile-nav-link" onClick={closeMenu}>
                {t("nav.account")}
              </Link>
            </li>
          )}
          {me?.role === "ADMIN" && (
            <li>
              <Link href="/admin" className="mobile-nav-link" onClick={closeMenu}>
                {t("nav.admin")}
              </Link>
            </li>
          )}
          <li>
            {me ? (
              <button
                type="button"
                onClick={logout}
                className="mobile-nav-link"
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%" }}
              >
                {t("nav.logout")}
              </button>
            ) : (
              <Link href="/login" className="mobile-nav-link" onClick={closeMenu}>
                {t("nav.login")}
              </Link>
            )}
          </li>
        </ul>
        <div className="lang-switch lang-switch-mobile" role="group" aria-label="Language switch">
          <span className="lang-switch-indicator" data-active-lang={lang} aria-hidden="true"></span>
          <button
            type="button"
            className={`lang-switch-btn ${lang === "ru" ? "active" : ""}`}
            aria-pressed={lang === "ru"}
            onClick={() => setLang("ru")}
          >
            RU
          </button>
          <button
            type="button"
            className={`lang-switch-btn ${lang === "en" ? "active" : ""}`}
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </nav>
    </>
  );
}
