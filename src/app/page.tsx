import { getProjects } from "@/lib/projects";
import PortfolioSection from "@/components/PortfolioSection";
import Configurator from "@/components/Configurator";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <section className="hero-section">
        <p className="hero-eyebrow reveal-word" data-i18n="hero.eyebrow">
          Веб-разработчик · HTML / CSS / JS
        </p>

        <h1 className="main-headline">
          <span className="headline-line reveal-line" data-i18n="hero.headline">
            Создаю премиальные интерфейсы и веб-приложения
          </span>
        </h1>

        <p className="hero-lead-text reveal-fade" data-i18n="hero.lead">
          Разрабатываю адаптивные, быстрые и современные сайты с глубокой интеграцией
          автоматизации и интерактивных элементов.
        </p>

        <div className="hero-button-group reveal-fade">
          <a href="#contact" className="action-btn btn-prime" data-i18n="hero.ctaPrimary">
            Рассчитать стоимость
          </a>
          <a href="#portfolio" className="action-btn btn-glass" data-i18n="hero.ctaSecondary">
            Смотреть работы
          </a>
        </div>

        <div className="hero-tags reveal-fade">
          <span className="hero-tag">
            <i className="tag-dot"></i>
            <span data-i18n="hero.tag1">Чистый ванильный код</span>
          </span>
          <span className="hero-tag">
            <i className="tag-dot"></i>
            <span data-i18n="hero.tag2">Telegram-автоматизация</span>
          </span>
          <span className="hero-tag">
            <i className="tag-dot tag-dot-live"></i>
            <span data-i18n="hero.tag3">Открыт к новым проектам</span>
          </span>
        </div>

        <a href="#advantages" className="hero-scroll-indicator" aria-hidden="true">
          <span data-i18n="hero.scroll">Листайте вниз</span>
          <i className="scroll-line"></i>
        </a>
      </section>

      <section id="advantages" className="advantages-section scroll-reveal">
        <div className="section-container">
          <div className="advantages-head text-center">
            <span className="meta-tag" data-i18n="adv.eyebrow">ПОЧЕМУ Я</span>
            <h2 className="section-title" data-i18n="adv.title">Три главных плюса</h2>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card scroll-reveal">
              <div className="adv-icon">⚡</div>
              <h3 data-i18n="adv.speed.title">Высокая скорость</h3>
              <p data-i18n="adv.speed.text">
                Оптимизированный чистый код без тяжелых библиотек. Молниеносная загрузка на любых
                устройствах.
              </p>
            </div>
            <div className="advantage-card scroll-reveal">
              <div className="adv-icon">📱</div>
              <h3 data-i18n="adv.responsive.title">Адаптивность</h3>
              <p data-i18n="adv.responsive.text">
                Идеальное отображение как на огромных 4K мониторах, так и на экранах старых
                смартфонов.
              </p>
            </div>
            <div className="advantage-card scroll-reveal">
              <div className="adv-icon">🤖</div>
              <h3 data-i18n="adv.automation.title">Автоматизация</h3>
              <p data-i18n="adv.automation.text">
                Прямая интеграция с backend-логикой и мессенджерами. Получайте уведомления и ТЗ от
                клиентов мгновенно.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section scroll-reveal">
        <div className="section-container">
          <div className="layout-about-grid">
            <div className="about-visual-panel">
              <span className="about-visual-label" data-i18n="about.stackLabel">
                Стек, с которым я работаю
              </span>
              <div className="tech-stack-marquee">
                <div className="tech-stack-track">
                  <span className="stack-badge">HTML5</span>
                  <span className="stack-badge">CSS3</span>
                  <span className="stack-badge">JavaScript</span>
                  <span className="stack-badge">TypeScript</span>
                  <span className="stack-badge">Next.js</span>
                  <span className="stack-badge">React</span>
                  <span className="stack-badge">Prisma</span>
                  <span className="stack-badge">PostgreSQL</span>
                  <span className="stack-badge">UI / UX Animation</span>
                  <span className="stack-badge">Git / GitHub</span>
                  <span className="stack-badge" aria-hidden="true">HTML5</span>
                  <span className="stack-badge" aria-hidden="true">CSS3</span>
                  <span className="stack-badge" aria-hidden="true">JavaScript</span>
                  <span className="stack-badge" aria-hidden="true">TypeScript</span>
                  <span className="stack-badge" aria-hidden="true">Next.js</span>
                  <span className="stack-badge" aria-hidden="true">React</span>
                  <span className="stack-badge" aria-hidden="true">Prisma</span>
                  <span className="stack-badge" aria-hidden="true">PostgreSQL</span>
                  <span className="stack-badge" aria-hidden="true">UI / UX Animation</span>
                  <span className="stack-badge" aria-hidden="true">Git / GitHub</span>
                </div>
              </div>
            </div>
            <div className="about-info-panel">
              <span className="meta-tag" data-i18n="about.eyebrow">ПОРТРЕТ РАЗРАБОТЧИКА</span>
              <h2 className="section-title" data-i18n="about.title">
                Создаю проекты, которые работают на вас
              </h2>
              <p className="about-bio-p" data-i18n="about.text">
                Я занимаюсь веб-разработкой и созданием интерактивных сайтов. В каждый проект
                закладываю кастомную анимацию, плавные переходы и продуманную логику. Использую
                современные возможности JavaScript и TypeScript для реализации задач любой
                сложности — от лендингов и корпоративных сайтов до интернет-магазинов.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PortfolioSection projects={projects} />

      <section id="contact" className="contact-section scroll-reveal">
        <div className="section-container">
          <div className="form-container-box">
            <Configurator />
          </div>
        </div>
      </section>
    </>
  );
}
