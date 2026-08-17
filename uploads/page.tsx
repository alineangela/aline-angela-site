"use client";

import { useEffect, useRef, useState } from "react";

const menuLogoSrc = "/aline-angela-menu-icon.png";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export default function Home() {
  const shellRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateLogo = () => {
      const animationDistance = Math.max(window.innerHeight * 0.52, 360);
      const progress = clamp(window.scrollY / animationDistance);
      const easedLogoProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      shellRef.current?.style.setProperty("--logo-progress", String(easedLogoProgress));
      shellRef.current?.style.setProperty("--large-logo-opacity", String(clamp(1 - progress * 1.85)));
      shellRef.current?.style.setProperty("--menu-logo-opacity", String(clamp((progress - 0.46) / 0.24)));
      frame = 0;
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 100);
      if (!frame) frame = window.requestAnimationFrame(updateLogo);
    };

    updateLogo();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main id="top" className="site-shell" ref={shellRef}>
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="header-bar">
          <a className="brand" href="/inicio" aria-label="Aline Angela inicio">
            <img alt="Aline Angela" src={menuLogoSrc} />
          </a>
          <nav className="nav main-nav" aria-label="Navegacao principal">
            <a className="nav-trigger" href="/sobre">SOBRE</a>
            <a className="nav-trigger" href="/blog">JOURNAL</a>
          </nav>
          <a aria-label="Buscar conteudos" className="search-trigger" href="/busca">
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <line x1="13.1" y1="13.1" x2="18" y2="18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
            </svg>
          </a>
        </div>
      </header>

      <section className="hero-logo-scroll">
        <div className="hero-pin">
          <span aria-hidden="true" className="hero-logo-large">
            <span className="hero-script hero-script-left">Aline</span>
            <span className="hero-script hero-script-right">Angela</span>
          </span>
        </div>
      </section>

      <section className="editorial-proof" aria-label="Imagem com marca Aline Angela">
        <div className="proof-image-panel">
          <img alt="Praia em preto e branco" className="proof-photo" src="/shoreline-black-white.jpg" />
          <img alt="" aria-hidden="true" className="proof-mark" src="/aline-angela-monogram.svg" />
        </div>
        <div className="proof-copy">
          <p className="proof-kicker">our clients say the nicest things</p>
          <blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae lectus sed neque volutpat gravida. Integer vel ante at libero dictum porta, sed posuere nibh.</p></blockquote>
        </div>
      </section>

      <section className="editorial-proof editorial-proof-inverted" aria-label="Imagem dentro da mascara Aline Angela">
        <div className="proof-image-panel proof-image-panel-inverted" role="img" aria-label="Praia em preto e branco exibida dentro do simbolo Aline Angela">
          <div className="proof-photo-mask" aria-hidden="true" />
        </div>
        <div className="proof-copy">
          <p className="proof-kicker">inverted mask test</p>
          <blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae lectus sed neque volutpat gravida. Integer vel ante at libero dictum porta, sed posuere nibh.</p></blockquote>
        </div>
      </section>
    </main>
  );
}
