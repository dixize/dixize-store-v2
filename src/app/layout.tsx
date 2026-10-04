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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap"
        />
      </head>
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
            <div className="bg-grid-layer" data-parallax="0.05"></div>
            <div className="bg-noise-layer"></div>
            <div className="glow-sphere glow-sphere-1" data-parallax="0.12" data-parallax-x="-0.06"></div>
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
