const API_ADRESA = "http://localhost:3000";

async function zahtev(putanja, opcije = {}) {
  let odgovor;
  try {
    odgovor = await fetch(API_ADRESA + putanja, {
      headers: { "Content-Type": "application/json" },
      ...opcije
    });
  } catch (greska) {
    throw new Error("Servis za podatke nije dostupan. Proverite da li je json-server pokrenut.");
  }
  if (!odgovor.ok) {
    throw new Error("Zahtev nije uspeo (status " + odgovor.status + ").");
  }
  return odgovor.json();
}

function ucitaj(putanja) {
  return zahtev(putanja);
}

function kreiraj(putanja, podaci) {
  return zahtev(putanja, { method: "POST", body: JSON.stringify(podaci) });
}

function izmeni(putanja, podaci) {
  return zahtev(putanja, { method: "PUT", body: JSON.stringify(podaci) });
}

function promeni(putanja, podaci) {
  return zahtev(putanja, { method: "PATCH", body: JSON.stringify(podaci) });
}

function obrisi(putanja) {
  return zahtev(putanja, { method: "DELETE" });
}
