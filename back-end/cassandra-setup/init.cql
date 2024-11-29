CREATE KEYSPACE IF NOT EXISTS projet_web 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE projet_web;

CREATE TABLE categories (
    id text PRIMARY KEY,
    name text
);

CREATE TABLE products (
    id text PRIMARY KEY,
    date_ajout text,
    description text,
    nom text,
    prix text,
    idcategorie text
);

INSERT INTO categories (id, name) 
VALUES ('1', 'Test1');

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('ef0e5991-13d8-4cdd-9e01-c740590ba081', 'Dec 27th 21', 'Carrosserie en tôle dacier laqué blanc montée sur roues pour faciliter le déplacement, couvercle laqué blanc, dessus et cuve en métal émaille marron, inaltérable a leau de lessive et a la chaleur,', 'Oriental Congelé Serviettes', '302.00', '1');

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('8be56ef1-d6dc-4c00-927e-1c4dedde910c', 'Jun 24th 20', 'Cadre raccord brasé de 53 ou 58 %. Jantes en acier émaillées. Pneus Hiron 700 x 35, garantis 12 mois. Pignon roue libre à emboitement hexagonal. Frein Hirondelle sur jante arrière. Garde-boue métal.', 'Génial Congelé Fromage', '628.00', '1');

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('abcdd824-c944-4ec4-9a68-dd061107e396', 'Feb 19th 23', 'Bicyclette à 1 vitesse, pneus 1/2 ballon. Cadre de 52cm. Jantes chromées. Roue Hore. Moyeux indéréglables. 2 freins sur jantes. Guidon trials. Garde-boue et couvre chaine en acier émaillé. Porte-bagages. Gardejupes. Pédales à blocs caoutchouc. Émail couleur. Selle route cuir. Sacoche avec outillage. Pompe de cadre. Timbre avertisseur.', 'Artisanal Plastique Chemise', '882.00', '1');

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('315607b2-eaf4-412d-b0b8-7245b5dcdb03', 'Apr 5th 23', 'Carrosserie en tôle dacier laqué blanc montée sur roues pour faciliter le déplacement, couvercle laqué blanc, dessus et cuve en métal émaille marron, inaltérable a leau de lessive et a la chaleur,', 'Savoureux Caoutchouc Vélo', '62.00', '1');
