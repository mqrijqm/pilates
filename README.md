# Solis Reformer Pilates — Banja Luka

Next.js (App Router) + TypeScript. **Cijela stranica je u jednom fajlu:** `app/page.tsx`
— markup, stanje i sav CSS. Bez Tailwinda, bez ijedne biblioteke osim Reacta.

## Pokretanje

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Build za produkciju: `pnpm build` pa `pnpm start`. Deploy na Vercel radi bez podešavanja.

> **Windows napomena:** projekat se mora pokretati iz putanje `C:\Users\marija\Projects\pilates`
> (veliko **P** u `Projects`). Ako se pokrene iz `projects\`, pnpm i Next učitaju iste
> module preko dvije različito napisane putanje, dobiju se dvije kopije Reacta i
> stranica pukne na `invariant expected layout router to be mounted`.

---

## Šta još treba dopuniti

Sve je na vrhu `app/page.tsx`, u sekciji `KONFIG`, osim bio teksta koji je u markupu.

| Gdje | Šta fali |
|---|---|
| `KONTAKT.telefon` | broj telefona |
| `KONTAKT.email` | email adresa |
| `KONTAKT.radnoVrijeme` | npr. „Pon–Sub, 07:00–21:00" |
| `LINK_APLIKACIJE` | link ka aplikaciji za rezervaciju termina |
| `EMAIL_SUBMIT_ENDPOINT` | gdje forma šalje podatke (vidi niže) |
| sekcija `instruktorica` | `[BIO]` i `[CERTIFIKATI]` — ime, iskustvo, škola |
| `UTISCI` | treći utisak je placeholder |

### Forma za kontakt

Forma trenutno samo prikaže poruku zahvale — ne šalje nigdje. Kad bude poznat endpoint:

```tsx
const posalji = async (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  await fetch(EMAIL_SUBMIT_ENDPOINT, { method: 'POST', body: data });
  setPoslato(true);
};
```

Najbrža opcija bez backenda: [Formspree](https://formspree.io) ili Vercel serverless ruta.

### Utisci — provjeri prije objave

Prva dva utiska su **stvarni javni komentari** sa Instagram profila studija
(`@solisreformerbl`), skraćeni na ime i inicijal. Prije nego sajt ode uživo,
zatraži saglasnost autorki ili ih zamijeni utiscima koje studio prikupi direktno.
Treći je označen kao placeholder.

---

## Sadržaj koji je već ubačen

Preuzeto sa Instagram profila studija i iz materijala koje je klijent poslao:

- **Adresa:** Vojvode Stepe Stepanovića 171F, Banja Luka
- **Cjenovnik:** sva tri paketa sa tačnim cijenama + napomena „paketi vrijede 31 dan"
- **Šest razloga** u sekciji „Zašto pilates" — preuzeto sa grafike studija
- **Citat** „Status: nedostupna… ne diraj me narednih 50 minuta" — objava studija

---

## Slike i video

Originali su bili screenshotovi Instagrama, sa vidljivim UI-jem (sidebar sa komentarima,
dugmad za zvuk, crne trake). Sve je izmjereno po pikselima, isječeno i konvertovano u WebP.

Svaka slika postoji u dvije rezolucije — `-700.webp` i `-1400.webp`. Komponenta `<Slika />`
ih servira kroz `srcSet`, pa telefon skida manju verziju.

| Fajl | Gdje se koristi |
|---|---|
| `solis-studio-panorama` | hero pozadina, galerija |
| `solis-zasto-pilates` | grafika u sekciji „Zašto pilates" |
| `solis-detalj-pampas` | pozadina citata „50 minuta" |
| `solis-instruktorica` | sekcija o instruktorici (glavna) |
| `solis-instruktorica-pocetnici` | sekcija o instruktorici (mala, preklopljena) |
| `solis-clanice-reformer`, `solis-render`, `solis-balans`, `solis-zajednica`, `solis-reformer-detalj` | galerija |
| `solis-studio-poster` | poster frame za video |

**Video** (`public/video/solis-studio.mp4`): snimak ekrana Instagram reela od 35 MB,
isječen na sam reel i prekodiran na **787 KB** (520×900, bez zvuka, h264).

Render `Screenshot ... 194216.png` **nije korišten** — ima vodeni žig „CUBO DESIGN".

### Zamjena slike

```tsx
<Slika ime="solis-studio-panorama" alt="Opis slike" sizes="100vw" />
```

Ubaci nove fajlove u `public/images/` po istom obrascu (`ime-700.webp` i `ime-1400.webp`)
i promijeni samo `ime`.

---

## Boje

| Uloga | Hex | CSS varijabla |
|---|---|---|
| Primarna (terakota) | `#D4825B` | `--terakota` |
| Terakota tamnija (hover) | `#B4653F` | `--terakota-tamna` |
| Krem (logo, tekst na terakoti) | `#F1E6DC` | `--krem` |
| Pozadina | `#F5F1EE` | `--pijesak` |
| Taupe | `#C9ADA0` | `--taupe` |
| Tekst | `#2C2C2C` | `--ugalj` |
| Prigušeni tekst | `#7D6C62` | `--prigusena` |

## Tipografija

- **Naslovi: EB Garamond** (serif, self-hostovan, OFL). Odstupanje od prvobitne ideje
  o sans-serif naslovima — logo studija je serif, a i grafika „Zašto sam počela sa
  pilatesom" koristi serif, pa naslovi prate glas brenda. Ako želiš sans naslove,
  promijeni `--serif` na `--sans` u `.display`, `.naslov`, `.citat__tekst`.
- **Sve ostalo: Helvetica Neue / Arial** (sistemski stack), u verzalu sa razmaknutim
  slovima za labele, dugmad i navigaciju.

Font ima potpunu podršku za bosanski (č, ć, ž, š, đ) i pravi italic rez.
Podijeljen je na `latin` i `latin-ext` — browser skida latin-ext samo kad treba.

Bez Google Fonts CDN-a — fontovi idu sa istog domena.

---

## Sekcije, redom

1. Navigacija — providna preko hero sekcije, dobija podlogu na scroll; burger ispod 1024px
2. Hero — panorama studija, terakota veo, naslov i dva CTA-a
3. Zašto pilates — grafika studija + šest razloga
4. Citat „50 minuta" — puna širina
5. Cjenovnik — tri paketa, „8 termina" označeno kao najtraženije
6. Instruktorica — dvije slike + bio + tri fakta
7. Galerija — 3×2 grid, klik otvara lightbox (strelice, Esc)
8. Studio uživo — video + link na Instagram
9. Utisci — slider na terakoti, auto-rotacija 6s
10. Kontakt — CTA ka aplikaciji, podaci i forma
11. Footer

## Responsive

Mobile-first. Prelomne tačke: **768px** (tablet) i **1024px** (desktop).
Maksimalna širina sadržaja 1240px.

## Animacije

- Fade-in na scroll preko `IntersectionObserver` (atribut `data-reveal`)
- Hover: dugmad se blago podižu, slike u galeriji zumiraju
- Sve se gasi kad je uključeno `prefers-reduced-motion`
