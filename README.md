# Pako

Projekat iz predmeta IT354 Veb sistemi 1, školska 2026/2027. godina.

Student: Đorđe Čolović 6124

## Tema

Pako je online knjižara. Kupac pregleda katalog, pretražuje i filtrira knjige, stavlja ih u korpu, poručuje uz plaćanje pouzećem, prati svoje porudžbine i piše recenzije. Administrator uređuje knjige, autore i žanrove, menja status porudžbina, upravlja korisnicima i prati prodaju.

Entiteti: korisnik, žanr, autor, knjiga, porudžbina, stavka porudžbine i recenzija.

## Faze

| Faza | Podfolder | Tehnologije | Status |
|---|---|---|---|
| 1 | faza-1 | HTML, CSS, JavaScript, fetch | u izradi |
| 2 | faza-2 | React, React Router, običan CSS | nije započeta |
| 3 | faza-3 | Tailwind CSS, useContext | nije započeta |
| 4 | faza-4 | nova biblioteka | nije započeta |
| 5 | faza-5 | AI servis preko API-ja | nije započeta |

## Faza 1

Urađeno:

- struktura projekta i početni podaci
- stilovi za sve stranice
- zajedničke funkcije za rad sa servisom, sesijom i korpom

## Servis za podatke

Sve faze koriste isti json-server. Početni podaci se nalaze u fajlu `server/db.json`.

```
cd server
npm install
npm start
```

Servis radi na adresi http://localhost:3000.

## Pokretanje faze 1

Faza 1 se pokreće zajedno sa servisom, jer json-server poslužuje i HTML stranice iz foldera `faza-1`:

```
cd server
npm install
npm run faza1
```

Aplikacija je dostupna na adresi http://localhost:3000.

## Test nalozi

| Uloga | Email | Lozinka |
|---|---|---|
| administrator | admin@pako.rs | admin123 |
| kupac | marko@pako.rs | marko123 |
| kupac | ana@pako.rs | ana123 |
