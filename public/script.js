document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé, script en cours...");

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Appel à l'API Football pour récupérer les données du prochain match

  const apiKey = "eb07dfa7f9525afbfb394e2a542680f4";
  const teamId = "42"; // ID Arsenal
  const leagueId = "39"; // Premier League
  const season = "2021";
  const fromDate = "2021-09-25";
  const toDate = "2021-09-26";

  const url = `https://v3.football.api-sports.io/fixtures?team=${teamId}&league=${leagueId}&season=${season}&from=${fromDate}&to=${toDate}`;

  fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.response.length > 0) {
        const match = data.response[0];
        const matchDate = new Date(match.fixture.date);

        const formattedDate = matchDate.toLocaleDateString("fr-FR");
        const formattedTime = matchDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const matchInfo = `
          <div class="match-header mt-4">Match à venir</div>
          <div class="match-teams">
            <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" width="10vw"> 
            <span>vs</span>
            <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" width="10vw">
          </div>
          ${formattedDate} ${formattedTime}<br>
          ${match.fixture.venue.name}, ${match.fixture.venue.city}<br>
          ${match.league.name}
        `;

        document.getElementById("prochain-match").innerHTML = matchInfo;
      } else {
        document.getElementById("prochain-match").innerText =
          "Aucun match trouvé.";
      }
    })
    .catch((error) => console.error("Erreur API football :", error));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Carrousel : mise à jour du titre, navigation et rotation automatique

  function updateTitle() {
    const carouselItems = document.querySelectorAll("[data-carousel-item]");
    const activeItem = Array.from(carouselItems).find((item) =>
      item.classList.contains("active")
    );
    const title = document.getElementById("carousel-title");
    if (activeItem && title) {
      const alt = activeItem.querySelector("img").alt;
      title.textContent = alt;
    }
  }

  function navigateCarousel(direction) {
    const items = document.querySelectorAll("[data-carousel-item]");
    const currentIndex = Array.from(items).findIndex((item) =>
      item.classList.contains("active")
    );

    items[currentIndex].classList.remove("active");

    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= items.length) newIndex = 0;
    if (newIndex < 0) newIndex = items.length - 1;

    items[newIndex].classList.add("active");
    updateTitle();
  }

  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");

  if (prevBtn)
    prevBtn.addEventListener("click", () => navigateCarousel("prev"));
  if (nextBtn)
    nextBtn.addEventListener("click", () => navigateCarousel("next"));

  setInterval(() => {
    navigateCarousel("next");
  }, 8000);

  updateTitle();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Initialisation de Firebase

  const firebaseConfig = {
    apiKey: "AIzaSyAyLJwseXraAd6RzZmtRYlGFBxkrLPv4PQ",
    authDomain: "ascfr-refonte.firebaseapp.com",
    projectId: "arsenal-supporter-club-fr-com",
    storageBucket: "ascfr-refonte.firebasestorage.app",
    messagingSenderId: "192382773773",
    appId: "arsenal-supporter-club-fr-com",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Chargement des composants HTML (header et footer)

  loadComponent("header", "partials/header.html")
    .then(() => console.log("Header chargé avec succès"))
    .catch((error) => console.error("Erreur chargement header :", error));

  loadComponent("footer", "partials/footer.html")
    .then(() => console.log("Footer chargé avec succès"))
    .catch((error) => console.error("Erreur chargement footer :", error));

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Récupération des matchs à venir depuis Firestore

  db.collection("match_pl_a_venir_24_25")
    .orderBy("date.dateMatch")
    .get()
    .then((querySnapshot) => {
      const tbody = document.getElementById("table-body");
      if (!tbody) return;

      let html = "";

      querySnapshot.forEach((doc) => {
        const match = doc.data();
        const placesRestantes =
          match.billet.placesMax - match.billet.placesPrises;

        html += `
          <tr class="text-center hover:bg-red-900 transition">
            <td class="px-2 py-3 border border-white font-semibold">
              ${match.date.rencontre}<br />
              ${new Date(
                match.date.dateMatch.seconds * 1000
              ).toLocaleDateString()}<br />
              Catégorie ${match.billet.categorie}<br />
              Deadline ${new Date(
                match.date.deadline.seconds * 1000
              ).toLocaleDateString()}
            </td>
            <td class="px-2 py-3 border border-white">
              ${
                match.billet.estOuvert && placesRestantes > 0
                  ? `<span class="bg-green-500 text-white font-semibold px-2 py-1 rounded block">
                      Ouvert<br />Places dispo ${placesRestantes}/${match.billet.placesMax}
                    </span>`
                  : `<span class="bg-red-700 text-white font-semibold px-2 py-1 rounded block">
                      Fermé
                    </span>`
              }
            </td>
            <td class="px-2 py-3 border border-white font-bold">
              ${new Date(
                match.date.dateOuverture.seconds * 1000
              ).toLocaleDateString()}
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des matchs :", error);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonction de chargement externe d’un fichier HTML dans un conteneur ciblé par son ID

function loadComponent(id, url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = html;
    });
}
