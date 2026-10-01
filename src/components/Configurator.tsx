"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type ProjectType = "landing" | "service" | "store";

const PRICING: Record<ProjectType, { base: number; tgAddon: number; animAddon: number; forcedAddons: boolean }> = {
  landing: { base: 2000, tgAddon: 500, animAddon: 0, forcedAddons: false },
  service: { base: 2400, tgAddon: 500, animAddon: 0, forcedAddons: false },
  store: { base: 3200, tgAddon: 0, animAddon: 0, forcedAddons: true },
};

const TYPE_EXAMPLES: Record<ProjectType, string> = {
  landing: "https://dixize.github.io/foressttt/",
  service: "https://dixize.github.io/asdwqe/",
  store: "https://dixize.github.io/dixize_store_web/",
};

export default function Configurator() {
  const { t } = useLanguage();

  const [currentType, setCurrentType] = useState<ProjectType>("landing");
  const [tgChecked, setTgChecked] = useState(false);
  const [animChecked, setAnimChecked] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [needAuth, setNeedAuth] = useState(false);
  const [success, setSuccess] = useState(false);

  const config = PRICING[currentType];
  const forced = config.forcedAddons;
  const total =
    config.base +
    (forced || tgChecked ? config.tgAddon : 0) +
    (forced || animChecked ? config.animAddon : 0);

  // Сброс чекбоксов при смене типа (для магазина модули принудительно включены)
  const selectType = (type: ProjectType) => {
    setCurrentType(type);
    if (!PRICING[type].forcedAddons) {
      setTgChecked(false);
      setAnimChecked(false);
    }
  };

  const validateStep3 = () => {
    let valid = true;
    if (name.trim() === "") {
      setNameError(t("form.name.error"));
      valid = false;
    }
    if (contact.trim() === "") {
      setContactError(t("form.contact.error"));
      valid = false;
    }
    return valid;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const addons: string[] = [];
      if (forced || tgChecked) addons.push("tg");
      if (forced || animChecked) addons.push("anim");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType: currentType, addons, comment }),
      });

      if (res.status === 401) {
        setNeedAuth(true);
        setSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSuccess(true);
    } catch {
      setSubmitError(t("submit.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const addonsSummary = () => {
    const list: string[] = [];
    if (forced || tgChecked) list.push(t("addons.tg.label"));
    if (forced || animChecked) list.push(t("addons.anim.label"));
    return list.length ? list.join(", ") : t("price.summaryNone");
  };

  if (success) {
    return (
      <div className="success-state-ui">
        <div className="success-radial-icon">✓</div>
        <h2 className="section-title" data-i18n="success.title">{t("success.title")}</h2>
        <p className="form-sub success-text" data-i18n="success.text">{t("success.text")}</p>
        <p className="auth-switch">
          <Link href="/account">{t("nav.account")} →</Link>
        </p>
      </div>
    );
  }

  return (
    <form id="portfolio-interactive-form" noValidate onSubmit={submit}>
      <div className="form-head text-center">
        <span className="meta-tag" data-i18n="config.eyebrow">{t("config.eyebrow")}</span>
        <h2 className="section-title" data-i18n="config.title">{t("config.title")}</h2>
        <p className="form-sub" data-i18n="config.subtitle">{t("config.subtitle")}</p>
      </div>

      <ol className="wizard-progress" aria-hidden="true">
        {[
          { n: 1, key: "config.step1.label" },
          { n: 2, key: "config.step2.label" },
          { n: 3, key: "config.step3.label" },
        ].map((step) => (
          <li
            key={step.n}
            className={`wizard-progress-item ${activeStep === step.n ? "active" : ""} ${activeStep > step.n ? "completed" : ""}`}
          >
            <span className="wizard-progress-num">0{step.n}</span>
            <span className="wizard-progress-label">{t(step.key)}</span>
          </li>
        ))}
      </ol>

      {activeStep === 1 && (
        <div className="config-step" data-step="1">
          <div className="config-selector-grid">
            {(Object.keys(PRICING) as ProjectType[]).map((type) => (
              <div
                key={type}
                className={`selector-tile ${currentType === type ? "active" : ""}`}
                data-type={type}
                tabIndex={0}
                role="button"
                aria-pressed={currentType === type}
                onClick={() => selectType(type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectType(type);
                  }
                }}
              >
                <h4>{t(`type.${type}.title`)}</h4>
                <p>{t(`type.${type}.text`)}</p>
                <a
                  href={TYPE_EXAMPLES[type]}
                  target="_blank"
                  rel="noopener"
                  className="tile-example-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t(`type.${type}.example`)}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="config-step" data-step="2">
          <label className="group-label" data-i18n="addons.groupLabel">{t("addons.groupLabel")}</label>
          <div className="addons-flex">
            <label className="addon-checkbox-label">
              <input
                type="checkbox"
                checked={forced || tgChecked}
                disabled={forced}
                onChange={(e) => setTgChecked(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
              <div>
                <strong data-i18n="addons.tg.label">{t("addons.tg.label")}</strong>
                <p className="addon-price-text">{forced ? t("addons.included") : `+${config.tgAddon} ₽`}</p>
              </div>
            </label>
            <label className="addon-checkbox-label">
              <input
                type="checkbox"
                checked={forced || animChecked}
                disabled={forced}
                onChange={(e) => setAnimChecked(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
              <div>
                <strong data-i18n="addons.anim.label">{t("addons.anim.label")}</strong>
                <p className="addon-price-text">{forced ? t("addons.included") : `+${config.animAddon} ₽`}</p>
              </div>
            </label>
          </div>

          <div className="price-counter-panel">
            <span className="counter-label" data-i18n="price.label">{t("price.label")}</span>
            <div className="counter-value" key={total}>
              <span>{total}</span> ₽
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="config-step" data-step="3">
          <label className="group-label" data-i18n="form.groupLabel">{t("form.groupLabel")}</label>
          <div className="form-row-split">
            <div className="input-wrapper">
              <label htmlFor="client_name" data-i18n="form.name.label">{t("form.name.label")}</label>
              <input
                type="text"
                id="client_name"
                placeholder={t("form.name.placeholder")}
                autoComplete="name"
                value={name}
                className={nameError ? "invalid" : ""}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
              />
              <span className="custom-error-label" style={{ display: nameError ? "block" : "none" }}>
                {nameError}
              </span>
            </div>
            <div className="input-wrapper">
              <label htmlFor="client_contact" data-i18n="form.contact.label">{t("form.contact.label")}</label>
              <input
                type="text"
                id="client_contact"
                placeholder={t("form.contact.placeholder")}
                autoComplete="tel"
                value={contact}
                className={contactError ? "invalid" : ""}
                onChange={(e) => {
                  setContact(e.target.value);
                  setContactError("");
                }}
              />
              <span className="custom-error-label" style={{ display: contactError ? "block" : "none" }}>
                {contactError}
              </span>
            </div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="client_task" data-i18n="form.comment.label">{t("form.comment.label")}</label>
            <textarea
              id="client_task"
              rows={4}
              placeholder={t("form.comment.placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="price-summary-panel">
            <div className="price-summary-row">
              <span data-i18n="price.summaryType">{t("price.summaryType")}</span>
              <strong>{t(`type.${currentType}.title`)}</strong>
            </div>
            <div className="price-summary-row">
              <span data-i18n="price.summaryAddons">{t("price.summaryAddons")}</span>
              <strong>{addonsSummary()}</strong>
            </div>
            <div className="price-summary-row price-summary-total">
              <span data-i18n="price.label">{t("price.label")}</span>
              <strong>{total} ₽</strong>
            </div>
          </div>

          {needAuth && (
            <div className="auth-error" style={{ marginTop: 16 }}>
              {t("submit.needAuth")}{" "}
              <Link href="/login" style={{ color: "inherit", fontWeight: 700 }}>
                {t("submit.loginLink")}
              </Link>
            </div>
          )}
          {submitError && (
            <div className="auth-error" style={{ marginTop: 16 }}>{submitError}</div>
          )}
        </div>
      )}

      <div className="wizard-nav">
        {activeStep > 1 && (
          <button type="button" className="action-btn btn-glass wizard-btn-back" onClick={() => setActiveStep(activeStep - 1)}>
            {t("config.back")}
          </button>
        )}
        {activeStep < 3 && (
          <button type="button" className="action-btn btn-prime wizard-btn-next" onClick={() => setActiveStep(activeStep + 1)}>
            {t("config.next")}
          </button>
        )}
        {activeStep === 3 && (
          <button type="submit" className="action-btn btn-prime btn-wide" disabled={submitting} style={submitting ? { pointerEvents: "none", opacity: 0.7 } : undefined}>
            <span className="btn-text">{submitting ? t("submit.sending") : t("submit.button")}</span>
            {submitting && <div className="spinner"></div>}
          </button>
        )}
      </div>
    </form>
  );
}
