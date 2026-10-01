"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (mode === "register" && name.trim() === "") next.name = t("auth.name.error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t("auth.email.error");
    if (password.length < 6) next.password = t("auth.password.error");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "register" ? { name, email, password } : { email, password }),
      });
      if (res.ok) {
        router.push("/account");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.error === "invalid_credentials") setFormError(t("auth.error.invalid"));
      else if (data.error === "email_exists") setFormError(t("auth.error.exists"));
      else setFormError(t("auth.error.generic"));
    } catch {
      setFormError(t("auth.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container-box auth-card" noValidate onSubmit={onSubmit}>
      <div className="form-head text-center">
        <h2 className="section-title">{mode === "login" ? t("auth.login.title") : t("auth.register.title")}</h2>
      </div>

      {formError && <div className="auth-error">{formError}</div>}

      {mode === "register" && (
        <div className="input-wrapper">
          <label htmlFor="auth_name">{t("auth.name")}</label>
          <input
            type="text"
            id="auth_name"
            placeholder={t("auth.name.placeholder")}
            autoComplete="name"
            value={name}
            className={errors.name ? "invalid" : ""}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="custom-error-label" style={{ display: errors.name ? "block" : "none" }}>
            {errors.name}
          </span>
        </div>
      )}

      <div className="input-wrapper">
        <label htmlFor="auth_email">{t("auth.email")}</label>
        <input
          type="email"
          id="auth_email"
          placeholder={t("auth.email.placeholder")}
          autoComplete="email"
          value={email}
          className={errors.email ? "invalid" : ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="custom-error-label" style={{ display: errors.email ? "block" : "none" }}>
          {errors.email}
        </span>
      </div>

      <div className="input-wrapper">
        <label htmlFor="auth_password">{t("auth.password")}</label>
        <input
          type="password"
          id="auth_password"
          placeholder={t("auth.password.placeholder")}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          className={errors.password ? "invalid" : ""}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="custom-error-label" style={{ display: errors.password ? "block" : "none" }}>
          {errors.password}
        </span>
      </div>

      <button type="submit" className="action-btn btn-prime btn-wide" disabled={loading} style={loading ? { opacity: 0.7 } : undefined}>
        {loading ? "…" : mode === "login" ? t("auth.login.button") : t("auth.register.button")}
      </button>

      <p className="auth-switch">
        <Link href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? t("auth.login.link") : t("auth.register.link")}
        </Link>
      </p>
    </form>
  );
}
