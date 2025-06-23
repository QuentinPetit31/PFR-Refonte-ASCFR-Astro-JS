-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ascfr_refonte;
USE ascfr_refonte;

-- 1. Création des tables de base (sans clés étrangères)

-- Table utilisateur
CREATE TABLE utilisateur (
  id_utilisateur INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prenom_utilisateur VARCHAR(100),
  nom_utilisateur VARCHAR(100),
  email_utilisateur VARCHAR(255),
  password_utilisateur VARCHAR(100),
  numeroAdherent_utilisateur VARCHAR(50),
  pseudo_utilisateur VARCHAR(30),
  dateInscription_utilisateur DATE
) ENGINE=InnoDB;

-- Table role
CREATE TABLE role (
  id_role INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  intitule_role VARCHAR(50)
) ENGINE=InnoDB;

-- Table forum
CREATE TABLE forum (
  id_forum INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  theme_forum VARCHAR(100)
) ENGINE=InnoDB;

-- Table categorie (sans clé étrangère)
CREATE TABLE categorie (
  id_categorie INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  libelle_categorie VARCHAR(50)
) ENGINE=InnoDB;

-- Table sousCategorie (sans clé étrangère)
CREATE TABLE sousCategorie (
  id_sousCategorie INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  libelle_sousCategorie VARCHAR(50)
) ENGINE=InnoDB;

-- Table adherent
CREATE TABLE adherent (
  id_adherent INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero_adherent VARCHAR(50),
  nom_adherent VARCHAR(100),
  prenom_adherent VARCHAR(100),
  email_adherent VARCHAR(255),
  telephone_adherent VARCHAR(20),
  dateInscription_adherent DATE,
  statut_adherent TINYINT DEFAULT 1,
  id_utilisateur INT UNSIGNED
) ENGINE=InnoDB;

-- Table rencontre (sans clé étrangère)
CREATE TABLE rencontre (
  id_rencontre INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  saison_rencontre VARCHAR(20),
  competition_rencontre VARCHAR(100),
  date_rencontre DATE,
  lieu_rencontre VARCHAR(50),
  categorie_rencontre VARCHAR(2),
  statut_rencontre VARCHAR(12),
  journee_rencontre INT,
  adversaire_rencontre VARCHAR(50),
  placesMax_rencontre INT DEFAULT 10,
  placesDisp_rencontre INT DEFAULT 10,
  deadlineInscription_rencontre DATE,
  ouvertureDemande_rencontre DATE
) ENGINE=InnoDB;

-- Table demande
CREATE TABLE IF NOT EXISTS demande (
  id_demande INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  date_demande DATETIME,
  commentaire_demande TEXT,
  message_demande TEXT,
  statut_demande VARCHAR(30) DEFAULT 'en attente',
  nom_demande VARCHAR(100), 
  prenom_demande VARCHAR(100),
  email_demande VARCHAR(255), 
  telephone_demande VARCHAR(20)
) ENGINE=InnoDB;

-- Table article (sans clé étrangère)
CREATE TABLE article (
  id_article INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titre_article VARCHAR(100),
  date_article DATETIME,
  contenu_article TEXT,
  id_utilisateur INT UNSIGNED
) ENGINE=InnoDB;

-- Table message (sans clé étrangère)
CREATE TABLE message (
  id_Message INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contenu_message TEXT,
  date_message DATE,
  id_utilisateur INT UNSIGNED
) ENGINE=InnoDB;

-- Table sujet (sans clé étrangère)
CREATE TABLE sujet (
  id_sujet INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titre_sujet VARCHAR(100),
  dateCreation_sujet DATE,
  id_Message INT UNSIGNED
) ENGINE=InnoDB;

-- Table blacklist
CREATE TABLE blacklist (
  id_blacklist INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mot_blacklist VARCHAR(100)
) ENGINE=InnoDB;

-- 2. Ajout des colonnes de clés étrangères aux tables existantes

-- Ajout de clé étrangère à categorie
ALTER TABLE categorie ADD COLUMN id_forum INT UNSIGNED;

-- Ajout de clé étrangère à sousCategorie
ALTER TABLE sousCategorie ADD COLUMN id_categorie INT UNSIGNED;

-- 3. Création des tables de relation N:M

-- Relation entre utilisateur et role
CREATE TABLE occuper (
  id_utilisateur INT UNSIGNED,
  id_role INT UNSIGNED,
  PRIMARY KEY (id_utilisateur, id_role)
) ENGINE=InnoDB;

-- Relation entre utilisateur et article
CREATE TABLE rediger (
  id_utilisateur INT UNSIGNED,
  id_article INT UNSIGNED,
  PRIMARY KEY (id_utilisateur, id_article)
) ENGINE=InnoDB;

-- Relation entre utilisateur et message
CREATE TABLE poster (
  id_utilisateur INT UNSIGNED,
  id_Message INT UNSIGNED,
  PRIMARY KEY (id_utilisateur, id_Message)
) ENGINE=InnoDB;

-- Relation entre adherent et demande
CREATE TABLE formuler (
  id_adherent INT UNSIGNED,
  id_demande INT UNSIGNED,
  PRIMARY KEY (id_adherent, id_demande)
) ENGINE=InnoDB;

-- Relation entre rencontre et demande
CREATE TABLE cibler (
  id_rencontre INT UNSIGNED,
  id_demande INT UNSIGNED,
  PRIMARY KEY (id_rencontre, id_demande)
) ENGINE=InnoDB;

-- Relation entre message et blacklist
CREATE TABLE filtrer (
  id_Message INT UNSIGNED,
  id_blacklist INT UNSIGNED,
  PRIMARY KEY (id_Message, id_blacklist)
) ENGINE=InnoDB;

-- Relation entre message et sujet
CREATE TABLE contenir (
  id_Message INT UNSIGNED,
  id_sujet INT UNSIGNED,
  PRIMARY KEY (id_Message, id_sujet)
) ENGINE=InnoDB;

-- Relation entre sousCategorie et sujet
CREATE TABLE organiser (
  id_sousCategorie INT UNSIGNED,
  id_sujet INT UNSIGNED,
  PRIMARY KEY (id_sousCategorie, id_sujet)
) ENGINE=InnoDB;

-- Relation entre categorie et sousCategorie
CREATE TABLE structurer (
  id_categorie INT UNSIGNED,
  id_sousCategorie INT UNSIGNED,
  PRIMARY KEY (id_categorie, id_sousCategorie)
) ENGINE=InnoDB;

-- Relation entre forum et categorie
CREATE TABLE classer (
  id_forum INT UNSIGNED,
  id_categorie INT UNSIGNED,
  PRIMARY KEY (id_forum, id_categorie)
) ENGINE=InnoDB;

-- Relation entre utilisateur et adherent
CREATE TABLE adherer (
  id_utilisateur INT UNSIGNED,
  id_adherent INT UNSIGNED,
  PRIMARY KEY (id_utilisateur, id_adherent)
) ENGINE=InnoDB;

-- 4. Ajout des contraintes de clé étrangère

-- Contraintes sur categorie
ALTER TABLE categorie ADD CONSTRAINT fk_categorie_forum FOREIGN KEY (id_forum) REFERENCES forum(id_forum);

-- Contraintes sur sousCategorie
ALTER TABLE sousCategorie ADD CONSTRAINT fk_sousCategorie_categorie FOREIGN KEY (id_categorie) REFERENCES categorie(id_categorie);

-- Contraintes sur adherent
ALTER TABLE adherent ADD CONSTRAINT fk_adherent_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);

-- Contraintes sur article
ALTER TABLE article ADD CONSTRAINT fk_article_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);

-- Contraintes sur message
ALTER TABLE message ADD CONSTRAINT fk_message_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);

-- Contraintes sur sujet
ALTER TABLE sujet ADD CONSTRAINT fk_sujet_message FOREIGN KEY (id_Message) REFERENCES message(id_Message);

-- Contraintes sur occuper
ALTER TABLE occuper ADD CONSTRAINT fk_occuper_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE occuper ADD CONSTRAINT fk_occuper_role FOREIGN KEY (id_role) REFERENCES role(id_role);

-- Contraintes sur rediger
ALTER TABLE rediger ADD CONSTRAINT fk_rediger_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE rediger ADD CONSTRAINT fk_rediger_article FOREIGN KEY (id_article) REFERENCES article(id_article);

-- Contraintes sur poster
ALTER TABLE poster ADD CONSTRAINT fk_poster_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE poster ADD CONSTRAINT fk_poster_message FOREIGN KEY (id_Message) REFERENCES message(id_Message);

-- Contraintes sur formuler
ALTER TABLE formuler ADD CONSTRAINT fk_formuler_adherent FOREIGN KEY (id_adherent) REFERENCES adherent(id_adherent);
ALTER TABLE formuler ADD CONSTRAINT fk_formuler_demande FOREIGN KEY (id_demande) REFERENCES demande(id_demande);

-- Contraintes sur cibler
ALTER TABLE cibler ADD CONSTRAINT fk_cibler_rencontre FOREIGN KEY (id_rencontre) REFERENCES rencontre(id_rencontre);
ALTER TABLE cibler ADD CONSTRAINT fk_cibler_demande FOREIGN KEY (id_demande) REFERENCES demande(id_demande);

-- Contraintes sur filtrer
ALTER TABLE filtrer ADD CONSTRAINT fk_filtrer_message FOREIGN KEY (id_Message) REFERENCES message(id_Message);
ALTER TABLE filtrer ADD CONSTRAINT fk_filtrer_blacklist FOREIGN KEY (id_blacklist) REFERENCES blacklist(id_blacklist);

-- Contraintes sur contenir
ALTER TABLE contenir ADD CONSTRAINT fk_contenir_message FOREIGN KEY (id_Message) REFERENCES message(id_Message);
ALTER TABLE contenir ADD CONSTRAINT fk_contenir_sujet FOREIGN KEY (id_sujet) REFERENCES sujet(id_sujet);

-- Contraintes sur organiser
ALTER TABLE organiser ADD CONSTRAINT fk_organiser_sousCategorie FOREIGN KEY (id_sousCategorie) REFERENCES sousCategorie(id_sousCategorie);
ALTER TABLE organiser ADD CONSTRAINT fk_organiser_sujet FOREIGN KEY (id_sujet) REFERENCES sujet(id_sujet);

-- Contraintes sur structurer
ALTER TABLE structurer ADD CONSTRAINT fk_structurer_categorie FOREIGN KEY (id_categorie) REFERENCES categorie(id_categorie);
ALTER TABLE structurer ADD CONSTRAINT fk_structurer_sousCategorie FOREIGN KEY (id_sousCategorie) REFERENCES sousCategorie(id_sousCategorie);

-- Contraintes sur classer
ALTER TABLE classer ADD CONSTRAINT fk_classer_forum FOREIGN KEY (id_forum) REFERENCES forum(id_forum);
ALTER TABLE classer ADD CONSTRAINT fk_classer_categorie FOREIGN KEY (id_categorie) REFERENCES categorie(id_categorie);

-- Contraintes sur adherer
ALTER TABLE adherer ADD CONSTRAINT fk_adherer_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur);
ALTER TABLE adherer ADD CONSTRAINT fk_adherer_adherent FOREIGN KEY (id_adherent) REFERENCES adherent(id_adherent);

-- 5. Données d'exemple
INSERT INTO utilisateur (prenom_utilisateur, nom_utilisateur, email_utilisateur, pseudo_utilisateur, dateInscription_utilisateur) VALUES
('Quentin', 'Petit', 'quentinpetit@gmail.com', 'QPetit', '2024-07-01'),
('Maria', 'Pietri', 'mariap@gmail.com', 'MPietri', '2025-04-01');

INSERT INTO role (intitule_role) VALUES
('Administrateur'),
('Membre'),
('Modérateur');

INSERT INTO forum (theme_forum) VALUES
('Forum Supporters Arsenal');

INSERT INTO categorie (libelle_categorie, id_forum) VALUES
('Matchs', 1),
('Transferts', 1);

INSERT INTO sousCategorie (libelle_sousCategorie, id_categorie) VALUES
('Premier League', 1),
('Champions League', 1),
('Rumeurs', 2);

INSERT INTO demande (statut_demande, message_demande, date_demande, commentaire_demande) VALUES
('en attente', 'Demande pour le match ID 1', '2024-08-12 14:30:00', 'Je suis sur Londres à cette date');

-- Insertion dans adherent 
INSERT INTO adherent (numero_adherent, nom_adherent, prenom_adherent, email_adherent, dateInscription_adherent, telephone_adherent, statut_adherent) VALUES
('123456', 'Petit', 'Quentin', 'quentinpetit@gmail.com', '2024-07-01', '0601020304', TRUE),
('654321', 'Henry', 'Thierry', 'th14@arsenal.fr', '2024-07-02', '0714141414', TRUE);

-- Mettre à jour avec les clés étrangères
UPDATE adherent SET id_utilisateur = 1 WHERE id_adherent = 1;

-- Insertion des matchs à domicile d'Arsenal pour la saison 2025/2026
INSERT INTO rencontre (journee_rencontre, adversaire_rencontre, categorie_rencontre, date_rencontre, lieu_rencontre, deadlineInscription_rencontre, statut_rencontre, placesMax_rencontre, placesDisp_rencontre, ouvertureDemande_rencontre, competition_rencontre, saison_rencontre) VALUES
-- Premier League
-- Matchs d'août - statut "Ouvert"
(1, 'Manchester City', 'A', '2025-08-16', 'Emirates Stadium', '2025-08-10', 'Ouvert', 15, 10, '2025-08-02', 'Premier League', '2025-2026'),
(3, 'Tottenham', 'A', '2025-08-30', 'Emirates Stadium', '2025-08-24', 'Ouvert', 15, 8, '2025-08-11', 'Premier League', '2025-2026'),
-- Matchs de septembre à mai - statut "Fermé"
(5, 'Newcastle', 'B', '2025-09-13', 'Emirates Stadium', '2025-08-30', 'Fermé', 10, 10, '2025-08-23', 'Premier League', '2025-2026'),
(7, 'West Ham', 'B', '2025-09-27', 'Emirates Stadium', '2025-09-13', 'Fermé', 10, 10, '2025-09-06', 'Premier League', '2025-2026'),
(9, 'Brighton', 'B', '2025-10-18', 'Emirates Stadium', '2025-10-04', 'Fermé', 10, 10, '2025-09-27', 'Premier League', '2025-2026'),
(12, 'Bournemouth', 'C', '2025-11-08', 'Emirates Stadium', '2025-10-25', 'Fermé', 10, 10, '2025-10-18', 'Premier League', '2025-2026'),
(14, 'Liverpool', 'A', '2025-11-29', 'Emirates Stadium', '2025-11-15', 'Fermé', 15, 15, '2025-11-08', 'Premier League', '2025-2026'),
(16, 'Chelsea', 'A', '2025-12-13', 'Emirates Stadium', '2025-11-29', 'Fermé', 15, 15, '2025-11-22', 'Premier League', '2025-2026'),
(18, 'Nottingham Forest', 'C', '2025-12-26', 'Emirates Stadium', '2025-12-12', 'Fermé', 10, 10, '2025-12-05', 'Premier League', '2025-2026'),
(20, 'Everton', 'C', '2026-01-03', 'Emirates Stadium', '2025-12-20', 'Fermé', 10, 10, '2025-12-13', 'Premier League', '2025-2026'),
(22, 'Fulham', 'C', '2026-01-17', 'Emirates Stadium', '2026-01-03', 'Fermé', 10, 10, '2025-12-27', 'Premier League', '2025-2026'),
(24, 'Crystal Palace', 'C', '2026-02-07', 'Emirates Stadium', '2026-01-24', 'Fermé', 10, 10, '2026-01-17', 'Premier League', '2025-2026'),
(26, 'Manchester United', 'A', '2026-02-28', 'Emirates Stadium', '2026-02-14', 'Fermé', 15, 15, '2026-02-07', 'Premier League', '2025-2026'),
(28, 'Leicester City', 'B', '2026-03-14', 'Emirates Stadium', '2026-02-28', 'Fermé', 10, 10, '2026-02-21', 'Premier League', '2025-2026'),
(30, 'Southampton', 'C', '2026-04-04', 'Emirates Stadium', '2026-03-21', 'Fermé', 10, 10, '2026-03-14', 'Premier League', '2025-2026'),
(32, 'Brentford', 'C', '2026-04-18', 'Emirates Stadium', '2026-04-04', 'Fermé', 10, 10, '2026-03-28', 'Premier League', '2025-2026'),
(35, 'Aston Villa', 'B', '2026-05-02', 'Emirates Stadium', '2026-04-18', 'Fermé', 10, 10, '2026-04-11', 'Premier League', '2025-2026'),
(38, 'Wolverhampton', 'B', '2026-05-17', 'Emirates Stadium', '2026-05-03', 'Fermé', 10, 10, '2026-04-26', 'Premier League', '2025-2026'),

-- Champions League (groupes)
(null, 'Bayern Munich', 'A', '2024-09-17', 'Emirates Stadium', '2024-09-03', 'Ouvert', 15, 2, '2024-08-27', 'Champions League', '2024-2025'),
(null, 'Barcelona', 'A', '2024-10-22', 'Emirates Stadium', '2024-10-08', 'Ouvert', 15, 0, '2024-09-30', 'Champions League', '2024-2025'),
(null, 'PSG', 'A', '2024-11-26', 'Emirates Stadium', '2024-11-12', 'Ouvert', 15, 3, '2024-11-05', 'Champions League', '2024-2025'),

-- FA Cup (hypothétiques)
(null, 'Leeds United', 'B', '2025-01-25', 'Emirates Stadium', '2025-01-11', 'Ouvert', 10, 9, '2025-01-04', 'FA Cup', '2024-2025'),
(null, 'Sheffield United', 'C', '2025-02-15', 'Emirates Stadium', '2025-02-01', 'Ouvert', 10, 10, '2025-01-25', 'FA Cup', '2024-2025'),

-- Carabao Cup (hypothétiques)
(null, 'Burnley', 'C', '2024-09-23', 'Emirates Stadium', '2024-09-09', 'Ouvert', 10, 10, '2024-09-02', 'Carabao Cup', '2024-2025'),
(null, 'Leicester City', 'C', '2024-10-29', 'Emirates Stadium', '2024-10-15', 'Ouvert', 10, 9, '2024-10-08', 'Carabao Cup', '2024-2025');

-- Ajouter des relations pour les exemples
INSERT INTO formuler (id_adherent, id_demande) VALUES (1, 1);
INSERT INTO cibler (id_rencontre, id_demande) VALUES (1, 1);
INSERT INTO occuper (id_utilisateur, id_role) VALUES (1, 2), (2, 1);

-- Ajouter des index pour améliorer les performances
CREATE INDEX idx_adherent_numero ON adherent (numero_adherent);
CREATE INDEX idx_rencontre_date ON rencontre (date_rencontre);

