const KLJUC_SESIJE = "pakoKorisnik";

function trenutniKorisnik() {
  const sacuvan = localStorage.getItem(KLJUC_SESIJE);
  if (!sacuvan) {
    return null;
  }
  return JSON.parse(sacuvan);
}

function sacuvajKorisnika(korisnik) {
  const { lozinka, ...bezLozinke } = korisnik;
  localStorage.setItem(KLJUC_SESIJE, JSON.stringify(bezLozinke));
}

function odjava() {
  localStorage.removeItem(KLJUC_SESIJE);
  window.location.href = "index.html?poruka=odjava";
}

function zahtevajPrijavu() {
  const korisnik = trenutniKorisnik();
  if (!korisnik) {
    window.location.replace("prijava.html?poruka=prijava");
    return null;
  }
  return korisnik;
}

function zahtevajAdmina() {
  const korisnik = zahtevajPrijavu();
  if (korisnik && korisnik.uloga !== "admin") {
    window.location.replace("katalog.html?poruka=zabranjeno");
    return null;
  }
  return korisnik;
}

function zahtevajGosta() {
  const korisnik = trenutniKorisnik();
  if (korisnik) {
    window.location.replace(korisnik.uloga === "admin" ? "admin.html" : "katalog.html");
    return false;
  }
  return true;
}

function kljucKorpe() {
  const korisnik = trenutniKorisnik();
  return "pakoKorpa-" + (korisnik ? korisnik.id : "gost");
}

function ucitajKorpu() {
  const sacuvana = localStorage.getItem(kljucKorpe());
  if (!sacuvana) {
    return [];
  }
  return JSON.parse(sacuvana);
}

function sacuvajKorpu(korpa) {
  localStorage.setItem(kljucKorpe(), JSON.stringify(korpa));
}

function dodajUKorpu(knjigaId, kolicina, naStanju) {
  const korpa = ucitajKorpu();
  const postojeca = korpa.find((stavka) => stavka.knjigaId === knjigaId);
  const vecUKorpi = postojeca ? postojeca.kolicina : 0;
  if (vecUKorpi + kolicina > naStanju) {
    return false;
  }
  if (postojeca) {
    postojeca.kolicina += kolicina;
  } else {
    korpa.push({ knjigaId, kolicina });
  }
  sacuvajKorpu(korpa);
  return true;
}

function brojUKorpi() {
  return ucitajKorpu().reduce((zbir, stavka) => zbir + stavka.kolicina, 0);
}

function isprazniKorpu() {
  localStorage.removeItem(kljucKorpe());
}
