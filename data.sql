-- Suppression si la table existe
DROP TABLE IF EXISTS match_pl_24_25;

-- Création de la table
CREATE TABLE match_pl_24_25 (
  id SERIAL PRIMARY KEY,
  journee INT,
  adversaire VARCHAR(50), 
  -- Champs de la "map" billet
  categorie VARCHAR(50),
  placesMax INT,
  placesPrises INT,
  estOuvert BOOLEAN,
  
  -- Champs de la "map" date
  dateMatch DATE,
  deadline DATE,
  dateOuverture DATE
);

-- INSERT
INSERT INTO match_pl_24_25 (journee, adversaire, categorie, dateMatch, deadline, estOuvert, placesMax, placesPrises, dateOuverture) VALUES
(1, 'Wolves', 'B', '2024-08-17', '2024-06-30', TRUE, 10, 4, '2024-08-11'),
(38, 'Newcastle United', 'A', '2025-08-24', '2025-07-10', FALSE, 10, 10, '2025-08-14');

-- SELECT
-- Tous les matchs saison 24/25
SELECT * FROM match_pl_24_25;

-- Matchs ouverts
SELECT * FROM match_pl_24_25 WHERE estOuvert = TRUE;

-- UPDATE
-- Modifier les places prises pour le match J1
UPDATE match_pl_24_25 SET placesPrises = 5 WHERE journee = 1 AND adversaire = 1;

-- DELETE
-- Supprimer un match spécifique
DELETE FROM match_pl_24_25 WHERE journee = 2 AND adversaire = 2;

-- VERSION SQL POUR GÉRER LES DEMANDES DE MATCH DES ADHÉRENTS

-- Table adherent
DROP TABLE IF EXISTS adherent_24_25;
CREATE TABLE adherent_24_25 (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  mail VARCHAR(150),
  dateInscription DATE,
  prioritaire BOOLEAN
);

-- Table demande (relation n:n entre adherents et matchs)
DROP TABLE IF EXISTS demande_pl;
CREATE TABLE demande_pl (
  id SERIAL PRIMARY KEY,
  adherent_id INT REFERENCES adherent_24_25(id) ON DELETE CASCADE,
  match_id INT REFERENCES match_pl_24_25(id) ON DELETE CASCADE,
  dateDemandePl TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50) DEFAULT 'en attente'
);

-- Demande de Quentin
INSERT INTO demande_pl (adherent_id, match_id, statut)
VALUES (1, 1, 'en attente');

-- Toutes les demandes avec détails
SELECT
  a.prenom || ' ' || a.nom AS adherent,
  a.mail,
  m.journee,
  m.adversaire,
  d.statut,
  d.dateDemandePl
FROM demande_pl d
JOIN adherent_24_25 a ON d.adherent_id = a.id
JOIN match_pl_24_25 m ON d.match_id = m.id;
