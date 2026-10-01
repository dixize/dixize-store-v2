import type { Metadata } from "next";
import "./globals.css";
import LanguageProvider from "@/components/LanguageProvider";
import SiteFx from "@/components/SiteFx";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "dixize.store — Разработка сайтов и веб-интерфейсов",
  description:
    "Разработка адаптивных сайтов, лендингов и интернет-магазинов на современном стеке с продуманной анимацией.",
  alternates: { canonical: "https://dixize-store-web.vercel.app/" },
  openGraph: {
    type: "website",
    url: "https://dixize-store-web.vercel.app/",
    siteName: "dixize.store",
    title: "dixize.store — Разработка сайтов и веб-интерфейсов",
    description:
      "Разработка адаптивных сайтов, лендингов и интернет-магазинов с продуманной анимацией.",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a href="#main-content" className="skip-link" data-i18n="skip.content">
          Перейти к содержанию
        </a>

        <LanguageProvider>
          <div id="scroll-progress-bar"></div>
          <Preloader />
          <SiteFx />

          <div className="custom-cursor-dot" aria-hidden="true"></div>
          <div className="custom-cursor-ring" aria-hidden="true"></div>

          <div className="glow-ambience" aria-hidden="true">
            <div className="bg-grid-layer"></div>
            <div className="bg-noise-layer"></div>
            <div className="glow-sphere glow-sphere-1"></div>
            <div className="glow-sphere glow-sphere-2"></div>
            <div className="glow-sphere glow-sphere-3"></div>
          </div>

          <Header />

          <main id="main-content">{children}</main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
