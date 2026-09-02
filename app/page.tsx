'use client';

/* =============================================================================
   PILATES STUDIO — jednofajlni klon layouta pilateswithharriet.com
   -----------------------------------------------------------------------------
   ŠTA KLIJENT MIJENJA (sve je na jednom mjestu, odmah ispod):
     1. STUDIO_NAME            -> pravi naziv studija
     2. FOUNDER_NAME           -> ime instruktora / osnivača
     3. INSTAGRAM_HANDLE       -> pravi handle
     4. EMAIL_SUBMIT_ENDPOINT  -> pravi endpoint za newsletter / booking
     5. IMAGE_PLACEHOLDER_1..16 -> prave slike (vidi <Ph /> komponentu)
     6. Tekstove u konstantama LIST_ITEMS, FEATURES_*, TESTIMONIALS, CLASS_TYPES

   Bez eksternih zavisnosti osim Reacta. Sav CSS je u konstanti CSS na dnu fajla.
   ========================================================================== */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------- KONFIG -- */

const STUDIO_NAME = '[STUDIO_NAZIV]';
const STUDIO_TAGLINE = 'Poveži · Oblikuj · Ojačaj';
const FOUNDER_NAME = '[IME_INSTRUKTORA]';
const INSTAGRAM_HANDLE = '@[INSTAGRAM_HANDLE]';
const EMAIL_SUBMIT_ENDPOINT = '[EMAIL_SUBMIT_ENDPOINT]';

const NAV_LEFT = [
  { label: 'O studiju', href: '#about' },
  { label: 'Upoznaj ' + FOUNDER_NAME, href: '#meet' },
];

const NAV_RIGHT = [
  { label: 'Virtuelni studio', href: '#classes' },
  { label: 'Časovi uživo', href: '#classes' },
];

const NAV_ALL = [
  { label: 'Početna', href: '#top' },
  { label: 'Započni probni period', href: '#booking' },
  { label: 'O studiju', href: '#about' },
  { label: 'Upoznaj ' + FOUNDER_NAME, href: '#meet' },
  { label: 'Virtuelni studio', href: '#classes' },
  { label: 'Časovi uživo', href: '#classes' },
  { label: 'Galerija', href: '#gallery' },
  { label: 'Kontakt', href: '#booking' },
];

const LIST_ITEMS = [
  'Biblioteka časova na zahtjev',
  'Mjesečni izazovi',
  'Časovi uživo svakog mjeseca',
  'Novi časovi svakog mjeseca',
  '7 dana besplatno',
];

const FEATURES_LEFT = [
  {
    title: 'Vježbajte bilo kada i bilo gdje',
    text: 'Pilates možete raditi kad god i gdje god želite. Kao da vam je najbolji studio na dohvat ruke.',
  },
  {
    title: 'Zabavni i efikasni pilates treninzi',
    text: 'Časovi osmišljeni da grade snagu i povezanost, za najbolji odnos s vlastitim tijelom.',
  },
];

const FEATURES_RIGHT = [
  {
    title: 'Novi pilates časovi svakog mjeseca',
    text: 'Online studio s raznovrsnim pilates treninzima, da svaki dan možete probati novi trening i izgraditi dosljednu praksu u svojoj rutini.',
  },
  {
    title: 'Mjesečni izazovi s nagradama',
    text: 'Osmišljeni da podignu vašu praksu na viši nivo i pomognu vam da ostanete dosljedni sebi, uz novu nagradu svakog mjeseca kada ih završite.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Časovi su mi najdraži dio dana. Smirena, pozitivna i ohrabrujuća energija čini da vrijeme proleti. Za samo tri mjeseca moja snaga i samopouzdanje su dramatično porasli.',
    name: '[IME_KLIJENTA_1]',
  },
  {
    quote:
      'Nakon rođenja drugog djeteta, povratak trbušne snage činio mi se nezamislivim. Nakon više od godinu dana treninga ovdje, jača sam i u boljoj formi nego prije djece.',
    name: '[IME_KLIJENTA_2]',
  },
  {
    quote:
      'Probala sam sve moguće treninge, od tegova do spinninga i trčanja, ali ništa mi nije dalo bolje rezultate ni više mira s vlastitim tijelom od ovih pilates časova.',
    name: '[IME_KLIJENTA_3]',
  },
  {
    quote:
      'I sama sam personalna trenerica pa sam se oduvijek smatrala jakom, ali ovo je viši nivo. Moji treninzi snage su se enormno popravili otkako dolazim ovdje.',
    name: '[IME_KLIJENTA_4]',
  },
  {
    quote:
      'Savršen spoj klasičnog i savremenog, a svaki čas je jedinstven uz poseban fokus na formu i poravnanje. Moja praksa se transformisala u posljednjih nekoliko mjeseci.',
    name: '[IME_KLIJENTA_5]',
  },
];

const CLASS_TYPES = [
  {
    id: 'tone',
    title: 'Oblikovanje i tonus',
    image: 6,
    text: 'Osmišljeni da ojačaju, oblikuju i poravnaju tijelo. Uživajte u sporom gorenju pilatesa i otkrijte mišiće za koje niste ni znali da postoje. Pogodno za sve nivoe.',
  },
  {
    id: 'stretch',
    title: 'Oblikovanje i istezanje',
    image: 7,
    text: 'Tijelo radi u harmoniji kada nađemo pravu ravnotežu snage i fleksibilnosti. Ovi časovi su osmišljeni upravo za to.',
  },
  {
    id: 'beginners',
    title: 'Za početnike',
    image: 8,
    text: 'Savršeno mjesto za početak vašeg pilates puta. Osnovni časovi koji poboljšavaju držanje, snagu i fleksibilnost, uz poseban fokus na formu, disanje i tehniku.',
  },
];

const GALLERY = [9, 10, 11, 12, 13, 14, 15, 16];

/* ------------------------------------------------------ POMOĆNE KOMPONENTE */

/**
 * Placeholder za sliku — klijent ga mijenja pravim <img> / next/image tagom.
 * Zadržava aspect-ratio originalne slike da layout ne skoči nakon zamjene.
 */
function Ph({
  n,
  className = '',
  style,
}: {
  n: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={'ph ' + className} style={style} role="img" aria-label={'Placeholder za sliku ' + n}>
      <span>IMAGE_PLACEHOLDER_{n}</span>
    </div>
  );
}

/** Fade-in na scroll — bez biblioteka, IntersectionObserver + jedna CSS klasa. */
function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      {dir === 'prev' ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/* --------------------------------------------------------------- STRANICA -- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [activeClass, setActiveClass] = useState(CLASS_TYPES[0].id);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const autoplay = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollReveal();

  /* Zaključaj scroll dok je burger meni otvoren */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /* Esc zatvara meni */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Auto-rotacija testimonijala na 5 sekundi */
  const startAutoplay = useCallback(() => {
    if (autoplay.current) clearInterval(autoplay.current);
    autoplay.current = setInterval(() => {
      setSlide((s) => (s + 1) % TESTIMONIALS.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplay.current) clearInterval(autoplay.current);
    };
  }, [startAutoplay]);

  const goTo = (i: number) => {
    setSlide((i + TESTIMONIALS.length) % TESTIMONIALS.length);
    startAutoplay();
  };

  const onSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    /* TODO klijent: POST na EMAIL_SUBMIT_ENDPOINT */
    setSent(true);
    setEmail('');
    window.setTimeout(() => setSent(false), 4000);
  };

  const activeClassData = CLASS_TYPES.find((c) => c.id === activeClass) ?? CLASS_TYPES[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <span id="top" />

      {/* ============================================================ HEADER == */}
      <header className="site-header">
        <nav className="nav-items">
          {NAV_LEFT.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="site-header__logo">
          <a href="#top">
            <span className="logo-word">{STUDIO_NAME}</span>
          </a>
        </div>
        <nav className="nav-items">
          {NAV_RIGHT.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ======================================================= BURGER MENU == */}
      <button
        type="button"
        className={'burger-button' + (menuOpen ? ' active' : '')}
        aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="burger-top" />
        <span className="burger-middle" />
        <span className="burger-bottom" />
      </button>

      <div className={'burger-menu' + (menuOpen ? ' active' : '')}>
        <a href="#top" className="logo-burger" onClick={() => setMenuOpen(false)}>
          <span className="logo-word">{STUDIO_NAME}</span>
        </a>
        {NAV_ALL.map((l) => (
          <a key={l.label} href={l.href} className="menu-text" onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>

      {/* Fiksni CTA dole desno — kao na originalu */}
      <a className="btn-signup" href="#booking">
        Započni probni period
      </a>

      <main>
        {/* ============================================================ HERO == */}
        <section className="hero">
          <Ph n={1} className="hero__bg" />
          <div className="hero__lockup" data-reveal>
            <h1 className="hero__logo">{STUDIO_NAME}</h1>
            <p className="hero__tagline">{STUDIO_TAGLINE}</p>
          </div>
        </section>

        {/* =============================================== STRENGTHEN / INTRO == */}
        <section className="intro" id="about">
          <div className="intro__inner" data-reveal>
            <h2 className="serif-heading">
              Ojačaj <span className="dot">•</span> Istegni <span className="dot">•</span>{' '}
              <span className="font-italic">Transformiši</span>
            </h2>
            <p className="sans-heading intro__lead">
              {STUDIO_NAME} stvara trajne, transformativne rezultate za vaše tijelo i um
            </p>
            <a href="#explore" className="btn">
              Istraži
            </a>
          </div>
        </section>

        {/* ================================================ TRANSFORM (BLUE) == */}
        <span id="explore" />
        <section className="transform bg-blue">
          <div className="container transform__grid">
            <div className="transform__col transform__col--head" data-reveal>
              <h2 className="serif-heading">
                <span className="font-italic">Online</span> pilates studio koji{' '}
                <span className="upper">transformiše</span> <span className="font-italic">vaše tijelo</span> i{' '}
                <span className="font-italic">um</span>
              </h2>
              <a className="btn hide-mobile" href="#booking">
                Započni probni period
              </a>
            </div>

            <div className="transform__col transform__col--list" data-reveal>
              <ul>
                {LIST_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="btn only-mobile" href="#booking">
                Započni probni period
              </a>
            </div>

            <div className="transform__col transform__col--img" data-reveal>
              <Ph n={2} className="transform__img" />
            </div>
          </div>
        </section>

        {/* ============================================= ON DEMAND / FEATURES == */}
        <section className="features">
          <div className="container features__grid">
            <div className="features__col" data-reveal>
              {FEATURES_LEFT.map((f) => (
                <div className="feature" key={f.title}>
                  <h3 className="feature__title">{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>

            <div className="features__col features__col--media" data-reveal>
              <Ph n={3} className="features__video" />
              <a href="#classes" className="btn">
                Istraži biblioteku
              </a>
            </div>

            <div className="features__col" data-reveal>
              {FEATURES_RIGHT.map((f) => (
                <div className="feature" key={f.title}>
                  <h3 className="feature__title">{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================== MEET FOUNDER == */}
        <section className="meet bg-sand" id="meet">
          <div className="container meet__grid">
            <div className="meet__portrait" data-reveal>
              <Ph n={4} className="aspect-portrait" />
            </div>

            <div className="meet__body">
              <h2 className="sans-heading meet__title" data-reveal>
                Upoznaj {FOUNDER_NAME}
              </h2>

              <div className="meet__text" data-reveal>
                <div>
                  <p>
                    Ovaj studio sam razvila kao mjesto za bijeg od pritisaka svakodnevice i povratak svom najboljem ja
                    — uz rezultate koji usput mijenjaju život.
                    <br />
                    <br />
                    S godinama iskustva u podučavanju i preko 100 klijenata iza sebe, naučila sam šta je to što stvara
                    veliku promjenu i trajne rezultate u tijelu.
                  </p>
                  <a href="#meet" className="btn meet__btn">
                    Više o {FOUNDER_NAME}
                  </a>
                </div>
                <div>
                  <p>
                    Moj pristup zdravlju je stvaranje nevjerovatnih, ali održivih rezultata koji vas ostavljaju
                    osnaženim i na strunjači i van nje.
                    <br />
                    <br />
                    Nikada me ne prestane fascinirati koliko su naša tijela zadivljujuća — uz pravi trening možete
                    postići sve.
                  </p>
                </div>
              </div>

              <div className="meet__wide" data-reveal>
                <Ph n={5} className="meet__wide-img" />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== TESTIMONIALS == */}
        <section className="testimonials" id="testimonials">
          <h2 className="sans-heading testimonials__title" data-reveal>
            Utisci klijenata
          </h2>

          <div className="slider" data-reveal>
            <button
              type="button"
              className="slider__arrow"
              onClick={() => goTo(slide - 1)}
              aria-label="Prethodni utisak"
            >
              <Arrow dir="prev" />
            </button>

            <div className="slider__viewport">
              <div className="slider__track" style={{ transform: 'translateX(-' + slide * 100 + '%)' }}>
                {TESTIMONIALS.map((t) => (
                  <figure className="slider__item" key={t.name}>
                    <blockquote className="slider__quote">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="slider__name">{t.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="slider__arrow"
              onClick={() => goTo(slide + 1)}
              aria-label="Sljedeći utisak"
            >
              <Arrow dir="next" />
            </button>
          </div>

          <div className="slider__dots">
            {TESTIMONIALS.map((t, i) => (
              <button
                type="button"
                key={t.name}
                className={'slider__dot' + (i === slide ? ' is-active' : '')}
                onClick={() => goTo(i)}
                aria-label={'Idi na utisak ' + (i + 1)}
              />
            ))}
          </div>

          <div>
            <a href="#classes" className="btn">
              Virtuelni studio
            </a>
          </div>
        </section>

        {/* ====================================================== CLASS TYPES == */}
        <section className="classes bg-blue" id="classes">
          <div className="container classes__grid">
            <div className="classes__nav" data-reveal>
              {CLASS_TYPES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={'sans-heading class-link' + (c.id === activeClass ? ' is-active' : '')}
                  onMouseEnter={() => setActiveClass(c.id)}
                  onFocus={() => setActiveClass(c.id)}
                  onClick={() => setActiveClass(c.id)}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div className="classes__content" data-reveal>
              <Ph n={activeClassData.image} className="classes__media" />
              <p>{activeClassData.text}</p>
              <a href="#booking" className="btn">
                Pogledaj raspored
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= GALLERY == */}
        <section className="gallery container" id="gallery">
          <a href="#gallery" className="gallery__handle">
            <h2>{INSTAGRAM_HANDLE}</h2>
          </a>
          <div className="gallery__grid">
            {GALLERY.map((n) => (
              <a href="#gallery" className="gallery__item" key={n} data-reveal>
                <Ph n={n} className="aspect-square" />
              </a>
            ))}
          </div>
        </section>

        {/* ========================================================= BOOKING == */}
        <section className="booking bg-sand" id="booking">
          <div className="container booking__inner" data-reveal>
            <h2 className="serif-heading">
              Spremni za <span className="font-italic">početak?</span>
            </h2>
            <p className="booking__lead">
              Saznajte prvi za nove časove, treninge uživo i posebne događaje. Vaših 7 besplatnih dana počinje ovdje.
            </p>

            <form className="booking__form" action={EMAIL_SUBMIT_ENDPOINT} method="post" onSubmit={onSubscribe}>
              <label className="visually-hidden" htmlFor="email">
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Vaša email adresa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn--solid">
                Započni probni period
              </button>
            </form>

            <p className="booking__note" role="status">
              {sent ? 'Hvala — provjerite svoj inbox.' : ' '}
            </p>
          </div>
        </section>
      </main>

      {/* ============================================================ FOOTER == */}
      <footer className="footer bg-blue">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="logo-word logo-word--lg">{STUDIO_NAME}</span>
          </div>

          <nav className="footer__nav">
            {NAV_ALL.map((l) => (
              <a key={l.label} href={l.href} className="nav-footer">
                {l.label}
              </a>
            ))}
            <a href="#booking" className="nav-footer">
              Privatnost
            </a>
            <a href="#booking" className="nav-footer">
              Uslovi korištenja
            </a>
          </nav>

          <div className="footer__social">
            <h3 className="footer__social-title">Pratite nas</h3>
            <div className="footer__icons">
              <a href="#gallery" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.2c0-.9.3-1.5 1.5-1.5h1.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H7.5v3h2.8v8h3.2z" />
                </svg>
              </a>
              <a href="#gallery" aria-label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#gallery" aria-label="TikTok">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M16.5 3c.3 1.8 1.4 3.2 3.2 3.5v2.6c-1.2.1-2.4-.2-3.4-.9v5.9c0 3.3-2.6 5.9-5.9 5.9s-5.9-2.6-5.9-5.9 2.6-5.9 5.9-5.9c.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1a3.1 3.1 0 1 0 3.1 3.1V3h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__copy">
          <p>
            © <span>{new Date().getFullYear()}</span> {STUDIO_NAME}. Sva prava zadržana.
          </p>
        </div>
      </footer>
    </>
  );
}

/* =============================================================== STILOVI == */
/* Mobile-first. Prelomne tačke: 768px (tablet), 1024px i 1280px (desktop).   */

const CSS = `
/* EB Garamond, self-hostovan — ima sva naša slova (č ć ž š đ) i pravi italic rez.
   Podijeljen na latin i latin-ext: browser skida latin-ext samo ako stranica
   zaista koristi ta slova. */

@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Regular-latin-ext.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
    U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113,
    U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Regular-latin.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
    U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Italic-latin-ext.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
    U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113,
    U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Italic-latin.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
    U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root {
  --blue: #d5dfdf;
  --sand: #e6ded2;
  --light: #f6f5f4;
  --dark: #29271a;
  --line: #282919;
  --ph: #d0d0d0;
  --ph-ink: #999999;
  --serif: 'EB Garamond', Garamond, 'Times New Roman', Times, serif;
  --sans: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background-color: var(--light);
  color: var(--dark);
  font-family: var(--sans);
  font-weight: 300;
  font-size: 17.5px;
  line-height: 22px;
  word-spacing: 1px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 { font-weight: 300; margin: 0; }
p { margin: 0 0 1rem; }
a { color: inherit; text-decoration: none; }
img, svg { max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
ul { margin: 0; padding: 0; }

.container { width: 100%; max-width: 1280px; margin-left: auto; margin-right: auto; }
.bg-blue { background-color: var(--blue); }
.bg-sand { background-color: var(--sand); }
.font-italic { font-style: italic; }
.upper { text-transform: uppercase; }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
/* ---------------------------------------------------------- tipografija -- */

/* Veličine kao na originalu — EB Garamond je normalne širine, pa mu ne treba
   kompenzacija koju je tražio uski ITC Garamond Narrow. */
.serif-heading {
  font-family: var(--serif);
  font-size: 1.575rem;
  line-height: 1.05;
  -webkit-font-smoothing: antialiased;
}
@media (min-width: 768px) { .serif-heading { font-size: 1.975rem; } }
@media (min-width: 1280px) { .serif-heading { font-size: 2.3rem; } }

.sans-heading {
  font-family: var(--sans);
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 32px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
@media (min-width: 1024px) { .sans-heading { font-size: 1.7rem; line-height: 39px; } }

.dot { color: var(--blue); margin: 0 0.25rem; }
@media (min-width: 768px) { .dot { margin: 0 0.5rem; } }

/* -------------------------------------------------------------- dugmad -- */

.btn {
  display: inline-block;
  border: 1px solid var(--line);
  border-radius: 50%;
  padding: 0.35rem 2rem;
  font-family: var(--sans);
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-transform: uppercase;
  color: var(--dark);
  background: transparent;
  transition: background-color 0.35s ease, color 0.35s ease, transform 0.35s ease;
}
.btn:hover, .btn:focus-visible { background-color: var(--dark); color: var(--light); transform: scale(1.04); }
.btn--solid { background-color: var(--dark); color: var(--light); }
.btn--solid:hover { background-color: transparent; color: var(--dark); }

.btn-signup {
  position: fixed;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 900;
  border: 1px solid var(--line);
  border-radius: 50%;
  background-color: var(--blue);
  color: var(--dark);
  padding: 0.45rem 2rem;
  font-family: var(--sans);
  font-size: 10px;
  text-transform: uppercase;
  transition: transform 0.25s ease, background-color 0.3s ease;
}
@media (min-width: 768px) { .btn-signup { right: 1rem; bottom: 1rem; } }
@media (min-width: 1024px) { .btn-signup { font-size: 16px; } }
.btn-signup:hover { transform: scale(1.05); }

/* -------------------------------------------------------------- header -- */

.site-header { display: none; }
@media (min-width: 768px) {
  .site-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 60;
    padding: 2rem 3rem;
  }
}
.nav-items {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  font-family: var(--sans);
  font-size: 0.8rem;
  text-transform: uppercase;
}
.nav-items a { position: relative; padding-bottom: 2px; }
.nav-items a::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background-color: currentColor;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s ease;
}
.nav-items a:hover::after { transform: scaleX(1); }
.site-header__logo { text-align: center; }

.logo-word {
  font-family: var(--serif);
  font-size: 1.6rem;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.logo-word--lg { font-size: 2.2rem; }

/* -------------------------------------------------------- burger meni -- */

.burger-button {
  position: fixed;
  top: 25px;
  right: 12px;
  z-index: 5000;
  width: 51px;
  height: 34px;
  display: block;
}
@media (min-width: 768px) { .burger-button { display: none; } }
.burger-button span {
  position: absolute;
  left: 8px;
  width: 35px;
  height: 2px;
  background-color: #000000;
  border-radius: 22px;
  display: block;
  transition: transform 0.4s ease, opacity 0.3s ease, top 0.3s ease;
}
.burger-top { top: 8px; }
.burger-middle { top: 16px; }
.burger-bottom { top: 24px; }
.burger-button.active .burger-top { top: 16px; transform: rotate(45deg); }
.burger-button.active .burger-middle { opacity: 0; }
.burger-button.active .burger-bottom { top: 16px; transform: rotate(-45deg); }

.burger-menu {
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(230, 222, 210, 0.96);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.burger-menu.active { opacity: 1; pointer-events: auto; }
.burger-menu a { padding: 0.5rem 2rem; white-space: nowrap; opacity: 0; transition: opacity 0.4s linear; }
.burger-menu.active a { opacity: 1; transition: opacity 1s linear 0.25s; }
.logo-burger { position: absolute; top: 18px; left: 50%; transform: translateX(-50%); }
.menu-text {
  font-family: var(--sans);
  font-size: 1.2rem;
  color: #000000;
  text-transform: uppercase;
  margin: 0.35rem 0;
}

/* ------------------------------------------------------- placeholderi -- */

.ph {
  background-color: var(--ph);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.ph span {
  color: var(--ph-ink);
  font-family: var(--sans);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-align: center;
  padding: 0.5rem;
}
.aspect-square { aspect-ratio: 1 / 1; }
.aspect-portrait { aspect-ratio: 3 / 4; }

/* ----------------------------------------------------- scroll animacije -- */

[data-reveal] {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);
}
[data-reveal].is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .btn, .btn-signup, .slider__track, .gallery__item .ph { transition: none; }
}

/* ---------------------------------------------------------------- hero -- */

.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}
@media (min-width: 768px) { .hero { align-items: center; } }
.hero__bg { position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%; }
.hero__bg span { align-self: flex-start; margin-top: 15vh; }
.hero__lockup { position: relative; z-index: 2; text-align: center; padding: 0 1.25rem; margin-top: 35vh; }
@media (min-width: 768px) { .hero__lockup { margin-top: 0; } }
.hero__logo {
  font-family: var(--serif);
  /* clamp da se dug naziv studija ne prelije preko ekrana na uskim telefonima */
  font-size: clamp(1.9rem, 9vw, 3rem);
  line-height: 1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  overflow-wrap: break-word;
  margin-bottom: 1rem;
}
@media (min-width: 768px) { .hero__logo { font-size: 5rem; } }
@media (min-width: 1280px) { .hero__logo { font-size: 7rem; } }
.hero__tagline {
  font-family: var(--sans);
  font-size: 0.8rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin: 0;
}

/* --------------------------------------------------------------- intro -- */

.intro { text-align: center; padding: 3rem 1.25rem; }
@media (min-width: 768px) { .intro { padding: 5rem; } }
@media (min-width: 1280px) { .intro { padding: 7rem 5rem; } }
.intro__inner { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40vh; }
@media (min-width: 1280px) { .intro__inner { min-height: 60vh; } }
.intro__lead { margin: 2rem auto; }
@media (min-width: 768px) { .intro__lead { max-width: 75%; margin: 3rem auto; } }
@media (min-width: 1024px) { .intro__lead { max-width: 42%; } }

/* ----------------------------------------------------------- transform -- */

.transform { padding: 3rem 1.25rem; }
@media (min-width: 768px) { .transform { padding: 5rem 2.5rem; } }
@media (min-width: 1024px) { .transform { padding: 3rem 2.5rem; } }
@media (min-width: 1280px) { .transform { padding: 3rem 5rem; } }

.transform__grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
@media (min-width: 768px) { .transform__grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }
@media (min-width: 1024px) { .transform__grid { grid-template-columns: repeat(3, 1fr); } }

.transform__col--head .serif-heading { margin-bottom: 2rem; }
@media (min-width: 1024px) {
  .transform__col--head { margin-top: 8rem; margin-left: 3rem; }
  .transform__col--head .serif-heading { max-width: 70%; margin-bottom: 3rem; }
}
@media (min-width: 1024px) { .transform__col--list { margin-top: 6rem; } }
@media (min-width: 1280px) { .transform__col--list { margin-top: 8rem; } }
.transform__col--list ul { margin-bottom: 2rem; }

.transform__col--img { display: flex; align-items: center; justify-content: center; }
@media (min-width: 768px) { .transform__col--img { grid-column: 1 / -1; } }
@media (min-width: 1024px) { .transform__col--img { grid-column: auto; } }
.transform__img { width: 100%; aspect-ratio: 3 / 4; }
@media (min-width: 768px) { .transform__img { aspect-ratio: 16 / 9; } }
@media (min-width: 1024px) { .transform__img { aspect-ratio: 1 / 1; } }

/* liste s plusom, kao na originalu */
.transform li {
  list-style-type: none;
  margin-bottom: 1.5rem;
  padding-left: 2.1em;
  text-indent: -1.1em;
  font-family: var(--sans);
  font-size: 1.15rem;
  line-height: 1.75rem;
  text-transform: uppercase;
}
.transform li::before {
  content: '+';
  display: inline-block;
  vertical-align: middle;
  font-weight: 100;
  font-size: 2.5rem;
  margin-right: 1rem;
}
@media (min-width: 768px) {
  .transform li { padding-left: 2.6em; text-indent: -1.6em; font-size: 1.25rem; }
  .transform li::before { margin-right: 2.5rem; }
}
@media (min-width: 1024px) {
  .transform li { padding-left: 2.1em; text-indent: -1.3em; }
  .transform li::before { font-size: 3rem; margin-right: 1.5rem; }
}

/* ------------------------------------------------------------ features -- */

.features { padding: 1rem 1.25rem 3rem; }
@media (min-width: 768px) { .features { padding: 0; } }
@media (min-width: 1280px) { .features { padding: 0 6rem; } }
.features__grid { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .features__grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px) { .features__col { padding: 2.5rem; } }
.feature { border-bottom: 1px solid #000000; }
.feature__title { font-size: 1rem; line-height: 1.5rem; text-transform: uppercase; margin: 2rem 0; }
@media (min-width: 768px) { .feature__title { margin-top: 5rem; } }
@media (min-width: 1024px) { .feature__title { margin-bottom: 4rem; } }
.feature p { margin-bottom: 3rem; }
.features__col--media {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  margin-top: 3rem;
}
.features__video { width: 100%; min-height: 70vh; }
@media (min-width: 768px) { .features__video { min-height: 45vh; } }
@media (min-width: 1280px) { .features__video { min-height: 80vh; } }

/* ---------------------------------------------------------------- meet -- */

@media (min-width: 1024px) { .meet { padding-top: 2.5rem; padding-left: 2.5rem; } }
.meet__grid { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .meet__grid { grid-template-columns: repeat(8, 1fr); } }
.meet__portrait { padding: 2.5rem 1.25rem 2rem; }
@media (min-width: 768px) { .meet__portrait { grid-column: span 4; padding: 2.5rem 2.5rem 2rem 1.25rem; } }
@media (min-width: 1024px) { .meet__portrait { grid-column: span 3; } }
@media (min-width: 1280px) { .meet__portrait { padding: 2.5rem; } }
.meet__body { padding: 0 1.25rem 2.5rem; }
@media (min-width: 768px) { .meet__body { grid-column: span 4; padding: 6rem 2.5rem 2.5rem; } }
@media (min-width: 1024px) { .meet__body { grid-column: span 5; padding-left: 0; padding-right: 5rem; } }
.meet__title { margin-bottom: 2rem; }
@media (min-width: 1024px) { .meet__title { margin-bottom: 3rem; } }
.meet__text { display: grid; grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1024px) { .meet__text { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }
.meet__text p { margin-bottom: 2rem; }
@media (min-width: 1024px) { .meet__text p { margin-bottom: 4rem; } }
.meet__btn { margin-bottom: 2rem; }
.meet__wide { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 2rem; }
.meet__wide-img { grid-column: 1 / -1; aspect-ratio: 16 / 9; }
@media (min-width: 1024px) { .meet__wide-img { grid-column: 2 / -1; } }

/* -------------------------------------------------------- testimonials -- */

.testimonials {
  display: grid;
  /* minmax(0, 1fr) a ne 1fr — inače se kolona raširi na širinu cijele trake slidera */
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  text-align: center;
  padding: 2.5rem 1.25rem;
}
@media (min-width: 768px) { .testimonials { padding: 3rem; } }
@media (min-width: 1024px) { .testimonials { padding: 9rem 5rem; } }
.testimonials__title { margin-bottom: 2rem; }
@media (min-width: 1024px) { .testimonials__title { margin-bottom: 5rem; } }

.slider { display: flex; align-items: center; gap: 0.25rem; width: 100%; max-width: 100%; margin: 0 auto 1.5rem; }
@media (min-width: 768px) { .slider { width: 80%; gap: 1rem; } }
@media (min-width: 1280px) { .slider { width: 58%; } }
.slider__viewport { overflow: hidden; flex: 1 1 auto; min-width: 0; }
.slider__track { display: flex; transition: transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); }
.slider__item { flex: 0 0 100%; margin: 0; padding: 0 0.5rem; }
.slider__quote {
  font-family: var(--serif);
  font-size: 1.35rem;
  line-height: 1.45;
  margin: 0 0 2rem;
}
@media (min-width: 768px) { .slider__quote { font-size: 1.65rem; } }
.slider__name { font-family: var(--sans); font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase; }
.slider__arrow {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  color: var(--dark);
  opacity: 0.55;
  padding: 0.5rem 0.25rem;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slider__arrow:hover { opacity: 1; transform: scale(1.15); }
.slider__dots { display: flex; gap: 0.5rem; margin-bottom: 2.5rem; }
.slider__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background-color: transparent; border: 1px solid var(--line);
  transition: background-color 0.3s ease;
}
.slider__dot.is-active { background-color: var(--dark); }

/* ------------------------------------------------------------- classes -- */

.classes { padding: 2.5rem 1.25rem; }
@media (min-width: 768px) { .classes { padding: 3rem 2.5rem; } }
@media (min-width: 1024px) { .classes { padding: 5rem 7rem; } }
.classes__grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .classes__grid { grid-template-columns: 3fr 4fr; gap: 2.5rem; } }
.classes__nav { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; }
@media (min-width: 768px) { .classes__nav { gap: 5rem; margin-top: 2rem; } }
.class-link { text-align: left; opacity: 0.5; transition: opacity 0.35s ease; }
.class-link.is-active, .class-link:hover { opacity: 1; }
.class-link::after {
  content: '';
  display: block; height: 1px;
  background-color: currentColor;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s ease;
}
.class-link.is-active::after { transform: scaleX(1); }
.classes__media { width: 100%; aspect-ratio: 16 / 9; margin-bottom: 1rem; }
.classes__content p { margin-bottom: 1.5rem; }

/* ------------------------------------------------------------- gallery -- */

.gallery { padding: 2.5rem 1.25rem; }
@media (min-width: 768px) { .gallery { padding: 6rem 1.25rem; } }
@media (min-width: 1280px) { .gallery { padding: 6rem 4rem; } }
.gallery__handle h2 { font-family: var(--serif); font-size: 1.875rem; margin-bottom: 1rem; }
.gallery__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .gallery__grid { grid-template-columns: repeat(4, 1fr); } }
.gallery__item { display: block; overflow: hidden; }
.gallery__item .ph { transition: transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1); }
.gallery__item:hover .ph { transform: scale(1.07); }

/* ------------------------------------------------------------- booking -- */

.booking { padding: 3rem 1.25rem; border-top: 1px solid #000000; }
@media (min-width: 768px) { .booking { padding: 6rem 2.5rem; } }
.booking__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.booking__lead { margin: 1.5rem auto 2.5rem; max-width: 36rem; }
.booking__form { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
@media (min-width: 768px) { .booking__form { flex-direction: row; justify-content: center; } }
.booking__form input {
  width: 100%;
  max-width: 22rem;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--line);
  padding: 0.6rem 0.25rem;
  font-family: var(--sans);
  font-size: 1rem;
  color: var(--dark);
}
.booking__form input::placeholder { color: rgba(41, 39, 26, 0.55); }
.booking__form input:focus { outline: none; border-bottom-width: 2px; }
.booking__note { margin-top: 1.25rem; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; min-height: 1.2em; }

/* -------------------------------------------------------------- footer -- */

.footer { border-top: 1px solid #000000; padding: 2rem; }
@media (min-width: 768px) { .footer { padding: 2.5rem; } }
@media (min-width: 1024px) { .footer { padding: 5rem 2.5rem 2rem; } }
.footer__grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
@media (min-width: 1024px) { .footer__grid { grid-template-columns: 1.2fr 1fr 0.8fr; gap: 2.5rem; } }
.footer__brand { display: flex; align-items: flex-end; }
.footer__nav { columns: 2; column-gap: 1rem; }
.nav-footer {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
}
.nav-footer:hover { opacity: 0.6; }
.footer__social-title { font-size: 0.8rem; font-weight: 500; text-transform: uppercase; margin-bottom: 1rem; }
.footer__icons { display: flex; gap: 1rem; }
.footer__icons a { transition: transform 0.3s ease; }
.footer__icons a:hover { transform: translateY(-3px); }
.footer__copy { margin-top: 2rem; display: flex; justify-content: flex-start; }
@media (min-width: 1024px) { .footer__copy { justify-content: flex-end; } }
.footer__copy p { font-size: 0.875rem; margin: 0; }

/* ------------------------------------------------------------ utilities -- */
/* Namjerno na kraju fajla: moraju da nadjačaju display iz .btn i sličnih.     */

.hide-mobile { display: none; }
.only-mobile { display: inline-block; }
@media (min-width: 768px) {
  .hide-mobile { display: inline-block; }
  .only-mobile { display: none; }
}
`;
