const PORUKE = {
  prijava: { tekst: "Za pristup ovoj stranici potrebno je da se prijavite.", tip: "info" },
  zabranjeno: { tekst: "Nemate pravo pristupa administratorskom panelu.", tip: "greska" },
  odjava: { tekst: "Uspešno ste se odjavili.", tip: "uspeh" },
  registracija: { tekst: "Nalog je napravljen. Sada se možete prijaviti.", tip: "uspeh" },
  poruceno: { tekst: "Porudžbina je primljena. Hvala na kupovini!", tip: "uspeh" },
  nepostoji: { tekst: "Tražena knjiga ne postoji.", tip: "greska" }
};

const STATUSI = ["nova", "poslata", "isporučena", "otkazana"];

function procitajParametar(naziv) {
  const delovi = window.location.search.slice(1).split("&");
  for (const deo of delovi) {
    const [kljuc, vrednost] = deo.split("=");
    if (kljuc === naziv) {
      return decodeURIComponent(vrednost || "");
    }
  }
  return null;
}

function ocisti(tekst) {
  return String(tekst)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function prikaziZaglavlje(aktivna) {
  const korisnik = trenutniKorisnik();
  const linkovi = [
    { stranica: "index", adresa: "index.html", tekst: "Početna" },
    { stranica: "katalog", adresa: "katalog.html", tekst: "Katalog" }
  ];
  if (korisnik) {
    linkovi.push({ stranica: "korpa", adresa: "korpa.html", tekst: "Korpa <span class=\"broj-korpa\" id=\"broj-korpa\">" + brojUKorpi() + "</span>" });
    linkovi.push({ stranica: "porudzbine", adresa: "moje-porudzbine.html", tekst: "Moje porudžbine" });
  }
  if (korisnik && korisnik.uloga === "admin") {
    linkovi.push({ stranica: "admin", adresa: "admin.html", tekst: "Admin panel" });
  }

  const meni = linkovi
    .map((link) => `<a href="${link.adresa}" class="${link.stranica === aktivna ? "aktivan" : ""}">${link.tekst}</a>`)
    .join("");

  const desno = korisnik
    ? `<span>Zdravo, ${ocisti(korisnik.ime)}</span>
       <button type="button" class="dugme dugme-svetlo dugme-malo" onclick="odjava()">Odjava</button>`
    : `<a href="prijava.html" class="dugme dugme-svetlo dugme-malo">Prijava</a>
       <a href="registracija.html" class="dugme dugme-malo">Registracija</a>`;

  document.getElementById("zaglavlje").innerHTML = `
    <div class="zaglavlje-sadrzaj">
      <a href="index.html" class="logo">Pak<span>o</span></a>
      <nav class="meni">${meni}</nav>
      <div class="korisnik-info">${desno}</div>
    </div>
  `;
}

function osveziBrojUKorpi() {
  const broj = document.getElementById("broj-korpa");
  if (broj) {
    broj.textContent = brojUKorpi();
  }
}

function prikaziPoruku(element, tekst, tip = "greska") {
  element.textContent = tekst;
  element.className = "poruka poruka-" + tip;
}

function sakrijPoruku(element) {
  element.textContent = "";
  element.className = "poruka sakriveno";
}

function prikaziPorukuIzAdrese(element) {
  const kod = procitajParametar("poruka");
  if (kod && PORUKE[kod]) {
    prikaziPoruku(element, PORUKE[kod].tekst, PORUKE[kod].tip);
  }
}

function formatCena(cena) {
  return cena + " din";
}

function formatDatum(datum) {
  return new Date(datum).toLocaleDateString("sr-RS");
}

function imeAutora(autor) {
  return autor ? autor.ime + " " + autor.prezime : "Nepoznat autor";
}

function prosecnaOcena(recenzije) {
  if (recenzije.length === 0) {
    return 0;
  }
  const zbir = recenzije.reduce((ukupno, recenzija) => ukupno + recenzija.ocena, 0);
  return zbir / recenzije.length;
}

function zvezdice(ocena) {
  const pune = Math.round(ocena);
  return "★".repeat(pune) + "☆".repeat(5 - pune);
}

function koricaHTML(knjiga, autor) {
  return `
    <div class="korica" style="background-color: ${knjiga.boja}">
      <span class="korica-naslov">${ocisti(knjiga.naslov)}</span>
      <span class="korica-autor">${ocisti(imeAutora(autor))}</span>
    </div>
  `;
}

function knjigaKarticaHTML(knjiga, autor, recenzije) {
  const recenzijeKnjige = recenzije.filter((recenzija) => recenzija.knjigaId === knjiga.id);
  const ocena = recenzijeKnjige.length > 0
    ? `<span class="ocena">${zvezdice(prosecnaOcena(recenzijeKnjige))} (${recenzijeKnjige.length})</span>`
    : `<span class="ocena">Bez ocena</span>`;
  const stanje = knjiga.naStanju > 0 ? ocena : `<span class="nema-na-stanju">Nema na stanju</span>`;
  return `
    <article class="knjiga-kartica">
      <a href="knjiga.html?id=${knjiga.id}">${koricaHTML(knjiga, autor)}</a>
      <h3><a href="knjiga.html?id=${knjiga.id}">${ocisti(knjiga.naslov)}</a></h3>
      <p class="autor">${ocisti(imeAutora(autor))}</p>
      <div class="knjiga-dno">
        <span class="cena">${formatCena(knjiga.cena)}</span>
        ${stanje}
      </div>
    </article>
  `;
}

function izracunajDostavu(iznos) {
  return iznos >= 3000 || iznos === 0 ? 0 : 300;
}
