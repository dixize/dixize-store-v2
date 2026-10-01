import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="nav-container footer-wrap">
        <div className="footer-brand">
          <Link href="/" className="brand-logo">
            dixize<span>.store</span>
          </Link>
          <p className="footer-text" data-i18n="footer.text">
            Разработка сайтов и веб-интерфейсов для бизнеса и личных проектов.
          </p>
          <span className="footer-status">
            <i className="tag-dot tag-dot-live"></i>
            <span data-i18n="footer.status">Открыт к новым проектам</span>
          </span>
        </div>
        <div className="footer-nav">
          <a href="/#advantages" data-i18n="nav.advantages">Преимущества</a>
          <a href="/#about" data-i18n="nav.about">Обо мне</a>
          <a href="/#portfolio" data-i18n="nav.portfolio">Портфолио</a>
          <a href="/#contact" data-i18n="nav.contact">Заказать</a>
        </div>
        <div className="footer-socials">
          <a href="https://github.com/Dixize" target="_blank" rel="noopener" className="social-link" data-i18n="footer.github">
            GitHub
          </a>
          <a href="#" className="social-link" data-i18n="footer.telegram">Telegram</a>
          <a href="#" className="social-link" data-i18n="footer.vk">ВКонтакте</a>
        </div>
      </div>
      <div className="nav-container">
        <p className="footer-copyright" data-i18n="footer.copyright">
          © 2026 dixize.store. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
