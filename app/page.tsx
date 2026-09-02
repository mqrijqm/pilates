'use client';

/* =============================================================================
   SOLIS REFORMER PILATES — Banja Luka
   -----------------------------------------------------------------------------
   Cijela stranica je u ovom fajlu: markup, stanje i sav CSS (konstanta CSS na dnu).
   Bez eksternih zavisnosti osim Reacta.

   ŠTA JOŠ TREBA DOPUNITI (traži se u konstanti KONTAKT i dolje u TESTIMONIALS):
     - telefon, email, radno vrijeme
     - LINK_APLIKACIJE (booking aplikacija studija)
     - EMAIL_SUBMIT_ENDPOINT (gdje forma šalje podatke)
     - bio instruktorice (ime, certifikati)
   ========================================================================== */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------- KONFIG -- */

const STUDIO = 'Solis Reformer Pilates';
const INSTAGRAM = 'solisreformerbl';
const INSTAGRAM_URL = 'https://www.instagram.com/solisreformerbl';

const KONTAKT = {
  adresa: 'Vojvode Stepe Stepanovića 171F',
  grad: 'Banja Luka, BiH',
  telefon: '[TELEFON]',
  email: '[EMAIL]',
  radnoVrijeme: '[RADNO_VRIJEME]',
};

const LINK_APLIKACIJE = '[LINK_APLIKACIJE]';
const EMAIL_SUBMIT_ENDPOINT = '[EMAIL_SUBMIT_ENDPOINT]';

const NAV = [
  { label: 'Početna', href: '#pocetna' },
  { label: 'O studiju', href: '#o-studiju' },
  { label: 'Cjenovnik', href: '#cjenovnik' },
  { label: 'Instruktorica', href: '#instruktorica' },
  { label: 'Galerija', href: '#galerija' },
  { label: 'Kontakt', href: '#kontakt' },
];

/* Šest razloga — preuzeto sa grafike studija „Zašto sam počela sa pilatesom” */
const BENEFITI = [
  { naslov: 'Vrijeme za sebe', tekst: 'Pedeset minuta u kojima si nedostupna svima osim sebi.' },
  { naslov: 'Jače tijelo i veća fleksibilnost', tekst: 'Reformer radi sa tvojim tijelom, ne protiv njega — snaga dolazi bez udaraca po zglobovima.' },
  { naslov: 'Manje stresa, više mira', tekst: 'Disanje i kontrolisan pokret spuštaju napetost koju nosiš iz dana.' },
  { naslov: 'Osjećaj lakoće nakon svakog treninga', tekst: 'Izlaziš duža, uspravnija i mirnija nego što si ušla.' },
  { naslov: 'Zajednica koja motiviše', tekst: 'Male grupe u kojima te instruktorica zna po imenu i prati tvoj napredak.' },
  { naslov: 'Bolje držanje i manje napetosti', tekst: 'Rad na dubokim mišićima leđa i trbuha koji drže kičmu na okupu.' },
];

const PAKETI = [
  {
    id: 'grupni',
    naziv: 'Grupni trening',
    opis: 'Mala grupa, ista energija, najpristupačniji ulaz u reformer pilates.',
    cijene: [
      { naziv: 'Probni trening', cijena: '25 KM' },
      { naziv: '8 termina', cijena: '150 KM', istaknuto: true },
      { naziv: '12 termina', cijena: '200 KM' },
    ],
  },
  {
    id: 'poluindividualni',
    naziv: 'Poluindividualni trening',
    opis: 'Ti i još jedna osoba. Pažnja instruktorice skoro kao na individualnom.',
    cijene: [
      { naziv: 'Probni trening', cijena: '90 KM' },
      { naziv: '8 termina', cijena: '550 KM', istaknuto: true },
      { naziv: '12 termina', cijena: '750 KM' },
    ],
  },
  {
    id: 'individualni',
    naziv: 'Individualni trening',
    opis: 'Trening skrojen samo za tebe — tempo, fokus i korekcije u svakom pokretu.',
    cijene: [
      { naziv: 'Probni trening', cijena: '50 KM' },
      { naziv: '8 termina', cijena: '340 KM', istaknuto: true },
      { naziv: '12 termina', cijena: '470 KM' },
    ],
  },
];

/* NAPOMENA: prva dva utiska su javni komentari sa Instagram profila studija.
   Prije objave sajta zatraži saglasnost autorki ili ih zamijeni novim. */
const UTISCI = [
  { tekst: 'Predivan prostor, instruktorka još bolja.', ime: 'Anđela V.', uloga: 'Članica' },
  { tekst: 'Wooow, ovako nešto je trebalo da se desi u Banjoj Luci.', ime: 'Ljiljana S.', uloga: 'Članica' },
  { tekst: '[UTISAK_ČLANICE — dopuni pravim citatom]', ime: '[IME]', uloga: '[npr. Članica 12 mjeseci]' },
];

/* Svih šest ide u isti format 4:5 — grid ostaje uredan, slike se kadriraju
   preko object-fit: cover, a puni format se vidi u lightboxu. */
const GALERIJA = [
  { slika: 'solis-studio-panorama', alt: 'Sala sa reformer aparatima i lučnim ogledalima' },
  { slika: 'solis-clanice-reformer', alt: 'Dvije članice na treningu u studiju' },
  { slika: 'solis-render', alt: 'Prostor studija sa natpisom The best project you will ever work on is yourself' },
  { slika: 'solis-balans', alt: 'Trening na reformeru pred ogledalima' },
  { slika: 'solis-zajednica', alt: 'Tri članice studija' },
  { slika: 'solis-reformer-detalj', alt: 'Detalj reformer aparata sa oprugama' },
];

/* ------------------------------------------------------ POMOĆNE KOMPONENTE */

/** Slika sa dvije rezolucije — browser bira manju na telefonu. */
function Slika({
  ime,
  alt,
  sizes = '100vw',
  priority = false,
  className = '',
}: {
  ime: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={'/images/' + ime + '-1400.webp'}
      srcSet={'/images/' + ime + '-700.webp 700w, /images/' + ime + '-1400.webp 1400w'}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
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

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      {dir === 'prev' ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function IkonaInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* --------------------------------------------------------------- STRANICA -- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [utisak, setUtisak] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [poslato, setPoslato] = useState(false);
  const autoplay = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollReveal();

  /* Navigacija dobija podlogu čim se odskroluje sa hero sekcije */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Zaključaj scroll dok je otvoren meni ili lightbox */
  useEffect(() => {
    const zakljucano = menuOpen || lightbox !== null;
    document.body.style.overflow = zakljucano ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, lightbox]);

  /* Esc zatvara sve, strelice listaju galeriju */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLightbox(null);
      }
      if (lightbox !== null) {
        if (e.key === 'ArrowRight') setLightbox((i) => ((i ?? 0) + 1) % GALERIJA.length);
        if (e.key === 'ArrowLeft') setLightbox((i) => ((i ?? 0) - 1 + GALERIJA.length) % GALERIJA.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  /* Utisci se smjenjuju na 6 sekundi */
  const pokreniAuto = useCallback(() => {
    if (autoplay.current) clearInterval(autoplay.current);
    autoplay.current = setInterval(() => setUtisak((u) => (u + 1) % UTISCI.length), 6000);
  }, []);

  useEffect(() => {
    pokreniAuto();
    return () => {
      if (autoplay.current) clearInterval(autoplay.current);
    };
  }, [pokreniAuto]);

  const naUtisak = (i: number) => {
    setUtisak((i + UTISCI.length) % UTISCI.length);
    pokreniAuto();
  };

  const posalji = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* TODO: povezati sa EMAIL_SUBMIT_ENDPOINT (fetch POST) */
    setPoslato(true);
    e.currentTarget.reset();
    window.setTimeout(() => setPoslato(false), 5000);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <span id="pocetna" />

      {/* ============================================================ NAV == */}
      <header
        className={
          'nav' +
          (scrolled ? ' nav--solid' : '') +
          (menuOpen ? ' nav--na-meniju' : '') +
          (lightbox !== null ? ' nav--sakrivena' : '')
        }
      >
        <div className="nav__inner">
          <a href="#pocetna" className="nav__logo" aria-label={STUDIO}>
            <img src="/logo-solis-cream.svg" alt="" className="nav__logo-img nav__logo-img--cream" />
            <img src="/logo-solis-dark.svg" alt="" className="nav__logo-img nav__logo-img--dark" />
          </a>

          <nav className="nav__links">
            {NAV.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <a className="btn btn--pill nav__cta" href="#kontakt">
            Zakaži probni
          </a>

          <button
            type="button"
            className={'burger' + (menuOpen ? ' is-open' : '')}
            aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={'meni' + (menuOpen ? ' is-open' : '')}>
        {NAV.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="btn btn--solid meni__cta" href="#kontakt" onClick={() => setMenuOpen(false)}>
          Zakaži probni trening
        </a>
      </div>

      <main>
        {/* =========================================================== HERO == */}
        <section className="hero">
          <div className="hero__media">
            <Slika ime="solis-studio-panorama" alt="" priority sizes="100vw" className="hero__img" />
            <div className="hero__veil" />
          </div>

          <div className="hero__content">
            <p className="kicker kicker--light" data-reveal>
              Reformer pilates · Banja Luka
            </p>
            <h1 className="display" data-reveal>
              Pilates za <span className="italic">svako</span> tijelo
            </h1>
            <p className="hero__lead" data-reveal>
              Transformacija počinje sa pedeset minuta samo za sebe.
            </p>
            <div className="hero__akcije" data-reveal>
              <a className="btn btn--solid" href="#kontakt">
                Zatraži probni trening
              </a>
              <a className="btn btn--ghost" href="#cjenovnik">
                Pogledaj cjenovnik
              </a>
            </div>
          </div>

          <a href="#o-studiju" className="hero__scroll" aria-label="Nastavi na sadržaj">
            <span />
          </a>
        </section>

        {/* ====================================================== O STUDIJU == */}
        <section className="zasto" id="o-studiju">
          <div className="wrap">
            <div className="zasto__uvod" data-reveal>
              <p className="kicker">Zašto pilates</p>
              <h2 className="naslov">
                Više od vježbe — <span className="italic">to je transformacija</span>
              </h2>
              <p className="lead">
                Reformer pilates gradi snagu kroz kontrolisan pokret, bez udaraca po zglobovima. Rezultat se ne vidi
                samo u ogledalu — osjeti se u držanju, disanju i onome kako se nosiš kroz dan.
              </p>
            </div>

            <div className="zasto__grid">
              <figure className="zasto__grafika" data-reveal>
                <Slika
                  ime="solis-zasto-pilates"
                  alt="Grafika studija: zašto sam počela sa pilatesom — šest razloga"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </figure>

              <ol className="benefiti">
                {BENEFITI.map((b, i) => (
                  <li key={b.naslov} data-reveal>
                    <span className="benefiti__broj">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{b.naslov}</h3>
                      <p>{b.tekst}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ========================================================== CITAT == */}
        <section className="citat">
          <div className="citat__media">
            <Slika ime="solis-detalj-pampas" alt="" sizes="100vw" className="citat__img" />
          </div>
          <blockquote className="citat__tekst" data-reveal>
            <p>Status: nedostupna.</p>
            <p>Lokacija: Solis Reformer Pilates.</p>
            <p className="italic">Plan: ne diraj me narednih 50 minuta.</p>
          </blockquote>
        </section>

        {/* ====================================================== CJENOVNIK == */}
        <section className="cjenovnik" id="cjenovnik">
          <div className="wrap">
            <div className="sekcija__zaglavlje" data-reveal>
              <p className="kicker">Cjenovnik</p>
              <h2 className="naslov">
                Paket koji <span className="italic">odgovara tebi</span>
              </h2>
            </div>

            <div className="paketi">
              {PAKETI.map((p) => (
                <article className="paket" key={p.id} data-reveal>
                  <h3 className="paket__naziv">{p.naziv}</h3>
                  <p className="paket__opis">{p.opis}</p>

                  <ul className="paket__cijene">
                    {p.cijene.map((c) => (
                      <li key={c.naziv} className={c.istaknuto ? 'is-highlight' : undefined}>
                        <span className="paket__stavka">
                          {c.naziv}
                          {c.istaknuto && <em className="paket__oznaka">najtraženije</em>}
                        </span>
                        <span className="paket__cijena">{c.cijena}</span>
                      </li>
                    ))}
                  </ul>

                  <a className="btn btn--solid paket__cta" href="#kontakt">
                    Odaberi paket
                  </a>
                </article>
              ))}
            </div>

            <p className="cjenovnik__napomena" data-reveal>
              Trening paketi vrijede 31 dan od datuma kupovine.
            </p>
          </div>
        </section>

        {/* =================================================== INSTRUKTORICA == */}
        <section className="instruktorica" id="instruktorica">
          <div className="wrap instruktorica__grid">
            <div className="instruktorica__slike" data-reveal>
              <figure className="instruktorica__glavna">
                <Slika
                  ime="solis-instruktorica"
                  alt="Instruktorica studija Solis Reformer Pilates"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </figure>
              <figure className="instruktorica__mala">
                <Slika
                  ime="solis-instruktorica-pocetnici"
                  alt="Instruktorica u studiju — pilates je dostupan i početnicima"
                  sizes="(min-width: 1024px) 20vw, 40vw"
                />
              </figure>
            </div>

            <div className="instruktorica__tekst" data-reveal>
              <p className="kicker">Upoznaj instruktoricu</p>
              <h2 className="naslov">
                Neko ko te <span className="italic">zna po imenu</span>
              </h2>
              <p>
                [BIO — dopuni: ime instruktorice, koliko dugo radi sa reformerom, gdje se školovala i šta je dovelo do
                otvaranja Solisa u Banjoj Luci. Dvije do tri rečenice su dovoljne.]
              </p>
              <p>
                Radim sa svim nivoima, a početnice su mi najdraže — prvi trening je uvijek sporiji, sa objašnjenjem
                svakog pokreta i podešavanjem aparata prema tvom tijelu. Nikada nisi prepuštena sebi.
              </p>

              <dl className="instruktorica__fakta">
                <div>
                  <dt>Specijalizacija</dt>
                  <dd>Reformer pilates</dd>
                </div>
                <div>
                  <dt>Certifikati</dt>
                  <dd>[CERTIFIKATI]</dd>
                </div>
                <div>
                  <dt>Radi sa</dt>
                  <dd>Početnicama i naprednima</dd>
                </div>
              </dl>

              <a className="btn btn--outline" href="#kontakt">
                Zakaži termin
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================= GALERIJA == */}
        <section className="galerija" id="galerija">
          <div className="wrap">
            <div className="sekcija__zaglavlje" data-reveal>
              <p className="kicker">Galerija</p>
              <h2 className="naslov">
                Naša <span className="italic">lokacija</span>
              </h2>
              <p className="lead">
                Prostor u kojem se trenira mirno i bez gužve — lučna ogledala, topla rasvjeta i osam reformer aparata.
              </p>
            </div>

            <div className="galerija__grid">
              {GALERIJA.map((g, i) => (
                <button
                  type="button"
                  key={g.slika}
                  className="galerija__stavka"
                  onClick={() => setLightbox(i)}
                  aria-label={'Otvori sliku: ' + g.alt}
                  data-reveal
                >
                  <Slika ime={g.slika} alt={g.alt} sizes="(min-width: 768px) 33vw, 50vw" />
                </button>
              ))}
            </div>

            <div className="uzivo" data-reveal>
              <div className="uzivo__video">
                <video
                  src="/video/solis-studio.mp4"
                  playsInline
                  muted
                  loop
                  autoPlay
                  preload="metadata"
                  poster="/images/solis-studio-poster.webp"
                  aria-label="Snimak studija"
                />
              </div>
              <div className="uzivo__tekst">
                <p className="kicker">Studio uživo</p>
                <h3 className="naslov">
                  Zaviri <span className="italic">prije nego dođeš</span>
                </h3>
                <p className="lead">
                  Osam reformer aparata, lučna ogledala i topla rasvjeta. Svakodnevni život studija pratiš na Instagramu.
                </p>
                <a className="btn btn--outline" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <IkonaInstagram />
                  <span>@{INSTAGRAM}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= UTISCI == */}
        <section className="utisci">
          <div className="wrap">
            <p className="kicker kicker--light" data-reveal>
              Utisci
            </p>
            <h2 className="naslov naslov--light" data-reveal>
              Šta kažu <span className="italic">članice</span>
            </h2>

            <div className="utisci__box" data-reveal>
              <button type="button" className="utisci__strelica" onClick={() => naUtisak(utisak - 1)} aria-label="Prethodni utisak">
                <Chevron dir="prev" />
              </button>

              <div className="utisci__viewport">
                <div className="utisci__traka" style={{ transform: 'translateX(-' + utisak * 100 + '%)' }}>
                  {UTISCI.map((u) => (
                    <figure className="utisci__stavka" key={u.ime}>
                      <div className="utisci__zvjezdice" aria-label="Ocjena 5 od 5">
                        {'★★★★★'}
                      </div>
                      <blockquote>{u.tekst}</blockquote>
                      <figcaption>
                        <strong>{u.ime}</strong>
                        <span>{u.uloga}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <button type="button" className="utisci__strelica" onClick={() => naUtisak(utisak + 1)} aria-label="Sljedeći utisak">
                <Chevron dir="next" />
              </button>
            </div>

            <div className="utisci__tacke">
              {UTISCI.map((u, i) => (
                <button
                  type="button"
                  key={u.ime}
                  className={'utisci__tacka' + (i === utisak ? ' is-active' : '')}
                  onClick={() => naUtisak(i)}
                  aria-label={'Utisak ' + (i + 1)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== KONTAKT == */}
        <section className="kontakt" id="kontakt">
          <div className="wrap kontakt__grid">
            <div className="kontakt__uvod" data-reveal>
              <p className="kicker">Prvi korak</p>
              <h2 className="naslov">
                Sprema li se <span className="italic">nova verzija tebe?</span>
              </h2>
              <p className="lead">
                Ostavi podatke i javljamo se sa slobodnim terminima. Termin možeš odabrati i sama, kroz našu aplikaciju.
              </p>

              <a className="btn btn--solid" href={LINK_APLIKACIJE}>
                Rezerviši kroz aplikaciju
              </a>

              <dl className="kontakt__info">
                <div>
                  <dt>Adresa</dt>
                  <dd>
                    {KONTAKT.adresa}
                    <br />
                    {KONTAKT.grad}
                  </dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>{KONTAKT.telefon}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{KONTAKT.email}</dd>
                </div>
                <div>
                  <dt>Radno vrijeme</dt>
                  <dd>{KONTAKT.radnoVrijeme}</dd>
                </div>
              </dl>
            </div>

            <form className="forma" action={EMAIL_SUBMIT_ENDPOINT} method="post" onSubmit={posalji} data-reveal>
              <h3 className="forma__naslov">Zatraži probni trening</h3>

              <label className="polje">
                <span>Ime i prezime</span>
                <input name="ime" type="text" required autoComplete="name" />
              </label>

              <label className="polje">
                <span>Email</span>
                <input name="email" type="email" required autoComplete="email" />
              </label>

              <label className="polje">
                <span>Telefon</span>
                <input name="telefon" type="tel" required autoComplete="tel" />
              </label>

              <label className="polje">
                <span>Tip treninga</span>
                <select name="tip" defaultValue="grupni">
                  {PAKETI.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.naziv}
                    </option>
                  ))}
                </select>
              </label>

              <label className="polje">
                <span>Poruka (nije obavezno)</span>
                <textarea name="poruka" rows={3} />
              </label>

              <button type="submit" className="btn btn--solid forma__submit">
                Pošalji zahtjev
              </button>

              <p className="forma__status" role="status">
                {poslato ? 'Hvala — javljamo se u najkraćem roku.' : ' '}
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* ========================================================== FOOTER == */}
      <footer className="futer">
        <div className="wrap futer__grid">
          <div>
            <img src="/logo-solis-cream.svg" alt={STUDIO} className="futer__logo" />
            <p className="futer__adresa">
              {KONTAKT.adresa}, {KONTAKT.grad}
            </p>
          </div>

          <nav className="futer__nav">
            {NAV.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="futer__social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IkonaInstagram />
              <span>@{INSTAGRAM}</span>
            </a>
          </div>
        </div>

        <p className="futer__copy">
          © {new Date().getFullYear()} {STUDIO}. Sva prava zadržana.
        </p>
      </footer>

      {/* ======================================================= LIGHTBOX == */}
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galerija">
          <button type="button" className="lightbox__zatvori" onClick={() => setLightbox(null)} aria-label="Zatvori">
            ✕
          </button>
          <button
            type="button"
            className="lightbox__strelica lightbox__strelica--prev"
            onClick={() => setLightbox((i) => ((i ?? 0) - 1 + GALERIJA.length) % GALERIJA.length)}
            aria-label="Prethodna slika"
          >
            <Chevron dir="prev" />
          </button>

          <figure className="lightbox__okvir">
            <Slika ime={GALERIJA[lightbox].slika} alt={GALERIJA[lightbox].alt} sizes="90vw" priority />
            <figcaption>{GALERIJA[lightbox].alt}</figcaption>
          </figure>

          <button
            type="button"
            className="lightbox__strelica lightbox__strelica--next"
            onClick={() => setLightbox((i) => ((i ?? 0) + 1) % GALERIJA.length)}
            aria-label="Sljedeća slika"
          >
            <Chevron dir="next" />
          </button>
        </div>
      )}
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
  --terakota: #d4825b;
  --terakota-tamna: #b4653f;
  --krem: #f1e6dc;
  --pijesak: #f5f1ee;
  --taupe: #c9ada0;
  --ugalj: #2c2c2c;
  --prigusena: #7d6c62;
  --linija: rgba(44, 44, 44, 0.14);
  --serif: 'EB Garamond', Garamond, 'Times New Roman', Times, serif;
  --sans: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif;
  --nav-h: 76px;
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; scroll-padding-top: var(--nav-h); }

body {
  margin: 0;
  background-color: var(--pijesak);
  color: var(--ugalj);
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4 { margin: 0; font-weight: 400; }
p { margin: 0 0 1rem; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
ul, ol, dl, dd { margin: 0; padding: 0; list-style: none; }

.wrap { width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 1.25rem; }
@media (min-width: 768px) { .wrap { padding: 0 2.5rem; } }

.italic { font-style: italic; }

/* ---------------------------------------------------------- tipografija -- */

.display {
  font-family: var(--serif);
  font-size: clamp(2.6rem, 11vw, 5.5rem);
  line-height: 1.02;
  letter-spacing: -0.01em;
  margin: 0.5rem 0 1rem;
}

.naslov {
  font-family: var(--serif);
  font-size: clamp(1.9rem, 5vw, 3rem);
  line-height: 1.12;
  margin: 0.35rem 0 1rem;
}
.naslov--light { color: var(--krem); }

.kicker {
  font-family: var(--sans);
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--terakota);
  margin: 0;
}
.kicker--light { color: rgba(241, 230, 220, 0.85); }

.lead { font-size: 1.05rem; color: var(--prigusena); max-width: 46ch; }

.sekcija__zaglavlje { max-width: 46rem; margin-bottom: 2.5rem; }
@media (min-width: 768px) { .sekcija__zaglavlje { margin-bottom: 4rem; } }

/* -------------------------------------------------------------- dugmad -- */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  font-family: var(--sans);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}
.btn:hover, .btn:focus-visible { transform: translateY(-2px); }

.btn--solid { background-color: var(--terakota); color: #fff; }
.btn--solid:hover, .btn--solid:focus-visible { background-color: var(--terakota-tamna); }

.btn--outline { border-color: var(--terakota); color: var(--terakota); }
.btn--outline:hover, .btn--outline:focus-visible { background-color: var(--terakota); color: #fff; }

.btn--ghost { border-color: rgba(255, 255, 255, 0.6); color: #fff; }
.btn--ghost:hover, .btn--ghost:focus-visible { background-color: #fff; color: var(--ugalj); border-color: #fff; }

.btn--pill { padding: 0.6rem 1.3rem; font-size: 0.7rem; }

/* ------------------------------------------------------------ navigacija -- */

.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 700;
  transition: background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, opacity 0.25s ease;
  border-bottom: 1px solid transparent;
}
/* dok je lightbox otvoren navigacija se ne providi kroz zatamnjenje */
.nav--sakrivena { opacity: 0; pointer-events: none; }

.nav--solid {
  background-color: rgba(245, 241, 238, 0.94);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--linija);
  box-shadow: 0 6px 24px rgba(44, 44, 44, 0.06);
}
.nav__inner {
  max-width: 1240px;
  margin: 0 auto;
  height: var(--nav-h);
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
@media (min-width: 768px) { .nav__inner { padding: 0 2.5rem; } }

.nav__logo { position: relative; display: block; flex: 0 0 auto; }
.nav__logo-img { height: 40px; width: auto; transition: opacity 0.4s ease; }
.nav__logo-img--dark { position: absolute; inset: 0; opacity: 0; }
.nav--solid .nav__logo-img--cream,
.nav--na-meniju .nav__logo-img--cream { opacity: 0; }
.nav--solid .nav__logo-img--dark,
.nav--na-meniju .nav__logo-img--dark { opacity: 1; }

.nav__links { display: none; gap: 1.75rem; }
@media (min-width: 1024px) { .nav__links { display: flex; } }
.nav__links a {
  position: relative;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  padding-bottom: 3px;
  transition: color 0.3s ease;
}
.nav--solid .nav__links a { color: var(--ugalj); }
.nav__links a::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background-color: currentColor;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s ease;
}
.nav__links a:hover::after { transform: scaleX(1); }

.nav__cta { display: none; background-color: var(--terakota); color: #fff; }
@media (min-width: 1024px) { .nav__cta { display: inline-flex; } }

.burger { width: 40px; height: 26px; position: relative; flex: 0 0 auto; }
@media (min-width: 1024px) { .burger { display: none; } }
.burger span {
  position: absolute; left: 2px; width: 32px; height: 2px;
  background-color: #fff; border-radius: 2px;
  transition: transform 0.35s ease, opacity 0.25s ease, top 0.35s ease, background-color 0.4s ease;
}
.nav--solid .burger span { background-color: var(--ugalj); }
.burger span:nth-child(1) { top: 4px; }
.burger span:nth-child(2) { top: 12px; }
.burger span:nth-child(3) { top: 20px; }
.burger.is-open span { background-color: var(--ugalj); }
.burger.is-open span:nth-child(1) { top: 12px; transform: rotate(45deg); }
.burger.is-open span:nth-child(2) { opacity: 0; }
.burger.is-open span:nth-child(3) { top: 12px; transform: rotate(-45deg); }

.meni {
  position: fixed; inset: 0; z-index: 690;
  background-color: var(--krem);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.35rem;
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
}
.meni.is-open { opacity: 1; pointer-events: auto; }
.meni a {
  font-family: var(--serif);
  font-size: 1.9rem;
  padding: 0.4rem 1rem;
}
/* .meni a je specifičniji od .meni__cta, pa dugme mora ovako da nadjača font */
.meni a.meni__cta {
  margin-top: 1.5rem;
  font-family: var(--sans);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  white-space: nowrap;
  padding: 0.85rem 1.75rem;
}

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
  .btn, .utisci__traka, .galerija__stavka img { transition: none; }
}

/* ---------------------------------------------------------------- hero -- */

.hero {
  position: relative;
  min-height: 88vh;
  min-height: 88svh;
  display: flex;
  align-items: flex-end;
  padding: calc(var(--nav-h) + 3rem) 1.25rem 4.5rem;
  overflow: hidden;
}
@media (min-width: 768px) { .hero { min-height: 92vh; min-height: 92svh; padding: 0 2.5rem 5.5rem; align-items: flex-end; } }

.hero__media { position: absolute; inset: 0; }
.hero__img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 45%; }
.hero__veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(to top, rgba(30, 18, 12, 0.72) 0%, rgba(30, 18, 12, 0.22) 45%, rgba(30, 18, 12, 0.34) 100%),
    linear-gradient(to bottom right, rgba(212, 130, 91, 0.42), rgba(180, 101, 63, 0.28));
}

.hero__content { position: relative; z-index: 2; color: #fff; max-width: 1240px; margin: 0 auto; width: 100%; }
.hero__lead { font-size: 1.1rem; max-width: 34ch; color: rgba(255, 255, 255, 0.92); }
@media (min-width: 768px) { .hero__lead { font-size: 1.25rem; } }
.hero__akcije { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }

.hero__scroll {
  position: absolute; left: 50%; bottom: 1.4rem; transform: translateX(-50%);
  z-index: 2; width: 24px; height: 40px; border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px; display: none;
}
@media (min-width: 768px) { .hero__scroll { display: block; } }
.hero__scroll span {
  position: absolute; left: 50%; top: 8px; width: 3px; height: 7px; margin-left: -1.5px;
  background-color: #fff; border-radius: 2px;
  animation: scrollDot 1.8s ease-in-out infinite;
}
@keyframes scrollDot {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(12px); opacity: 0.3; }
}
@media (prefers-reduced-motion: reduce) { .hero__scroll span { animation: none; } }

/* ------------------------------------------------------------ o studiju -- */

.zasto { padding: 4.5rem 0; }
@media (min-width: 768px) { .zasto { padding: 7rem 0; } }
.zasto__uvod { max-width: 44rem; margin-bottom: 3rem; }
.zasto__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.5rem; align-items: start; }
@media (min-width: 1024px) { .zasto__grid { grid-template-columns: 0.85fr 1fr; gap: 4rem; } }

.zasto__grafika { margin: 0; overflow: hidden; border-radius: 4px; }
.zasto__grafika img { width: 100%; height: auto; }
@media (min-width: 1024px) { .zasto__grafika { position: sticky; top: calc(var(--nav-h) + 2rem); } }

.benefiti { display: grid; gap: 0; }
.benefiti li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--linija);
}
.benefiti li:last-child { border-bottom: 1px solid var(--linija); }
.benefiti__broj {
  font-family: var(--serif);
  font-size: 1.1rem;
  color: var(--terakota);
  line-height: 1.7;
}
.benefiti h3 {
  font-family: var(--sans);
  font-size: 0.86rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.benefiti p { margin: 0; color: var(--prigusena); font-size: 0.98rem; }

/* --------------------------------------------------------------- citat -- */

.citat { position: relative; display: grid; place-items: center; min-height: 60vh; padding: 5rem 1.25rem; overflow: hidden; }
@media (min-width: 768px) { .citat { min-height: 70vh; } }
.citat__media { position: absolute; inset: 0; }
.citat__media::after {
  content: '';
  position: absolute; inset: 0;
  /* slika je svijetla, pa tekstu treba jači veo nego na hero sekciji */
  background:
    radial-gradient(120% 80% at 50% 50%, rgba(46, 22, 10, 0.72) 0%, rgba(46, 22, 10, 0.52) 100%);
}
.citat__img { width: 100%; height: 100%; object-fit: cover; }
.citat__tekst {
  position: relative; z-index: 2; margin: 0; text-align: center; color: var(--krem);
  font-family: var(--serif);
  font-size: clamp(1.5rem, 4.5vw, 2.6rem);
  line-height: 1.35;
}
.citat__tekst p { margin: 0; }

/* ----------------------------------------------------------- cjenovnik -- */

.cjenovnik { padding: 4.5rem 0; background-color: #fff; }
@media (min-width: 768px) { .cjenovnik { padding: 7rem 0; } }

.paketi { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
@media (min-width: 768px) { .paketi { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; } }

.paket {
  display: flex;
  flex-direction: column;
  padding: 2rem 1.75rem 1.75rem;
  border: 1px solid var(--linija);
  border-radius: 6px;
  background-color: var(--pijesak);
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}
.paket:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(44, 44, 44, 0.09);
  border-color: var(--taupe);
}
.paket__naziv { font-family: var(--serif); font-size: 1.7rem; margin-bottom: 0.5rem; }
.paket__opis { color: var(--prigusena); font-size: 0.95rem; min-height: 3.6rem; }

.paket__cijene { margin: 0.5rem 0 1.75rem; border-top: 1px solid var(--linija); }
.paket__cijene li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--linija);
}
.paket__cijene li.is-highlight { color: var(--terakota-tamna); }
.paket__stavka { display: flex; flex-direction: column; font-size: 0.95rem; }
.paket__oznaka {
  font-style: normal;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--terakota);
}
.paket__cijena { font-family: var(--serif); font-size: 1.45rem; white-space: nowrap; }
.paket__cta { margin-top: auto; align-self: flex-start; }

.cjenovnik__napomena {
  margin-top: 1.75rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--prigusena);
}

/* ------------------------------------------------------- instruktorica -- */

.instruktorica { padding: 4.5rem 0; }
@media (min-width: 768px) { .instruktorica { padding: 7rem 0; } }
.instruktorica__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.5rem; align-items: center; }
@media (min-width: 1024px) { .instruktorica__grid { grid-template-columns: 1fr 1fr; gap: 4.5rem; } }

.instruktorica__slike { position: relative; padding-bottom: 4rem; }
.instruktorica__glavna { margin: 0; overflow: hidden; border-radius: 4px; }
.instruktorica__glavna img { width: 100%; height: auto; }
.instruktorica__mala {
  position: absolute; right: 0; bottom: 0; width: 42%;
  margin: 0; overflow: hidden; border-radius: 4px;
  border: 6px solid var(--pijesak);
}
.instruktorica__mala img { width: 100%; height: auto; }

.instruktorica__tekst p { color: var(--prigusena); }
.instruktorica__fakta {
  display: grid;
  gap: 0.85rem;
  margin: 1.75rem 0 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--linija);
}
@media (min-width: 640px) { .instruktorica__fakta { grid-template-columns: repeat(3, 1fr); } }
.instruktorica__fakta dt {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--terakota);
  margin-bottom: 0.3rem;
}
.instruktorica__fakta dd { font-size: 0.95rem; }

/* ------------------------------------------------------------ galerija -- */

.galerija { padding: 4.5rem 0; background-color: var(--krem); }
@media (min-width: 768px) { .galerija { padding: 7rem 0; } }

.galerija__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (min-width: 768px) { .galerija__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } }

.galerija__stavka {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--taupe);
  padding: 0;
}
.galerija__stavka img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.galerija__stavka:hover img, .galerija__stavka:focus-visible img { transform: scale(1.06); }

/* traka sa snimkom studija */
.uzivo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  margin-top: 3.5rem;
  padding-top: 3.5rem;
  border-top: 1px solid rgba(44, 44, 44, 0.12);
}
@media (min-width: 768px) { .uzivo { grid-template-columns: 300px 1fr; gap: 3.5rem; } }
.uzivo__video {
  overflow: hidden;
  border-radius: 6px;
  background-color: var(--taupe);
  aspect-ratio: 520 / 900;
  max-width: 300px;
}
.uzivo__video video { width: 100%; height: 100%; object-fit: cover; }
.uzivo__tekst .naslov { margin-bottom: 0.75rem; }

/* -------------------------------------------------------------- utisci -- */

.utisci { padding: 4.5rem 0; background-color: var(--terakota); color: var(--krem); text-align: center; }
@media (min-width: 768px) { .utisci { padding: 7rem 0; } }
.utisci .naslov { margin-bottom: 2.5rem; }

.utisci__box { display: flex; align-items: center; gap: 0.5rem; max-width: 46rem; margin: 0 auto; }
@media (min-width: 768px) { .utisci__box { gap: 1.5rem; } }
.utisci__viewport { overflow: hidden; flex: 1 1 auto; min-width: 0; }
.utisci__traka { display: flex; transition: transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); }
.utisci__stavka { flex: 0 0 100%; margin: 0; padding: 0 0.5rem; }
.utisci__zvjezdice { font-size: 0.9rem; letter-spacing: 0.35em; margin-bottom: 1.25rem; color: var(--krem); }
.utisci__stavka blockquote {
  margin: 0 0 1.5rem;
  font-family: var(--serif);
  font-size: clamp(1.35rem, 3.4vw, 1.9rem);
  line-height: 1.4;
}
.utisci__stavka figcaption { display: flex; flex-direction: column; gap: 0.2rem; }
.utisci__stavka figcaption strong {
  font-weight: 400; font-size: 0.82rem; letter-spacing: 0.16em; text-transform: uppercase;
}
.utisci__stavka figcaption span { font-size: 0.78rem; color: rgba(241, 230, 220, 0.75); }

.utisci__strelica { flex: 0 0 auto; padding: 0.5rem; opacity: 0.7; transition: opacity 0.3s ease, transform 0.3s ease; }
.utisci__strelica:hover { opacity: 1; transform: scale(1.12); }

.utisci__tacke { display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
.utisci__tacka {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1px solid rgba(241, 230, 220, 0.7); background-color: transparent;
  transition: background-color 0.3s ease;
}
.utisci__tacka.is-active { background-color: var(--krem); }

/* ------------------------------------------------------------- kontakt -- */

.kontakt { padding: 4.5rem 0; }
@media (min-width: 768px) { .kontakt { padding: 7rem 0; } }
.kontakt__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 3rem; }
@media (min-width: 1024px) { .kontakt__grid { grid-template-columns: 1fr 1fr; gap: 4.5rem; align-items: start; } }

.kontakt__info {
  display: grid; gap: 1.5rem;
  margin-top: 2.5rem; padding-top: 2rem;
  border-top: 1px solid var(--linija);
}
@media (min-width: 640px) { .kontakt__info { grid-template-columns: repeat(2, 1fr); } }
.kontakt__info dt {
  font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--terakota); margin-bottom: 0.35rem;
}
.kontakt__info dd { font-size: 0.98rem; }

.forma {
  background-color: #fff;
  border: 1px solid var(--linija);
  border-radius: 6px;
  padding: 1.75rem;
}
@media (min-width: 768px) { .forma { padding: 2.5rem; } }
.forma__naslov { font-family: var(--serif); font-size: 1.6rem; margin-bottom: 1.5rem; }

.polje { display: block; margin-bottom: 1.1rem; }
.polje > span {
  display: block; margin-bottom: 0.4rem;
  font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--prigusena);
}
.polje input, .polje select, .polje textarea {
  width: 100%;
  font-family: var(--sans);
  font-size: 1rem;
  color: var(--ugalj);
  background-color: var(--pijesak);
  border: 1px solid var(--linija);
  border-radius: 4px;
  padding: 0.7rem 0.85rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.polje textarea { resize: vertical; }
.polje input:focus, .polje select:focus, .polje textarea:focus {
  outline: none;
  border-color: var(--terakota);
  box-shadow: 0 0 0 3px rgba(212, 130, 91, 0.16);
}
.forma__submit { width: 100%; margin-top: 0.5rem; }
.forma__status {
  margin: 0.9rem 0 0; min-height: 1.2em; text-align: center;
  font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--terakota-tamna);
}

/* --------------------------------------------------------------- futer -- */

.futer { background-color: var(--ugalj); color: var(--krem); padding: 3.5rem 0 1.75rem; }
.futer__grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.25rem; }
@media (min-width: 768px) { .futer__grid { grid-template-columns: 1.4fr 1fr 1fr; gap: 2.5rem; } }
.futer__logo { height: 52px; width: auto; margin-bottom: 1rem; }
.futer__adresa { font-size: 0.92rem; color: rgba(241, 230, 220, 0.72); margin: 0; }
.futer__nav { display: grid; gap: 0.6rem; }
.futer__nav a {
  font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase;
  transition: opacity 0.3s ease;
}
.futer__nav a:hover { opacity: 0.65; }
.futer__social a {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-size: 0.82rem; letter-spacing: 0.06em;
  transition: opacity 0.3s ease;
}
.futer__social a:hover { opacity: 0.65; }
.futer__copy {
  max-width: 1240px; margin: 2.5rem auto 0; padding: 1.5rem 1.25rem 0;
  border-top: 1px solid rgba(241, 230, 220, 0.16);
  font-size: 0.78rem; color: rgba(241, 230, 220, 0.6);
}
@media (min-width: 768px) { .futer__copy { padding: 1.5rem 2.5rem 0; } }

/* ------------------------------------------------------------ lightbox -- */

.lightbox {
  position: fixed; inset: 0; z-index: 900;
  background-color: rgba(28, 18, 14, 0.94);
  display: flex; align-items: center; justify-content: center;
  gap: 0.5rem; padding: 3.5rem 0.75rem;
  animation: lbIn 0.25s ease;
}
@keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
.lightbox__okvir { margin: 0; max-width: min(1100px, 92vw); max-height: 100%; text-align: center; }
.lightbox__okvir img { max-height: 78vh; width: auto; margin: 0 auto; border-radius: 4px; }
.lightbox__okvir figcaption {
  margin-top: 1rem; font-size: 0.78rem; letter-spacing: 0.1em;
  color: rgba(241, 230, 220, 0.7);
}
.lightbox__zatvori {
  position: absolute; top: 1rem; right: 1.25rem;
  color: var(--krem); font-size: 1.4rem; line-height: 1; padding: 0.5rem;
}
.lightbox__strelica { flex: 0 0 auto; color: var(--krem); opacity: 0.75; padding: 0.75rem; }
.lightbox__strelica:hover { opacity: 1; }
`;
