const formaRegistracija = document.getElementById("forma-registracija");
const porukaRegistracija = document.getElementById("poruka");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFON_REGEX = /^06\d{7,8}$/;

if (zahtevajGosta()) {
  prikaziZaglavlje("registracija");
}

function procitajPolje(id) {
  return document.getElementById(id).value.trim();
}

function proveriRegistraciju(podaci, potvrda) {
  if (!podaci.ime || !podaci.prezime || !podaci.email || !podaci.adresa || !podaci.grad || !podaci.telefon) {
    return "Popunite sva polja.";
  }
  if (!EMAIL_REGEX.test(podaci.email)) {
    return "Email adresa nije ispravna.";
  }
  if (!TELEFON_REGEX.test(podaci.telefon)) {
    return "Telefon mora da počinje sa 06 i da ima 9 ili 10 cifara.";
  }
  if (podaci.lozinka.length < 6) {
    return "Lozinka mora da ima najmanje 6 karaktera.";
  }
  if (podaci.lozinka !== potvrda) {
    return "Lozinke se ne poklapaju.";
  }
  return "";
}

formaRegistracija.addEventListener("submit", async (dogadjaj) => {
  dogadjaj.preventDefault();
  const podaci = {
    ime: procitajPolje("ime"),
    prezime: procitajPolje("prezime"),
    email: procitajPolje("email").toLowerCase(),
    telefon: procitajPolje("telefon").replace(/\s/g, ""),
    adresa: procitajPolje("adresa"),
    grad: procitajPolje("grad"),
    lozinka: document.getElementById("lozinka").value
  };
  const greskaUnosa = proveriRegistraciju(podaci, document.getElementById("potvrda").value);
  if (greskaUnosa) {
    prikaziPoruku(porukaRegistracija, greskaUnosa);
    return;
  }

  try {
    const postojeci = await ucitaj("/korisnici?email=" + encodeURIComponent(podaci.email));
    if (postojeci.length > 0) {
      prikaziPoruku(porukaRegistracija, "Nalog sa ovom email adresom već postoji.");
      return;
    }
    await kreiraj("/korisnici", {
      ...podaci,
      uloga: "kupac",
      datumRegistracije: new Date().toISOString()
    });
    window.location.href = "prijava.html?poruka=registracija";
  } catch (greska) {
    prikaziPoruku(porukaRegistracija, greska.message);
  }
});
