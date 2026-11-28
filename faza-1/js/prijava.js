const formaPrijava = document.getElementById("forma-prijava");
const porukaPrijava = document.getElementById("poruka");

if (zahtevajGosta()) {
  prikaziZaglavlje("prijava");
  prikaziPorukuIzAdrese(porukaPrijava);
}

formaPrijava.addEventListener("submit", async (dogadjaj) => {
  dogadjaj.preventDefault();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const lozinka = document.getElementById("lozinka").value;

  if (email === "" || lozinka === "") {
    prikaziPoruku(porukaPrijava, "Unesite email adresu i lozinku.");
    return;
  }

  try {
    const korisnici = await ucitaj("/korisnici?email=" + encodeURIComponent(email));
    const korisnik = korisnici[0];
    if (!korisnik || korisnik.lozinka !== lozinka) {
      prikaziPoruku(porukaPrijava, "Pogrešna email adresa ili lozinka.");
      return;
    }
    sacuvajKorisnika(korisnik);
    window.location.href = korisnik.uloga === "admin" ? "admin.html" : "katalog.html";
  } catch (greska) {
    prikaziPoruku(porukaPrijava, greska.message);
  }
});
