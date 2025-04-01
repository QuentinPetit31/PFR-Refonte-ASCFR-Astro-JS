
-- --------------------------------------------SQL---------------------------------------------- --


--  Fichier SQL classique simulant une structure similaire à Firestore pour les matchs à venir

-- Suppression si la table existe
DROP TABLE IF EXISTS matchs;

-- Création de la table
CREATE TABLE matchs (
  id SERIAL PRIMARY KEY,
  rencontre VARCHAR(100),
  
  -- Champs de la "map" billet
  categorie VARCHAR(10),
  places_max INT,
  places_prises INT,
  est_ouvert BOOLEAN,
  
  -- Champs de la "map" date
  date_match DATE,
  deadline DATE,
  date_ouverture DATE
);

-- INSERT
INSERT INTO matchs (title, date_match, category, deadline, is_open, places_max, places_prises, opening_date) VALUES
('J1. Wolves', '2024-08-17', 'B', '2024-06-30', TRUE, 10, 4, '2024-08-11'),
('J2. Aston Villa', '2024-08-24', 'A', '2024-07-10', FALSE, 10, 10, '2024-08-14');

-- SELECT
-- Tous les matchs
SELECT * FROM matchs;

-- Matchs ouverts
SELECT * FROM matchs WHERE is_open = TRUE;

-- UPDATE
-- Modifier les places prises pour le match J1
UPDATE matchs SET places_prises = 5 WHERE title = 'J1. Wolves';

-- DELETE
-- Supprimer un match spécifique
DELETE FROM matchs WHERE title = 'J2. Aston Villa';

-- VERSION SQL  POUR GÉRER LES SOUHAITS DE MATCH DES ADHÉRENTS

-- Table adherent
CREATE TABLE adherent_24_25 (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  mail VARCHAR(150),
  date_inscription DATE,
  prioritaire BOOLEAN
);

-- Table 
CREATE TABLE match_pl_24_25 (
  id VARCHAR(100) PRIMARY KEY,
  rencontre VARCHAR(100),
  categorie VARCHAR(10),
  places_max INT,
  places_prises INT,
  est_ouvert BOOLEAN,
  date_match DATE,
  deadline DATE,
  date_ouverture DATE
);

-- Table demande (relation n:n entre adherents et matchs)
CREATE TABLE demande_pl (
  id SERIAL PRIMARY KEY,
  adherent_id INT REFERENCES adherents(id) ON DELETE CASCADE,
  match_id VARCHAR(100) REFERENCES matchs(id) ON DELETE CASCADE,
  date_demande_pl TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50) DEFAULT 'en attente'
);

-- Demande de Quentin
INSERT INTO demande_pl (adherent_id, match_id, statut)
VALUES (1, 'j38_newcastle_united', 'en attente');

-- Toutes les demandes avec détails
SELECT
  a.prenom || ' ' || a.nom AS adherent,
  a.mail,
  m.rencontre,
  s.statut,
  s.date_demande_pl
FROM demande_pl
JOIN adherents a ON s.adherent_id = a.id
JOIN matchs m ON s.match_id = m.id;

