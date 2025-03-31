document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé, script en cours...");
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const apiKey = "eb07dfa7f9525afbfb394e2a542680f4";
  const teamId = "42";
  const leagueId = "39";
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
      console.log(data);

      // Vérifie s'il y a des matchs disponibles
      if (data.response.length > 0) {
        const match = data.response[0];
        const matchDate = new Date(match.fixture.date);

        // Formatte la date (jour/mois/année)
        const formattedDate = matchDate.toLocaleDateString("fr-FR");

        // Formatte l'heure (heures:minutes)
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
    .catch((error) => console.error("Erreur:", error));

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Fonction pour changer le titre du h3
  function updateTitle() {
    const carouselItems = document.querySelectorAll("[data-carousel-item]");
    const activeItem = Array.from(carouselItems).find((item) =>
      item.classList.contains("active")
    );

    const title = document.getElementById("carousel-title");

    if (activeItem) {
      const alt = activeItem.querySelector("img").alt;
      title.textContent = alt;
    }
  }

  // Fonction de navigation entre les slides
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

  // Clic sur flèches
  document
    .querySelector("[data-carousel-prev]")
    .addEventListener("click", () => {
      navigateCarousel("prev");
    });
  document
    .querySelector("[data-carousel-next]")
    .addEventListener("click", () => {
      navigateCarousel("next");
    });

  // Rotation automatique toutes les 3s
  setInterval(() => {
    navigateCarousel("next");
  }, 8000);

  // Met à jour le titre au démarrage
  updateTitle();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //https://arsenal-supporter-club-fr-com.web.app/

  // Configuration Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAyLJwseXraAd6RzZmtRYlGFBxkrLPv4PQ",
    authDomain: "ascfr-refonte.firebaseapp.com",
    projectId: "arsenal-supporter-club-fr-com",
    storageBucket: "ascfr-refonte.firebasestorage.app",
    messagingSenderId: "192382773773",
    appId: "arsenal-supporter-club-fr-com",
  };

  // Initialisation Firebase
  const app = firebase.initializeApp(firebaseConfig);

  // Initialisation Firestore
  const db = firebase.firestore();

  // Exemple : récupérer une collection
  db.collection("ma-collection")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des documents :", error);
    });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Firebase
  console.log("Début du chargement des composants");

  loadComponent("header", "partials/header.html")
    .then(() => console.log("Header chargé avec succès"))
    .catch((error) => console.error("Erreur chargement header :", error));

  loadComponent("footer", "partials/footer.html")
    .then(() => console.log("Footer chargé avec succès"))
    .catch((error) => console.error("Erreur chargement footer :", error));

  db.collection("test")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
    })
    .catch((error) => {
      console.error("Erreur Firebase Firestore :", error);
    });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
