'use client';

/* =============================================================================
   SOLIS REFORMER PILATES — Banja Luka
   -----------------------------------------------------------------------------
   Raspored sekcija i layout prate strukturu pilateswithharriet.com:
   apsolutni header u tri kolone (linkovi | logo | linkovi), hero preko cijelog
   ekrana, centrirana izjava, „meet" sekcija u 8 kolona, tipovi treninga sa
   listom lijevo i medijem desno, lista sa „+" markerima, kvadratni grid galerije,
   centrirani slider utisaka i futer sa formom.

   Boje, slike, logo i tekst su SOLIS.

   ŠTA JOŠ TREBA DOPUNITI: vidi konstantu KONTAKT i [BIO] u sekciji O studiju.
   ========================================================================== */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------- KONFIG -- */

const STUDIO = 'Solis Reformer Pilates';

/* Tri riječi ispod logotipa u heroju — slažu se jedna ispod druge */
const TAGLINE = ['Poveži', 'Oblikuj', 'Ojačaj'];
const INSTAGRAM = 'solisreformerbl';
const INSTAGRAM_URL = 'https://www.instagram.com/solisreformerbl';

const KONTAKT = {
  adresa: 'Vojvode Stepe Stepanovića 171F',
  grad: 'Banja Luka, Republika Srpska',
  telefon: '[TELEFON]',
  email: 'solisreformerbl@ba.com',
  radnoVrijeme: 'Pon–Sub, 06:00–20:00',
};

/* Sve što je u uglastim zagradama tretiramo kao nedopunjeno i ne prikazujemo —
   bolje da polje nestane nego da posjetilac vidi [TELEFON]. */
const jePrazno = (v: string) => /^\[.*\]$/.test(v.trim());

/* Dok studio ne poveže svoju aplikaciju za rezervacije, dugmad vode na mejl
   sa već popunjenim predmetom. */
const REZERVACIJA_LINK =
  'mailto:' + KONTAKT.email + '?subject=' + encodeURIComponent('Probni trening — Solis');

const EMAIL_SUBMIT_ENDPOINT = '[EMAIL_SUBMIT_ENDPOINT]';

/* Jedan tekst za sve glavne CTA dugmad — aktivan glagol, ti-forma */
const CTA = 'Rezerviši probni trening';
const CTA_KRATKO = 'Rezerviši probni';

const NAV_LIJEVO = [
  { label: 'O studiju', href: '#o-studiju' },
  { label: 'Treninzi', href: '#treninzi' },
];

const NAV_DESNO = [
  { label: 'Cjenovnik', href: '#cjenovnik' },
  { label: 'Kontakt', href: '#kontakt' },
];

const NAV_SVE = [
  { label: 'Početna', href: '#pocetna' },
  { label: 'O studiju', href: '#o-studiju' },
  { label: 'Treninzi', href: '#treninzi' },
  { label: 'Zašto pilates', href: '#zasto' },
  { label: 'Cjenovnik', href: '#cjenovnik' },
  { label: 'Galerija', href: '#galerija' },
  { label: 'Česta pitanja', href: '#pitanja' },
  { label: 'Kontakt', href: '#kontakt' },
];

/* Šest razloga sa grafike studija „Zašto sam počela sa pilatesom” */
const RAZLOZI = [
  'Vrijeme za sebe',
  'Jače tijelo i veća fleksibilnost',
  'Manje stresa, više mira',
  'Osjećaj lakoće nakon svakog treninga',
  'Zajednica koja motiviše',
  'Bolje držanje i manje napetosti',
];

const TRENINZI = [
  {
    id: 'grupni',
    naziv: 'Grupni trening',
    podnaslov: 'Zajednica i dosljednost',
    najboljeZa: 'Zajednicu, redovnu rutinu i najpovoljniji ulazak',
    slika: 'solis-zajednica',
    opis: 'Mala grupa i ista energija — najpristupačniji ulaz u reformer pilates. Instruktorica prolazi kroz salu tokom cijelog treninga i koriguje svaku članicu, bez obzira na nivo iskustva. Aparat se podešava prema tebi, pa u istoj grupi rade i početnice i one koje treniraju godinama.',
  },
  {
    id: 'poluindividualni',
    naziv: 'Poluindividualni trening',
    podnaslov: 'Tehnika i preciznost',
    najboljeZa: 'Rad na formi uz partnericu i brži napredak',
    slika: 'solis-balans',
    opis: 'Ti i još jedna osoba. Pažnja skoro kao na individualnom treningu, uz tempo koji zajedno dogovorite. Fokus je na formi: opterećenje, ugao i disanje se podešavaju za svaku vježbu posebno, pa se greške isprave prije nego uđu u naviku.',
  },
  {
    id: 'individualni',
    naziv: 'Individualni trening',
    podnaslov: 'Program samo za tebe',
    najboljeZa: 'Prvi susret sa reformerom, povratak nakon pauze ili poroda',
    slika: 'solis-kampanja-reformer',
    opis: 'Trening skrojen samo za tebe — tempo, fokus i korekcija u svakom pokretu. Program se pravi prema tvom cilju i onome što tvoje tijelo trenutno može, i mijenja se kako napreduješ. Najbolji početak ako nikada nisi bila na reformeru ili se vraćaš nakon duže pauze.',
  },
];

const PAKETI = [
  {
    naziv: 'Grupni trening',
    najboljeZa: 'Zajednicu i redovnu rutinu',
    stavke: [
      { naziv: 'Probni trening', cijena: '25 KM' },
      { naziv: '8 termina', cijena: '150 KM' },
      { naziv: '12 termina', cijena: '200 KM' },
    ],
  },
  {
    naziv: 'Poluindividualni',
    najboljeZa: 'Rad na formi uz partnericu',
    stavke: [
      { naziv: 'Probni trening', cijena: '90 KM' },
      { naziv: '8 termina', cijena: '550 KM' },
      { naziv: '12 termina', cijena: '750 KM' },
    ],
  },
  {
    naziv: 'Individualni trening',
    najboljeZa: 'Početnice i povratak nakon pauze',
    stavke: [
      { naziv: 'Probni trening', cijena: '50 KM' },
      { naziv: '8 termina', cijena: '340 KM' },
      { naziv: '12 termina', cijena: '470 KM' },
    ],
  },
];

/* NAPOMENA: oba utiska su stvarni javni komentari sa Instagram profila studija.
   Prije objave zatraži saglasnost autorki.

   Treći utisak namjerno NIJE izmišljen — lažna recenzija sa izmišljenim imenom
   je obmana kupca. Kad studio prikupi pravi, doda se ovdje kao novi objekat:
   { tekst: '...', ime: 'Ime P.', detalj: 'Članica 8 mjeseci' }
   Poruka za prikupljanje utisaka je u README-u. */
const UTISCI = [
  { tekst: 'Predivan prostor, instruktorka još bolja.', ime: 'Anđela V.', detalj: 'Članica' },
  { tekst: 'Wooow, ovako nešto je trebalo da se desi u Banjoj Luci.', ime: 'Ljiljana S.', detalj: 'Članica' },
];

const PITANJA = [
  {
    p: 'Da li mi treba iskustvo sa pilatesom?',
    o: 'Ne. Počinjemo od nule — prvi trening je sporiji, sa objašnjenjem svakog pokreta i podešavanjem aparata prema tvom tijelu. Većina članica nikada prije nije stala na reformer.',
  },
  {
    p: 'Mogu li probati prije nego što kupim paket?',
    o: 'Da. Probni trening postoji za sve tri vrste treninga i plaća se zasebno — dolaziš, vidiš kako izgleda i tek onda odlučuješ o paketu.',
  },
  {
    p: 'Koliko dugo vrijedi paket?',
    o: 'Trening paketi vrijede 31 dan od datuma kupovine. Termine biraš sama, u okviru radnog vremena studija.',
  },
  {
    p: 'Šta da obučem i ponesem?',
    o: 'Udobnu odjeću u kojoj se slobodno krećeš i čarape sa gumicama na tabanima. Sve ostalo — aparat, opremu i prostor — nalaziš u studiju.',
  },
];

const GALERIJA = [
  { slika: 'solis-studio-panorama', alt: 'Sala sa reformer aparatima i lučnim ogledalima' },
  { slika: 'solis-clanice-reformer', alt: 'Dvije članice na treningu' },
  { slika: 'solis-render', alt: 'Prostor studija' },
  { slika: 'solis-detalj-pampas', alt: 'Detalj studija — ogledalo i pampas trava' },
  { slika: 'solis-balans', alt: 'Trening na reformeru pred ogledalima' },
  { slika: 'solis-zajednica', alt: 'Članice studija' },
];

/* ------------------------------------------------------ POMOĆNE KOMPONENTE */

/** Slika u dvije rezolucije — telefon skida manju. */
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

function Strelica({ smjer }: { smjer: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      {smjer === 'prev' ? (
        <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Pet zvjezdica kao SVG — oštre na svakom ekranu, za razliku od ★ karaktera
    koji svaki sistem crta drugačije. */
function Zvjezdice() {
  return (
    <div className="utisci__zvjezdice" role="img" aria-label="Ocjena 5 od 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z" />
        </svg>
      ))}
    </div>
  );
}

/** „Anđela V." -> „AV" */
function inicijali(ime: string) {
  return ime
    .split(/\s+/)
    .map((d) => d.charAt(0))
    .join('')
    .toUpperCase();
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
  const [trening, setTrening] = useState(TRENINZI[0].id);
  const [utisak, setUtisak] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [poslato, setPoslato] = useState(false);
  const autoplay = useRef<ReturnType<typeof setInterval> | null>(null);

  useScrollReveal();

  useEffect(() => {
    const zakljucano = menuOpen || lightbox !== null;
    document.body.style.overflow = zakljucano ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, lightbox]);

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

  const aktivanTrening = TRENINZI.find((t) => t.id === trening) ?? TRENINZI[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <span id="pocetna" />

      {/* ================================================= 1. HEADER (3 kolone) */}
      <header className="zaglavlje">
        <nav className="nav-linkovi">
          {NAV_LIJEVO.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* U zaglavlju stoji samo emblem — puni logotip je odmah ispod, u heroju */}
        <div className="zaglavlje__logo">
          <a href="#pocetna" aria-label={STUDIO}>
            <img src="/emblem-solis-bijeli.svg" alt="" />
          </a>
        </div>

        <nav className="nav-linkovi">
          {NAV_DESNO.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Burger — samo ispod 768px */}
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

      <div className={'meni' + (menuOpen ? ' is-open' : '')}>
        <a href="#pocetna" className="meni__logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo-solis-dark.svg" alt={STUDIO} />
        </a>
        {NAV_SVE.map((l) => (
          <a key={l.label} href={l.href} className="meni__link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>

      {/* Fiksni CTA dolje desno */}
      <a className="btn-trial" href="#kontakt">
        {CTA_KRATKO}
      </a>

      <main>
        {/* ============================================================ 2. HERO */}
        <section className="hero">
          <Slika ime="solis-studio-panorama" alt="" priority sizes="100vw" className="hero__slika" />
          <div className="hero__veo" />
          <div className="hero__sadrzaj">
            {/* logotip nosi h1 — naslov postoji za pretraživače i čitače ekrana,
                ali se ne vidi dvaput na ekranu */}
            <h1 className="hero__logo-naslov">
              <span className="skriveno">{STUDIO} — Banja Luka</span>
              <img src="/logo-solis-cream.svg" alt="" className="hero__logo" />
            </h1>

            {/* tanka crta pa tri riječi jedna ispod druge */}
            <span className="hero__crta" aria-hidden="true" />
            <p className="hero__tagline">
              {TAGLINE.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>

            <a href="#kontakt" className="btn btn--svijetli">
              {CTA}
            </a>
          </div>
        </section>

        {/* ================================================ 3. CENTRIRANA IZJAVA */}
        <section className="izjava">
          <div className="izjava__unutra" data-reveal>
            <h2 className="serif-naslov">
              Snaga <span className="tacka">•</span> Fleksibilnost <span className="tacka">•</span>{' '}
              <span className="kurziv">Transformacija</span>
            </h2>
            <p className="sans-naslov izjava__vodeci">
              Reformer studio u Banjoj Luci koji gradi snagu, držanje i mir — bez udaraca po zglobovima
            </p>
            <a href="#o-studiju" className="btn">
              Istraži
            </a>
          </div>
        </section>

        {/* ======================================================== 4. O STUDIJU */}
        <section className="o-studiju traka-svijetla" id="o-studiju">
          <div className="okvir o-studiju__mreza">
            <div className="o-studiju__portret" data-reveal>
              <Slika
                ime="solis-instruktorica"
                alt="Instruktorica studija Solis Reformer Pilates"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
              <div className="o-studiju__potpisni">
                <p className="o-studiju__mini">Ne samo instruktorica, već sportašica cijelog života</p>
                <img src="/potpis-solis.svg" alt="" className="o-studiju__potpis" />
              </div>
            </div>

            <div className="o-studiju__telo">
              <h2 className="sans-naslov o-studiju__naslov" data-reveal>
                O studiju
              </h2>

              <div className="o-studiju__tekst" data-reveal>
                <div>
                  <p>
                    SOLIS je studio posvećen wellness-u i transformaciji. Sa 5+ godina iskustva u reformer pilatesu,
                    moja misija je da pomognem svakoj ženi da pronađe snagu i fleksibilnost koju ima u sebi.
                  </p>
                  <a href="#treninzi" className="btn o-studiju__btn">
                    Pogledaj treninge
                  </a>
                </div>
                <div>
                  <p>
                    Specijalizujem se za početnice i za sve koje trebaju personalizovan pristup. Prvi trening je uvijek
                    sporiji, sa objašnjenjem svakog pokreta i podešavanjem aparata prema tvom tijelu.
                  </p>
                </div>
              </div>

              <div className="o-studiju__siroka" data-reveal>
                <Slika
                  ime="solis-clanice-reformer"
                  alt="Članice na treningu u studiju"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= 5. TRENINZI */}
        <section className="treninzi" id="treninzi">
          <div className="okvir treninzi__mreza">
            <div className="treninzi__lista" data-reveal>
              {TRENINZI.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={'sans-naslov treninzi__link' + (t.id === trening ? ' is-active' : '')}
                  onMouseEnter={() => setTrening(t.id)}
                  onFocus={() => setTrening(t.id)}
                  onClick={() => setTrening(t.id)}
                >
                  {t.naziv}
                </button>
              ))}
            </div>

            <div className="treninzi__sadrzaj" data-reveal>
              <div className="treninzi__medij">
                <Slika ime={aktivanTrening.slika} alt={aktivanTrening.naziv} sizes="(min-width: 768px) 55vw, 100vw" />
              </div>
              <p className="treninzi__podnaslov">{aktivanTrening.podnaslov}</p>
              <p>{aktivanTrening.opis}</p>
              <p className="treninzi__najbolje">
                <span>Najbolje za</span> {aktivanTrening.najboljeZa}
              </p>
              <a href="#cjenovnik" className="btn">
                Pogledaj cjenovnik
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================== 6. ZAŠTO PILATES */}
        <section className="zasto traka" id="zasto">
          <div className="okvir zasto__mreza">
            <div className="zasto__uvod" data-reveal>
              <h2 className="serif-naslov">
                Više od vježbe — <span className="kurziv">to je</span>{' '}
                <span className="verzal">transformacija</span>
              </h2>
              <a className="btn sakrij-na-mobilnom" href="#kontakt">
                {CTA}
              </a>
            </div>

            <div className="zasto__lista" data-reveal>
              <ul>
                {RAZLOZI.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <a className="btn samo-mobilni" href="#kontakt">
                {CTA}
              </a>
            </div>

            <div className="zasto__slika" data-reveal>
              <Slika
                ime="solis-kampanja-duo"
                alt="Solis Reformer Pilates — vježbačica u pilates pozi"
                sizes="(min-width: 1024px) 32vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* ======================================================== 7. CJENOVNIK */}
        <section className="cjenovnik" id="cjenovnik">
          <div className="okvir">
            <h2 className="serif-naslov cjenovnik__naslov" data-reveal>
              Paket koji <span className="kurziv">odgovara tebi</span>
            </h2>

            <div className="cjenovnik__mreza">
              {PAKETI.map((p) => (
                <div className="paket" key={p.naziv} data-reveal>
                  <h3 className="paket__naziv">{p.naziv}</h3>
                  <p className="paket__najbolje">
                    <span>Najbolje za</span> {p.najboljeZa}
                  </p>
                  <dl className="paket__stavke">
                    {p.stavke.map((s) => (
                      <div key={s.naziv}>
                        <dt>{s.naziv}</dt>
                        <dd>{s.cijena}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href="#kontakt" className="btn">
                    Odaberi paket
                  </a>
                </div>
              ))}
            </div>

            <p className="cjenovnik__napomena" data-reveal>
              Trening paketi vrijede 31 dan od datuma kupovine
            </p>
          </div>
        </section>

        {/* ================================================= KAMPANJSKA TRAKA */}
        <section className="kampanja">
          <div className="okvir kampanja__mreza">
            <div className="kampanja__slika" data-reveal>
              <Slika
                ime="solis-kampanja-strunjaca"
                alt="Solis Reformer Pilates — vježbačica sa strunjačom"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
            <div className="kampanja__tekst" data-reveal>
              <h2 className="serif-naslov">
                Tvojih 50 minuta <span className="kurziv">počinje ovdje</span>
              </h2>
              <p className="lead">
                Bez iskustva, bez pripreme, bez pritiska. Dođi na probni trening i osjeti kako tvoje tijelo radi nakon
                prvog sata na reformeru.
              </p>
              <a href={REZERVACIJA_LINK} className="btn">
                {CTA}
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= 8. GALERIJA */}
        <section className="galerija" id="galerija">
          <div className="okvir">
            <h2 className="serif-naslov galerija__naslov" data-reveal>
              Naša <span className="kurziv">lokacija</span>
            </h2>

            <div className="galerija__mreza">
              {GALERIJA.map((g, i) => (
                <button
                  type="button"
                  key={g.slika}
                  className="galerija__polje"
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
              <div>
                <p className="uzivo__oznaka">Studio uživo</p>
                <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <IkonaInstagram />
                  <span>@{INSTAGRAM}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== 9. UTISCI */}
        <section className="utisci">
          <h2 className="sans-naslov utisci__naslov" data-reveal>
            Šta kažu članice
          </h2>

          <div className="utisci__okvir" data-reveal>
            <button type="button" className="utisci__strelica" onClick={() => naUtisak(utisak - 1)} aria-label="Prethodni utisak">
              <Strelica smjer="prev" />
            </button>

            <div className="utisci__prozor">
              <div className="utisci__traka" style={{ transform: 'translateX(-' + utisak * 100 + '%)' }}>
                {UTISCI.map((u) => (
                  <figure className="utisci__polje" key={u.ime}>
                    <div className="utisci__kartica">
                      <Zvjezdice />
                      <blockquote>{u.tekst}</blockquote>
                      <figcaption>
                        <span className="utisci__inicijali" aria-hidden="true">
                          {inicijali(u.ime)}
                        </span>
                        <span>
                          <strong>{u.ime}</strong>
                          <em>{u.detalj}</em>
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            <button type="button" className="utisci__strelica" onClick={() => naUtisak(utisak + 1)} aria-label="Sljedeći utisak">
              <Strelica smjer="next" />
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

          <a href="#cjenovnik" className="btn">
            Pogledaj cjenovnik
          </a>
        </section>

        {/* ==================================================== ČESTA PITANJA */}
        <section className="pitanja traka-svijetla" id="pitanja">
          <div className="okvir">
            <h2 className="serif-naslov pitanja__naslov" data-reveal>
              Česta <span className="kurziv">pitanja</span>
            </h2>

            <div className="pitanja__lista">
              {PITANJA.map((q) => (
                <details className="pitanje" key={q.p} data-reveal>
                  <summary>
                    <span className="pitanje__tekst">{q.p}</span>
                    <span className="pitanje__plus" aria-hidden="true" />
                  </summary>
                  <div className="pitanje__odgovor">
                    <p>{q.o}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= 10. KONTAKT */}
        <section className="kontakt" id="kontakt">
          <div className="okvir kontakt__unutra" data-reveal>
            <h2 className="serif-naslov kontakt__naslov">
              Sprema li se <span className="kurziv">nova verzija tebe?</span>
            </h2>
            <p className="kontakt__podnaslov">
              Probni trening je prvi korak — dođeš, vidiš kako izgleda i tek onda biraš paket
            </p>

            <a className="btn btn--svijetli" href={REZERVACIJA_LINK}>
              {CTA}
            </a>

            <dl className="kontakt__podaci">
              <div>
                <dt>Lokacija</dt>
                <dd>
                  {KONTAKT.adresa}
                  <br />
                  {KONTAKT.grad}
                </dd>
              </div>
              {!jePrazno(KONTAKT.telefon) && (
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={'tel:' + KONTAKT.telefon.replace(/[^+\d]/g, '')}>{KONTAKT.telefon}</a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={'mailto:' + KONTAKT.email}>{KONTAKT.email}</a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    @{INSTAGRAM}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Radno vrijeme</dt>
                <dd>{KONTAKT.radnoVrijeme}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      {/* =========================================================== 11. FUTER */}
      <footer className="futer">
        <div className="okvir futer__mreza">
          <div className="futer__brend">
            <img src="/logo-solis-terakota.svg" alt={STUDIO} className="futer__logo" />
          </div>

          <nav className="futer__nav">
            {NAV_SVE.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="futer__forma">
            <h3>Budi prva na listi za nove termine</h3>
            <p className="futer__forma-opis">Novi termini i najave idu prvo na mejl, prije objave na Instagramu.</p>
            <form action={EMAIL_SUBMIT_ENDPOINT} method="post" onSubmit={posalji}>
              <label className="skriveno" htmlFor="email">
                Email adresa
              </label>
              <input id="email" name="email" type="email" required placeholder="tvoj@email.com" />
              <button type="submit" className="btn btn--obrnuti">
                Pošalji
              </button>
            </form>
            <p className="futer__status" role="status">
              {poslato ? 'Hvala — javljamo se uskoro.' : ' '}
            </p>

            <a className="futer__ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <IkonaInstagram />
              <span>@{INSTAGRAM}</span>
            </a>
          </div>
        </div>

        <div className="okvir futer__dno">
          <p>
            © {new Date().getFullYear()} {STUDIO}. Sva prava zadržana.
          </p>
        </div>
      </footer>

      {/* ======================================================== LIGHTBOX */}
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galerija">
          <button type="button" className="lightbox__zatvori" onClick={() => setLightbox(null)} aria-label="Zatvori">
            ✕
          </button>
          <button
            type="button"
            className="lightbox__strelica"
            onClick={() => setLightbox((i) => ((i ?? 0) - 1 + GALERIJA.length) % GALERIJA.length)}
            aria-label="Prethodna slika"
          >
            <Strelica smjer="prev" />
          </button>

          <figure className="lightbox__okvir">
            <Slika ime={GALERIJA[lightbox].slika} alt={GALERIJA[lightbox].alt} sizes="90vw" priority />
            <figcaption>{GALERIJA[lightbox].alt}</figcaption>
          </figure>

          <button
            type="button"
            className="lightbox__strelica"
            onClick={() => setLightbox((i) => ((i ?? 0) + 1) % GALERIJA.length)}
            aria-label="Sljedeća slika"
          >
            <Strelica smjer="next" />
          </button>
        </div>
      )}
    </>
  );
}

/* =============================================================== STILOVI == */

const CSS = `
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Regular-latin-ext.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
    U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113,
    U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Regular-latin.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
    U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Italic-latin-ext.woff2') format('woff2');
  font-weight: 400; font-style: italic; font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308,
    U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113,
    U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/EBGaramond-Italic-latin.woff2') format('woff2');
  font-weight: 400; font-style: italic; font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
    U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root {
  --terakota: #d4825b;
  --terakota-tamna: #b4653f;
  /* ista narandžasta, samo dublja — čista terakota na svijetloj podlozi daje
     kontrast 2.75:1, premalo za sitan tekst; ova nijansa daje 4.98:1 */
  --terakota-tekst: #a25733;
  --bijela: #ffffff;
  --pijesak: #f5f1ee;
  --ugalj: #2c2c2c;
  --taupe: #c9ada0;
  /* svijetli tonovi izvedeni iz taupe boje — za velike trake u pozadini,
     puna terakota bi na toj površini bila preteška */
  --traka-1: #eee5df;
  --traka-2: #e6d9d1;
  --prigusena: #6f625b;
  --linija: rgba(44, 44, 44, 0.18);
  --serif: 'EB Garamond', Georgia, 'Times New Roman', serif;
  --sans: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

/* Kursor je emblem iz logotipa u terakoti — blijedi preko stranice, jači nad
   linkovima i dugmadima. Samo na uređajima sa pravim mišem; na telefonu nema
   kursora, a u poljima za unos ostaje standardna crtica da se lako cilja tekst. */
@media (hover: hover) and (pointer: fine) {
  body { cursor: url('/cursor-solis.png') 16 16, auto; }
  a, button, summary, label, [role='button'] { cursor: url('/cursor-solis-aktivan.png') 16 16, pointer; }
  input, textarea, select { cursor: auto; }
}

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background-color: var(--pijesak);
  color: var(--ugalj);
  font-family: var(--sans);
  font-size: 17.5px;
  line-height: 1.62;
  word-spacing: 1px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4 { margin: 0; font-weight: 300; }
p { margin: 0 0 1rem; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
ul, dl, dd { margin: 0; padding: 0; list-style: none; }

/* max-width 1200px, kako je traženo */
.okvir { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 1.25rem; }
@media (min-width: 768px) { .okvir { padding: 0 2.5rem; } }

.kurziv { font-style: italic; }
.verzal { text-transform: uppercase; }
.skriveno {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* ---------------------------------------------------------- tipografija -- */

.serif-naslov {
  font-family: var(--serif);
  font-size: 1.75rem;
  line-height: 1.08;
}
@media (min-width: 768px) { .serif-naslov { font-size: 2.2rem; } }
@media (min-width: 1280px) { .serif-naslov { font-size: 2.5rem; } }

.sans-naslov {
  font-family: var(--sans);
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 1.45;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
@media (min-width: 1024px) { .sans-naslov { font-size: 1.7rem; } }

.tacka { color: var(--terakota); margin: 0 0.25rem; }
@media (min-width: 768px) { .tacka { margin: 0 0.5rem; } }

/* -------------------------------------------------------------- dugmad -- */
/* elipsasti okvir, kao na referentnom sajtu */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--ugalj);
  border-radius: 50%;
  padding: 0.3rem 2rem;
  font-family: var(--sans);
  font-size: 0.875rem;
  line-height: 1.6;
  text-transform: uppercase;
  color: var(--ugalj);
  background-color: transparent;
  transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
}
.btn:hover, .btn:focus-visible {
  background-color: var(--terakota);
  border-color: var(--terakota);
  color: var(--bijela);
  transform: scale(1.03);
}

.btn--svijetli { border-color: var(--bijela); color: var(--bijela); }
.btn--svijetli:hover, .btn--svijetli:focus-visible {
  background-color: var(--bijela); border-color: var(--bijela); color: var(--ugalj);
}

.btn--obrnuti { border-color: var(--terakota); color: var(--terakota); }
.btn--obrnuti:hover { background-color: var(--terakota); border-color: var(--terakota); color: var(--bijela); }

/* Na telefonu dugmad moraju biti oko 44px visoka da se lako pogode prstom;
   na desktopu ostaje tanji, elegantniji oblik. */
@media (max-width: 767px) {
  .btn { padding: 0.62rem 1.75rem; min-height: 44px; }
  .btn-trial {
    display: inline-flex; align-items: center;
    padding: 0.62rem 1.5rem; font-size: 11px; min-height: 42px;
  }
}

.btn-trial {
  position: fixed;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 500;
  border: 1px solid var(--ugalj);
  border-radius: 50%;
  background-color: var(--terakota);
  color: var(--bijela);
  padding: 0.4rem 1.6rem;
  font-family: var(--sans);
  font-size: 10px;
  text-transform: uppercase;
  transition: transform 0.25s ease, background-color 0.3s ease;
}
@media (min-width: 768px) { .btn-trial { right: 1rem; bottom: 1rem; padding: 0.4rem 2rem; } }
@media (min-width: 1024px) { .btn-trial { font-size: 14px; } }
.btn-trial:hover { transform: scale(1.05); background-color: var(--terakota-tamna); }

/* ------------------------------------------------------------ zaglavlje -- */
/* tri kolone: linkovi | logo | linkovi, apsolutno preko hero sekcije */

.zaglavlje { display: none; }
@media (min-width: 768px) {
  .zaglavlje {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 60;
    padding: 2rem 3rem;
  }
}
.nav-linkovi {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bijela);
}
.nav-linkovi a { position: relative; padding-bottom: 3px; }
.nav-linkovi a::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background-color: currentColor;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s ease;
}
.nav-linkovi a:hover::after { transform: scaleX(1); }

.zaglavlje__logo { text-align: center; }
.zaglavlje__logo img { height: 72px; width: auto; margin: 0 auto; }

/* --------------------------------------------------------- burger meni -- */

.burger {
  position: fixed;
  top: 22px; right: 14px;
  z-index: 5000;
  width: 44px; height: 30px;
}
@media (min-width: 768px) { .burger { display: none; } }
.burger span {
  position: absolute; left: 4px;
  width: 35px; height: 2px;
  background-color: var(--bijela);
  border-radius: 22px;
  transition: transform 0.4s ease, opacity 0.25s ease, top 0.35s ease, background-color 0.3s ease;
}
.burger span:nth-child(1) { top: 5px; }
.burger span:nth-child(2) { top: 14px; }
.burger span:nth-child(3) { top: 23px; }
.burger.is-open span { background-color: var(--ugalj); }
.burger.is-open span:nth-child(1) { top: 14px; transform: rotate(45deg); }
.burger.is-open span:nth-child(2) { opacity: 0; }
.burger.is-open span:nth-child(3) { top: 14px; transform: rotate(-45deg); }

.meni {
  position: fixed; inset: 0; z-index: 1001;
  background-color: rgba(238, 229, 223, 0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.5s ease;
}
.meni.is-open { opacity: 1; pointer-events: auto; }
.meni__logo { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); }
.meni__logo img { height: 56px; width: auto; }
.meni__link {
  font-family: var(--sans);
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.55rem 2rem;
  opacity: 0;
  transition: opacity 0.4s linear;
}
.meni.is-open .meni__link { opacity: 1; transition: opacity 1s linear 0.2s; }

/* ----------------------------------------------------- scroll animacije -- */

[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);
}
[data-reveal].is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .btn, .btn-trial, .utisci__traka, .galerija__polje img { transition: none; }
}

/* ---------------------------------------------------------------- hero -- */

.hero {
  position: relative;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 0 1.25rem;
}
.hero__slika { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 45%; }
.hero__veo {
  position: absolute; inset: 0;
  background:
    linear-gradient(to bottom, rgba(38, 22, 14, 0.34) 0%, rgba(38, 22, 14, 0.5) 100%),
    linear-gradient(to bottom right, rgba(212, 130, 91, 0.3), rgba(180, 101, 63, 0.22));
}
.hero__sadrzaj { position: relative; z-index: 2; color: var(--bijela); }
.hero__logo { height: 96px; width: auto; margin: 0 auto 2rem; }
@media (min-width: 768px) { .hero__logo { height: 132px; margin-bottom: 2.5rem; } }
@media (min-width: 1280px) { .hero__logo { height: 168px; } }
.hero__naslov {
  font-family: var(--serif);
  font-size: clamp(2.3rem, 8vw, 4.2rem);
  line-height: 1.05;
  margin-bottom: 1.75rem;
}
/* tanka uspravna crta između logotipa i tri riječi */
.hero__crta {
  display: block;
  width: 1px;
  height: 26px;
  margin: 0 auto 1rem;
  background-color: rgba(255, 255, 255, 0.75);
}
@media (min-width: 768px) { .hero__crta { height: 34px; margin-bottom: 1.25rem; } }

.hero__tagline {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0 0 2rem;
  font-family: var(--sans);
  font-size: 0.8rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  line-height: 1.7;
}
@media (min-width: 768px) { .hero__tagline { font-size: 0.92rem; margin-bottom: 2.5rem; } }
/* razmak zbog letter-spacinga pomjera riječi ulijevo — vraćamo ih u osu */
.hero__tagline span { text-indent: 0.26em; }

/* -------------------------------------------------------------- izjava -- */

.izjava { text-align: center; padding: 3rem 1.25rem; }
@media (min-width: 768px) { .izjava { padding: 5rem; } }
@media (min-width: 1280px) { .izjava { padding: 7rem 5rem; } }
.izjava__unutra {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 40vh;
}
@media (min-width: 1280px) { .izjava__unutra { min-height: 55vh; } }
.izjava__vodeci { margin: 2rem auto; max-width: 100%; }
@media (min-width: 768px) { .izjava__vodeci { max-width: 75%; margin: 3rem auto; } }
@media (min-width: 1024px) { .izjava__vodeci { max-width: 46%; } }

/* trake u pozadini */
.traka-svijetla { background-color: var(--traka-1); }
.traka { background-color: var(--traka-2); }

.lead { font-size: 1.02rem; color: var(--prigusena); max-width: 44ch; }

/* --------------------------------------------------- kampanjska traka -- */
/* brendirani vizual uz kratku poruku i pozivom na akciju */

.kampanja { padding: 3rem 0; }
@media (min-width: 768px) { .kampanja { padding: 5rem 0; } }
.kampanja__mreza {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}
@media (min-width: 768px) { .kampanja__mreza { grid-template-columns: 0.85fr 1fr; gap: 3.5rem; } }
/* vizual je uspravan i visok — bez ograničenja širine traka naraste preko
   ekrana, a tekst pored njega ostane da pliva u praznini */
.kampanja__slika { overflow: hidden; max-width: 420px; }
@media (max-width: 767px) { .kampanja__slika { max-width: 320px; margin: 0 auto; } }
.kampanja__slika img { width: 100%; height: auto; }
.kampanja__tekst .serif-naslov { margin-bottom: 1rem; }
.kampanja__tekst .lead { margin-bottom: 1.75rem; }

/* ----------------------------------------------------------- o studiju -- */
/* mreža od 8 kolona: portret lijevo, tekst i široka slika desno */

.o-studiju { padding: 0; }
@media (min-width: 1024px) { .o-studiju { padding-top: 2.5rem; padding-left: 2.5rem; } }
.o-studiju__mreza { display: grid; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 768px) { .o-studiju__mreza { grid-template-columns: repeat(8, 1fr); } }

.o-studiju__portret { padding: 2.5rem 1.25rem 2rem; }
@media (min-width: 768px) { .o-studiju__portret { grid-column: span 4; padding: 2.5rem 2.5rem 2rem 1.25rem; } }
@media (min-width: 1024px) { .o-studiju__portret { grid-column: span 3; } }
/* samo direktno dijete — inače pravilo pokupi i potpis ispod slike */
.o-studiju__portret > img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; }

.o-studiju__telo { padding: 0 1.25rem 3rem; }
@media (min-width: 768px) { .o-studiju__telo { grid-column: span 4; padding: 5rem 2.5rem 3rem; } }
@media (min-width: 1024px) { .o-studiju__telo { grid-column: span 5; padding-left: 0; padding-right: 5rem; } }

.o-studiju__naslov { margin-bottom: 2rem; }
@media (min-width: 1024px) { .o-studiju__naslov { margin-bottom: 3rem; } }
.o-studiju__tekst { display: grid; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 1024px) { .o-studiju__tekst { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; } }
.o-studiju__tekst p { margin-bottom: 1.5rem; color: var(--prigusena); }
.o-studiju__btn { margin-bottom: 2rem; }
.o-studiju__siroka { margin-top: 2rem; }
.o-studiju__siroka img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
@media (min-width: 1024px) { .o-studiju__siroka { margin-left: 30%; } }

/* ------------------------------------------------------------ treninzi -- */
/* lista naslova lijevo, medij i opis desno */

.treninzi { padding: 3rem 0; }
@media (min-width: 768px) { .treninzi { padding: 5rem 0; } }
.treninzi__mreza { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
@media (min-width: 768px) { .treninzi__mreza { grid-template-columns: 3fr 4fr; gap: 3rem; } }

.treninzi__lista { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; }
@media (min-width: 768px) { .treninzi__lista { gap: 4rem; padding-top: 1rem; } }
.treninzi__link { text-align: left; opacity: 0.45; transition: opacity 0.35s ease; }
.treninzi__link.is-active, .treninzi__link:hover { opacity: 1; }
.treninzi__link::after {
  content: '';
  display: block; height: 1px;
  background-color: var(--terakota);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s ease;
}
.treninzi__link.is-active::after { transform: scaleX(1); }

/* uspravan kadar — izvorne fotografije su portretne, pa se ovako gotovo ne režu */
.treninzi__medij { overflow: hidden; margin-bottom: 1.25rem; max-width: 400px; }
.treninzi__medij img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; }
.treninzi__sadrzaj p { color: var(--prigusena); margin-bottom: 1.25rem; }
.treninzi__podnaslov {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--terakota-tekst) !important; margin-bottom: 0.75rem !important;
}
.treninzi__najbolje {
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline;
  padding-top: 1rem; border-top: 1px solid var(--linija);
  font-size: 0.92rem; color: var(--ugalj) !important;
}
.treninzi__najbolje span {
  font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--terakota-tekst);
}

/* --------------------------------------------------------------- zašto -- */
/* tri kolone: naslov | lista sa „+" | slika */

.zasto { padding: 3rem 0; }
@media (min-width: 768px) { .zasto { padding: 5rem 0; } }
.zasto__mreza { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.5rem; }
@media (min-width: 768px) { .zasto__mreza { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; } }
@media (min-width: 1024px) { .zasto__mreza { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3rem; } }

@media (min-width: 1024px) { .zasto__uvod { padding-top: 5rem; } }
.zasto__uvod .serif-naslov { margin-bottom: 2rem; }
@media (min-width: 1024px) { .zasto__uvod .serif-naslov { max-width: 80%; margin-bottom: 3rem; } }
@media (min-width: 1024px) { .zasto__lista { padding-top: 4rem; } }

.zasto li {
  margin-bottom: 1.5rem;
  padding-left: 2.1em;
  text-indent: -1.1em;
  font-family: var(--sans);
  font-size: 1.05rem;
  line-height: 1.6;
  text-transform: uppercase;
}
.zasto li::before {
  content: '+';
  display: inline-block;
  vertical-align: middle;
  font-weight: 100;
  font-size: 2.2rem;
  color: var(--terakota);
  margin-right: 1rem;
}
@media (min-width: 768px) {
  .zasto li { padding-left: 2.4em; text-indent: -1.4em; font-size: 1.15rem; }
  .zasto li::before { font-size: 2.5rem; margin-right: 1.5rem; }
}
.zasto__lista ul { margin-bottom: 2rem; }

.zasto__slika { display: flex; align-items: center; }
@media (min-width: 768px) { .zasto__slika { grid-column: 1 / -1; } }
@media (min-width: 1024px) { .zasto__slika { grid-column: auto; } }
.zasto__slika img { width: 100%; }

.sakrij-na-mobilnom { display: none; }
.samo-mobilni { display: inline-flex; }
@media (min-width: 768px) {
  .sakrij-na-mobilnom { display: inline-flex; }
  .samo-mobilni { display: none; }
}

/* ----------------------------------------------------------- cjenovnik -- */
/* tri kolone razdvojene tankim linijama, bez kartica */

.cjenovnik { padding: 5rem 0; }
@media (min-width: 768px) { .cjenovnik { padding: 9rem 0; } }
@media (min-width: 1280px) { .cjenovnik { padding: 11rem 0; } }
.cjenovnik__naslov { text-align: center; margin-bottom: 4rem; }
@media (min-width: 768px) { .cjenovnik__naslov { margin-bottom: 6.5rem; } }

.cjenovnik__mreza { display: grid; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 768px) { .cjenovnik__mreza { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.paket { padding: 2.75rem 0; border-top: 1px solid var(--linija); }
.paket:last-child { border-bottom: 1px solid var(--linija); }
@media (min-width: 768px) {
  .paket { padding: 0 3rem; border-top: 0; border-left: 1px solid var(--linija); }
  .paket:first-child { border-left: 0; padding-left: 0; }
  .paket:last-child { border-bottom: 0; padding-right: 0; }
}
@media (min-width: 1280px) { .paket { padding: 0 4rem; } }

.paket__naziv {
  font-size: 0.92rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.paket__najbolje { font-size: 0.9rem; color: var(--prigusena); margin-bottom: 2.5rem; min-height: 3rem; }
.paket__najbolje span {
  display: block;
  font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--terakota-tekst); margin-bottom: 0.2rem;
}
.paket__stavke { margin-bottom: 2.75rem; }
.paket__stavke > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.05rem 0;
  border-bottom: 1px solid var(--linija);
}
.paket__stavke dt { font-size: 0.95rem; color: var(--prigusena); }
.paket__stavke dd { font-family: var(--serif); font-size: 1.4rem; white-space: nowrap; }

.cjenovnik__napomena {
  margin-top: 4.5rem;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--prigusena);
}

/* ------------------------------------------------------------ galerija -- */

.galerija { padding: 3rem 0; background-color: var(--traka-1); }
@media (min-width: 768px) { .galerija { padding: 6rem 0; } }
.galerija__naslov { text-align: center; margin-bottom: 2.5rem; }
@media (min-width: 768px) { .galerija__naslov { margin-bottom: 3.5rem; } }

.galerija__mreza { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
@media (min-width: 768px) { .galerija__mreza { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; } }

.galerija__polje { position: relative; aspect-ratio: 1 / 1; overflow: hidden; background-color: var(--taupe); }
.galerija__polje img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.galerija__polje:hover img, .galerija__polje:focus-visible img { transform: scale(1.06); }

.uzivo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.75rem;
  align-items: center;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--linija);
}
@media (min-width: 768px) { .uzivo { grid-template-columns: 240px 1fr; gap: 3rem; } }
.uzivo__video { overflow: hidden; background-color: var(--taupe); aspect-ratio: 520 / 900; max-width: 240px; }
.uzivo__video video { width: 100%; height: 100%; object-fit: cover; }
.uzivo__oznaka {
  font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--prigusena); margin-bottom: 1rem;
}

/* -------------------------------------------------------------- utisci -- */
/* centrirani slider, serif citat */

.utisci {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  text-align: center;
  padding: 3rem 1.25rem;
}
@media (min-width: 768px) { .utisci { padding: 4rem 3rem; } }
@media (min-width: 1024px) { .utisci { padding: 8rem 5rem; } }
.utisci__naslov { margin-bottom: 2.5rem; }
@media (min-width: 1024px) { .utisci__naslov { margin-bottom: 4rem; } }

.utisci__okvir { display: flex; align-items: center; gap: 0.25rem; width: 100%; max-width: 46rem; }
@media (min-width: 768px) { .utisci__okvir { gap: 1.5rem; } }
.utisci__prozor { overflow: hidden; flex: 1 1 auto; min-width: 0; }
.utisci__traka { display: flex; transition: transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1); }
.utisci__polje { flex: 0 0 100%; margin: 0; padding: 0 0.5rem; }
.utisci__kartica {
  background-color: var(--bijela);
  border: 1px solid var(--linija);
  border-radius: 4px;
  padding: 2rem 1.5rem;
}
@media (min-width: 768px) { .utisci__kartica { padding: 3rem 3.5rem; } }
.utisci__zvjezdice {
  display: flex; justify-content: center; gap: 0.25rem;
  color: var(--terakota); margin-bottom: 1.5rem;
}
.utisci__polje blockquote {
  margin: 0 0 2rem;
  font-family: var(--serif);
  font-size: clamp(1.35rem, 3.4vw, 1.9rem);
  line-height: 1.35;
}
.utisci__polje figcaption {
  display: flex; align-items: center; justify-content: center; gap: 0.85rem;
  text-align: left;
}
.utisci__inicijali {
  flex: 0 0 auto;
  width: 42px; height: 42px; border-radius: 50%;
  display: grid; place-items: center;
  background-color: var(--traka-2);
  color: var(--terakota-tekst);
  font-size: 0.82rem; letter-spacing: 0.06em;
}
.utisci__polje figcaption strong {
  display: block; font-weight: 400;
  font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase;
}
.utisci__polje figcaption em {
  display: block; font-style: normal;
  font-size: 0.75rem; color: var(--prigusena);
}
.utisci__strelica { flex: 0 0 auto; color: var(--ugalj); opacity: 0.45; padding: 0.5rem; transition: opacity 0.3s ease, transform 0.3s ease; }
.utisci__strelica:hover { opacity: 1; transform: scale(1.12); }

.utisci__tacke { display: flex; gap: 0.25rem; margin: 1.5rem 0 2.25rem; }
/* dugme je providno i 32px veliko zbog prsta; vidljiva tačka je pseudo-element */
.utisci__tacka {
  width: 40px; height: 40px;
  display: grid; place-items: center;
  background: none; border: 0;
}
.utisci__tacka::before {
  content: '';
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1px solid var(--ugalj);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.utisci__tacka.is-active::before { background-color: var(--terakota); border-color: var(--terakota); }

/* ------------------------------------------------------- česta pitanja -- */

.pitanja { padding: 3.5rem 0; }
@media (min-width: 768px) { .pitanja { padding: 6rem 0; } }
.pitanja__naslov { text-align: center; margin-bottom: 2.5rem; }
@media (min-width: 768px) { .pitanja__naslov { margin-bottom: 4rem; } }
.pitanja__lista { max-width: 760px; margin: 0 auto; }

.pitanje { border-top: 1px solid var(--linija); }
.pitanje:last-child { border-bottom: 1px solid var(--linija); }
.pitanje summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 0;
  list-style: none;
}
/* skloni podrazumijevani trouglić */
.pitanje summary::-webkit-details-marker { display: none; }
.pitanje summary::marker { content: ''; }

.pitanje__tekst {
  font-size: 0.86rem; letter-spacing: 0.12em; text-transform: uppercase;
  transition: color 0.3s ease;
}
.pitanje summary:hover .pitanje__tekst { color: var(--terakota-tekst); }

/* plus od dvije crtice — uspravna se okrene u minus kad se pitanje otvori */
.pitanje__plus { position: relative; flex: 0 0 auto; width: 16px; height: 16px; }
.pitanje__plus::before, .pitanje__plus::after {
  content: '';
  position: absolute; top: 50%; left: 0;
  width: 16px; height: 1.5px; margin-top: -0.75px;
  background-color: var(--terakota);
  transition: transform 0.35s ease;
}
.pitanje__plus::after { transform: rotate(90deg); }
.pitanje[open] .pitanje__plus::after { transform: rotate(0deg); }

.pitanje__odgovor { padding-bottom: 1.5rem; }
.pitanje__odgovor p { margin: 0; color: var(--prigusena); font-size: 0.98rem; max-width: 62ch; }

/* ----------------------------------------------- potpis uz portret -- */

.o-studiju__potpisni { margin-top: 1.5rem; }
.o-studiju__mini {
  font-family: var(--serif);
  font-size: 1.15rem;
  line-height: 1.3;
  color: var(--ugalj);
  margin-bottom: 0.75rem;
  max-width: 24ch;
}
@media (min-width: 768px) { .o-studiju__mini { font-size: 1.3rem; } }
.o-studiju__potpis { width: 150px; height: auto; opacity: 0.9; }
@media (min-width: 768px) { .o-studiju__potpis { width: 175px; } }

/* ------------------------------------------------------------- kontakt -- */

.kontakt { background-color: var(--terakota); color: var(--bijela); padding: 3.5rem 0; text-align: center; }
@media (min-width: 768px) { .kontakt { padding: 6rem 0; } }
.kontakt__naslov { margin-bottom: 1rem; }
.kontakt__podnaslov {
  font-size: 0.85rem; letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 2rem; color: rgba(255, 255, 255, 0.9);
}
.kontakt__podaci {
  display: grid; gap: 1.75rem;
  max-width: 900px; margin: 3.5rem auto 0;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
  text-align: left;
}
@media (min-width: 640px) { .kontakt__podaci { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .kontakt__podaci { grid-template-columns: repeat(4, 1fr); } }
.kontakt__podaci dt {
  font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75); margin-bottom: 0.4rem;
}
.kontakt__podaci dd { font-size: 0.95rem; }
.kontakt__podaci dd a { border-bottom: 1px solid rgba(255, 255, 255, 0.45); transition: border-color 0.3s ease; }
.kontakt__podaci dd a:hover { border-bottom-color: var(--bijela); }

/* --------------------------------------------------------------- futer -- */

/* bijelo-bež podloga, terakota tekst — nijansa svjetlija od pozadine stranice
   da se futer čita kao zasebna traka ispod terakota kontakt sekcije */
.futer {
  background-color: #faf7f4;
  color: var(--terakota);
  padding: 3rem 0 1.5rem;
}
@media (min-width: 1024px) { .futer { padding: 5rem 0 1.5rem; } }
.futer__mreza { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.5rem; }
@media (min-width: 1024px) { .futer__mreza { grid-template-columns: 1.1fr 0.9fr 1fr; gap: 3rem; } }
.futer__logo { height: 72px; width: auto; }
.futer__nav { columns: 2; column-gap: 1rem; }
.futer__nav a {
  display: block; margin-bottom: 0.9rem;
  font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--terakota-tekst);
  transition: opacity 0.3s ease;
}
.futer__nav a:hover { opacity: 0.6; }

.futer__forma h3 {
  font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 0.5rem;
  color: var(--terakota-tekst);
}
.futer__forma-opis { font-size: 0.86rem; color: var(--terakota-tekst); margin-bottom: 1.25rem; max-width: 26rem; }
.futer__forma form { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.futer__forma input {
  flex: 1 1 12rem;
  min-width: 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(212, 130, 91, 0.45);
  color: var(--terakota-tamna);
  font-family: var(--sans);
  font-size: 0.95rem;
  padding: 0.5rem 0.25rem;
}
.futer__forma input::placeholder { color: rgba(212, 130, 91, 0.55); }
.futer__forma input:focus { outline: none; border-bottom-color: var(--terakota); }
.futer__status {
  margin: 0.75rem 0 0; min-height: 1.2em;
  font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terakota-tamna);
}
.futer__ig {
  display: inline-flex; align-items: center; gap: 0.6rem;
  margin-top: 1.25rem; font-size: 0.82rem;
  color: var(--terakota-tekst);
  transition: opacity 0.3s ease;
}
.futer__ig:hover { opacity: 0.65; }

.futer__dno {
  margin-top: 2.5rem; padding-top: 1.25rem;
  border-top: 1px solid rgba(212, 130, 91, 0.28);
}
.futer__dno p { margin: 0; font-size: 0.78rem; color: var(--terakota-tekst); }
/* copyright ostaje lijevo — desno ga prekriva fiksno dugme za rezervaciju */
.futer { padding-bottom: 2.5rem; }

/* ------------------------------------------------------------ lightbox -- */

.lightbox {
  position: fixed; inset: 0; z-index: 9000;
  background-color: rgba(28, 18, 14, 0.95);
  display: flex; align-items: center; justify-content: center;
  gap: 0.5rem; padding: 3.5rem 0.75rem;
  animation: lbIn 0.25s ease;
}
@keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
.lightbox__okvir { margin: 0; max-width: min(1100px, 92vw); text-align: center; }
.lightbox__okvir img { max-height: 78vh; width: auto; margin: 0 auto; }
.lightbox__okvir figcaption {
  margin-top: 1rem; font-size: 0.78rem; letter-spacing: 0.1em; color: rgba(245, 241, 238, 0.7);
}
.lightbox__zatvori {
  position: absolute; top: 1rem; right: 1.25rem;
  color: var(--pijesak); font-size: 1.4rem; line-height: 1; padding: 0.5rem;
}
.lightbox__strelica { flex: 0 0 auto; color: var(--pijesak); opacity: 0.75; padding: 0.75rem; }
.lightbox__strelica:hover { opacity: 1; }
`;
