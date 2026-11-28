const porukaPocetna = document.getElementById("poruka");

prikaziZaglavlje("index");
prikaziPorukuIzAdrese(porukaPocetna);

document.getElementById("forma-pretraga").addEventListener("submit", (dogadjaj) => {
  dogadjaj.preventDefault();
  const tekst = document.getElementById("pretraga").value.trim();
  window.location.href = "katalog.html?pretraga=" + encodeURIComponent(tekst);
});

async function ucitajPocetnu() {
  try {
    const [knjige, autori, zanrovi, recenzije] = await Promise.all([
      ucitaj("/knjige"),
      ucitaj("/autori"),
      ucitaj("/zanrovi"),
      ucitaj("/recenzije")
    ]);
    const nadjiAutora = (knjiga) => autori.find((autor) => autor.id === knjiga.autorId);

    document.getElementById("uvod-korice").innerHTML = knjige
      .slice(0, 3)
      .map((knjiga) => koricaHTML(knjiga, nadjiAutora(knjiga)))
      .join("");

    document.getElementById("zanrovi").innerHTML = zanrovi
      .map((zanr) => {
        const broj = knjige.filter((knjiga) => knjiga.zanrId === zanr.id).length;
        return `
          <a class="zanr-kartica" href="katalog.html?zanr=${zanr.id}">
            <strong>${ocisti(zanr.naziv)}</strong>
            <span>${broj} knjiga</span>
          </a>
        `;
      })
      .join("");

    const saOcenom = knjige
      .map((knjiga) => {
        const recenzijeKnjige = recenzije.filter((recenzija) => recenzija.knjigaId === knjiga.id);
        return { knjiga, ocena: prosecnaOcena(recenzijeKnjige) };
      })
      .filter((stavka) => stavka.ocena > 0)
      .sort((a, b) => b.ocena - a.ocena)
      .slice(0, 4);

    document.getElementById("najbolje").innerHTML = saOcenom
      .map((stavka) => knjigaKarticaHTML(stavka.knjiga, nadjiAutora(stavka.knjiga), recenzije))
      .join("");

    const najnovije = [...knjige].sort((a, b) => b.id - a.id).slice(0, 4);
    document.getElementById("novo").innerHTML = najnovije
      .map((knjiga) => knjigaKarticaHTML(knjiga, nadjiAutora(knjiga), recenzije))
      .join("");
  } catch (greska) {
    prikaziPoruku(porukaPocetna, greska.message);
  }
}

ucitajPocetnu();
