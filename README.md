# Pilates studio — klon layouta pilateswithharriet.com

Next.js (App Router) + TypeScript. **Cela stranica je u jednom fajlu:** `app/page.tsx`
— markup, stanje i sav CSS. Bez Tailwinda, bez ijedne biblioteke osim Reacta.

## Pokretanje

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Build za produkciju: `pnpm build` pa `pnpm start`. Deploy na Vercel radi bez podešavanja.

## Šta klijent menja

Sve na vrhu `app/page.tsx`, u sekciji `KONFIG`:

| Konstanta | Šta je |
|---|---|
| `STUDIO_NAME` | naziv studija (ide u navbar, hero, footer) |
| `STUDIO_TAGLINE` | tagline ispod naziva u hero sekciji |
| `FOUNDER_NAME` | ime instruktora / osnivača |
| `INSTAGRAM_HANDLE` | handle iznad galerije |
| `EMAIL_SUBMIT_ENDPOINT` | endpoint za newsletter / booking formu |
| `LIST_ITEMS`, `FEATURES_LEFT/RIGHT`, `TESTIMONIALS`, `CLASS_TYPES` | tekstovi sekcija |

### Slike

Svaka slika je siv `<div>` sa oznakom `IMAGE_PLACEHOLDER_1` … `_16`, kroz komponentu `<Ph n={…} />`.
Aspect-ratio je već postavljen kao na originalu, pa layout ne skače kad se ubace prave slike.

| # | Gde je |
|---|---|
| 1 | hero pozadina (full screen) |
| 2 | slika u plavoj „The Online Pilates studio" sekciji |
| 3 | video / on-demand snimak u sredini feature sekcije |
| 4 | portret instruktora (3:4) |
| 5 | široka slika ispod teksta o instruktoru (16:9) |
| 6, 7, 8 | video za svaki tip časa (Sculpt & Tone / Stretch / Beginners) |
| 9–16 | Instagram galerija (kvadrat) |

Zamena jednog placeholdera:

```tsx
// pre
<Ph n={4} className="aspect-portrait" />

// posle
<img src="/images/harriet.jpg" alt="" className="aspect-portrait" />
```

### Fontovi

- **Serif:** ITC Garamond Std Light Narrow — `public/fonts/`, učitava se preko `@font-face`.
  Original sajt koristi Instrument Serif.
- **Sans:** Helvetica Neue / Helvetica / Arial (sistemski stack).
  Original koristi Neue Haas Grotesk Display 35 ExtraLight — Helvetica je isti dizajn,
  pa je razlika minimalna. Ako klijent kupi Neue Haas licencu, dodaj `@font-face` i
  promeni samo `--sans` u CSS-u.

Bez Google Fonts — nema eksternih zahteva pri učitavanju.

## Boje (izvučene iz originalnog CSS-a sajta)

| Uloga | Hex | CSS varijabla |
|---|---|---|
| Pozadina | `#F6F5F4` | `--light` |
| Tekst | `#29271A` | `--dark` |
| Primary (sekcije, footer) | `#D5DFDF` | `--blue` |
| Secondary (Meet / booking) | `#E6DED2` | `--sand` |
| Linije, ivice dugmadi | `#282919` | `--line` |
| Placeholder slika | `#D0D0D0` | `--ph` |

## Sekcije, redom

1. Header (desktop, tri kolone: linkovi — logo — linkovi)
2. Burger meni (ispod 768px, fullscreen overlay)
3. Fiksno „Start your trial" dugme, dole desno
4. Hero, pun ekran
5. „Strengthen • Lengthen • Transform"
6. „The Online Pilates studio…" — lista prednosti + slika
7. Feature sekcija sa videom u sredini
8. Meet [instruktor]
9. Testimonials — slider, auto-rotacija na 5s, strelice i tačkice
10. Tipovi časova — hover/klik menja video i opis
11. Instagram galerija (hover zoom)
12. Booking — email forma
13. Footer — linkovi, društvene mreže, copyright

## Responsive

Mobile-first. Prelomne tačke: **768px** (tablet, 2 kolone), **1024px** i **1280px** (desktop, 3+ kolone).
Maksimalna širina sadržaja: 1280px.

## Animacije

- Fade-in na scroll preko `IntersectionObserver` (atribut `data-reveal`) — bez biblioteka
- Hover na dugmadima: promena boje + `scale`
- Galerija: zoom slike unutar okvira
- Sve se gasi kad je uključeno `prefers-reduced-motion`
