const porukaKatalog = document.getElementById("poruka");
const listaKnjiga = document.getElementById("lista-knjiga");
const brojRezultata = document.getElementById("broj-rezultata");
const poljePretraga = document.getElementById("pretraga");
const filterZanr = document.getElementById("filter-zanr");
const filterPovez = document.getElementById("filter-povez");
const filterCena = document.getElementById("filter-cena");
const samoNaStanju = document.getElementById("samo-na-stanju");
const sortiranje = document.getElementById("sortiranje");

let sveKnjige = [];
let sviAutori = [];
let sveRecenzije = [];

prikaziZaglavlje("katalog");
prikaziPorukuIzAdrese(porukaKatalog);

function nadjiAutora(knjiga) {
  return sviAutori.find((autor) => autor.id === knjiga.autorId);
}

function odgovaraCeni(cena, opseg) {
  if (opseg === "do-1000") {
    return cena <= 1000;
  }
  if (opseg === "1000-1500") {
    return cena > 1000 && cena <= 1500;
  }
  if (opseg === "preko-1500") {
    return cena > 1500;
  }
  return true;
}

function sortiraj(knjige) {
  const kopija = [...knjige];
  if (sortiranje.value === "cena-rastuce") {
    return kopija.sort((a, b) => a.cena - b.cena);
  }
  if (sortiranje.value === "cena-opadajuce") {
    return kopija.sort((a, b) => b.cena - a.cena);
  }
  if (sortiranje.value === "godina") {
    return kopija.sort((a, b) => b.godina - a.godina);
  }
  return kopija.sort((a, b) => a.naslov.localeCompare(b.naslov, "sr"));
}

function prikaziKnjige() {
  const tekst = poljePretraga.value.trim().toLowerCase();
  const filtrirane = sveKnjige.filter((knjiga) => {
    const autor = imeAutora(nadjiAutora(knjiga)).toLowerCase();
    const odgovaraTekstu = knjiga.naslov.toLowerCase().includes(tekst) || autor.includes(tekst);
    const odgovaraZanru = filterZanr.value === "" || knjiga.zanrId === Number(filterZanr.value);
    const odgovaraPovezu = filterPovez.value === "" || knjiga.povez === filterPovez.value;
    const odgovaraStanju = !samoNaStanju.checked || knjiga.naStanju > 0;
    return odgovaraTekstu && odgovaraZanru && odgovaraPovezu && odgovaraStanju && odgovaraCeni(knjiga.cena, filterCena.value);
  });

  brojRezultata.textContent = "Pronađeno knjiga: " + filtrirane.length;

  if (filtrirane.length === 0) {
    listaKnjiga.innerHTML = `<p class="prazno">Nema knjiga koje odgovaraju izabranim filterima.</p>`;
    return;
  }

  listaKnjiga.innerHTML = sortiraj(filtrirane)
    .map((knjiga) => knjigaKarticaHTML(knjiga, nadjiAutora(knjiga), sveRecenzije))
    .join("");
}

async function ucitajKatalog() {
  try {
    const [knjige, autori, zanrovi, recenzije] = await Promise.all([
      ucitaj("/knjige"),
      ucitaj("/autori"),
      ucitaj("/zanrovi"),
      ucitaj("/recenzije")
    ]);
    sveKnjige = knjige;
    sviAutori = autori;
    sveRecenzije = recenzije;

    filterZanr.innerHTML += zanrovi
      .map((zanr) => `<option value="${zanr.id}">${ocisti(zanr.naziv)}</option>`)
      .join("");

    poljePretraga.value = procitajParametar("pretraga") || "";
    filterZanr.value = procitajParametar("zanr") || "";

    prikaziKnjige();
  } catch (greska) {
    prikaziPoruku(porukaKatalog, greska.message);
  }
}

[poljePretraga, filterZanr, filterPovez, filterCena, samoNaStanju, sortiranje].forEach((element) => {
  element.addEventListener("input", prikaziKnjige);
});

document.getElementById("ponisti").addEventListener("click", () => {
  poljePretraga.value = "";
  filterZanr.value = "";
  filterPovez.value = "";
  filterCena.value = "";
  samoNaStanju.checked = false;
  prikaziKnjige();
});

ucitajKatalog();
