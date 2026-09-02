# Pilates studio — klon layouta pilateswithharriet.com

Next.js (App Router) + TypeScript. **Cijela stranica je u jednom fajlu:** `app/page.tsx`
— markup, stanje i sav CSS. Bez Tailwinda, bez ijedne biblioteke osim Reacta.

Sav tekst na stranici je na bosanskom.

## Pokretanje

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Build za produkciju: `pnpm build` pa `pnpm start`. Deploy na Vercel radi bez podešavanja.

## Šta klijent mijenja

Sve na vrhu `app/page.tsx`, u sekciji `KONFIG`:

| Konstanta | Šta je |
|---|---|
| `STUDIO_NAME` | naziv studija (ide u navigaciju, hero i footer) |
| `STUDIO_TAGLINE` | tagline ispod naziva u hero sekciji |
| `FOUNDER_NAME` | ime instruktorice / osnivačice |
| `INSTAGRAM_HANDLE` | handle iznad galerije |
| `EMAIL_SUBMIT_ENDPOINT` | endpoint za newsletter / booking formu |
| `LIST_ITEMS`, `FEATURES_LEFT/RIGHT`, `TESTIMONIALS`, `CLASS_TYPES` | tekstovi sekcija |

### Slike

Svaka slika je sivi `<div>` s oznakom `IMAGE_PLACEHOLDER_1` … `_16`, kroz komponentu `<Ph n={…} />`.
Aspect-ratio je već postavljen kao na originalu, pa layout ne skače kad se ubace prave slike.

| # | Gdje je |
|---|---|
| 1 | hero pozadina (preko cijelog ekrana) |
| 2 | slika u plavoj „Online pilates studio" sekciji |
| 3 | video / on-demand snimak u sredini feature sekcije |
| 4 | portret instruktorice (3:4) |
| 5 | široka slika ispod teksta o instruktorici (16:9) |
| 6, 7, 8 | video za svaki tip časa (tonus / istezanje / početnici) |
| 9–16 | Instagram galerija (kvadrat) |

Zamjena jednog placeholdera:

```tsx
// prije
<Ph n={4} className="aspect-portrait" />

// poslije
<img src="/images/instruktorica.jpg" alt="" className="aspect-portrait" />
```

### Fontovi

- **Serif:** EB Garamond (OFL, besplatan), self-hostovan u `public/fonts/` kao woff2.
  Original sajt koristi Instrument Serif.
  Podijeljen je na `latin` i `latin-ext` podskup preko `unicode-range` — browser skida
  latin-ext samo kada stranica zaista koristi č, ć, đ i slična slova.
- **Sans:** Helvetica Neue / Helvetica / Arial (sistemski stack).
  Original koristi Neue Haas Grotesk Display 35 ExtraLight — Helvetica je isti dizajn,
  pa je razlika minimalna. Ako klijent kupi Neue Haas licencu, dodaj `@font-face` i
  promijeni samo `--sans` u CSS-u.

Bez Google Fonts CDN-a — fontovi se serviraju s istog domena, nema eksternih zahtjeva.

> **Zašto ne ITC Garamond Light Narrow:** taj rez nema glyphove za **č, ć, đ, Č, Ć, Đ**
> (ima ž i š), pa bi browser ta slova podmetao iz sistemskog fonta i u naslovima bi se
> miješala dva pisma. EB Garamond ima potpunu podršku za bosanski i pravi italic rez.

## Boje (izvučene iz originalnog CSS-a sajta)

| Uloga | Hex | CSS varijabla |
|---|---|---|
| Pozadina | `#F6F5F4` | `--light` |
| Tekst | `#29271A` | `--dark` |
| Primary (sekcije, footer) | `#D5DFDF` | `--blue` |
| Secondary (Upoznaj / booking) | `#E6DED2` | `--sand` |
| Linije, ivice dugmadi | `#282919` | `--line` |
| Placeholder slika | `#D0D0D0` | `--ph` |

## Sekcije, redom

1. Header (desktop, tri kolone: linkovi — logo — linkovi)
2. Burger meni (ispod 768px, preko cijelog ekrana)
3. Fiksno „Započni probni period" dugme, dolje desno
4. Hero, pun ekran
5. „Ojačaj • Istegni • Transformiši"
6. „Online pilates studio…" — lista prednosti + slika
7. Feature sekcija s videom u sredini
8. Upoznaj [instruktoricu]
9. Utisci klijenata — slider, auto-rotacija na 5s, strelice i tačkice
10. Tipovi časova — hover/klik mijenja video i opis
11. Instagram galerija (hover zoom)
12. Booking — email forma
13. Footer — linkovi, društvene mreže, copyright

## Responsive

Mobile-first. Prelomne tačke: **768px** (tablet, 2 kolone), **1024px** i **1280px** (desktop, 3+ kolone).
Maksimalna širina sadržaja: 1280px.

## Animacije

- Fade-in na scroll preko `IntersectionObserver` (atribut `data-reveal`) — bez biblioteka
- Hover na dugmadima: promjena boje + `scale`
- Galerija: zoom slike unutar okvira
- Sve se gasi kad je uključeno `prefers-reduced-motion`
