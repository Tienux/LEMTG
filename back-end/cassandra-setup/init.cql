CREATE KEYSPACE IF NOT EXISTS projet_web 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE projet_web;

CREATE TABLE IF NOT EXISTS categories(
    id text PRIMARY KEY,
    name text
);

CREATE TABLE IF NOT EXISTS products (
    id text PRIMARY KEY,
    date_ajout text,
    description text,
    nom text,
    prix text,
    idcategorie text
);


CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text,
    password text
);

-- Insertion de users avec mot de passe
INSERT INTO users (id, name, password)
VALUES ('1', 'Gabriel', '12345');

INSERT INTO users (id, name, password)
VALUES ('2', 'Etienne', '54321');

INSERT INTO users (id, name, password)
VALUES ('3', 'Mathis', '21345');

INSERT INTO users (id, name, password)
VALUES ('4', 'Luc', '12345');

INSERT INTO users (id, name, password)
VALUES ('5', 'Thomas', '12345');


-- Insertion de catégories
INSERT INTO categories (id, name) 
VALUES ('1', 'Électroménager');

INSERT INTO categories (id, name) 
VALUES ('2', 'Mobilier');

INSERT INTO categories (id, name) 
VALUES ('3', 'Sport et Loisirs');

INSERT INTO categories (id, name) 
VALUES ('4', 'High-Tech');

INSERT INTO categories (id, name) 
VALUES ('5', 'Jardinage');

-- Insertion de produits
INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('1', '2021-12-27', 'Réfrigérateur avec capacité de 300L, classe énergétique A++, finition en acier inoxydable.', 'Réfrigérateur LG 300L', '599.00', '1') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('2', '2020-06-24', 'Canapé 3 places en tissu gris avec structure en bois massif, coussins déhoussables.', 'Canapé Scandinave', '899.00', '2') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('3', '2023-02-19', 'Vélo tout terrain (VTT) avec cadre en aluminium, freins à disque et 21 vitesses.', 'VTT Rockrider', '459.00', '3') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('4', '2023-04-05', 'Machine à laver avec capacité de 8 kg, programme rapide 30 minutes, et écran tactile.', 'Lave-linge Samsung EcoBubble', '529.00', '1') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('5', '2022-07-15', 'Télévision 4K UHD de 55 pouces avec technologie HDR10 et système Android TV.', 'TV Sony Bravia 55"', '749.00', '4') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('6', '2023-03-11', 'Table à manger en bois de chêne massif, dimensions 200x100 cm, style rustique.', 'Table à manger chêne massif', '1200.00', '2') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('7', '2021-10-30', 'Tondeuse électrique avec largeur de coupe de 40 cm, idéale pour les jardins de taille moyenne.', 'Tondeuse Bosch Rotak 40', '299.00', '5') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('8', '2023-01-20', 'Ordinateur portable avec écran 15.6 pouces, processeur Intel Core i5, 8 Go RAM, 256 Go SSD.', 'Laptop Lenovo ThinkPad', '799.00', '4') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('9', '2023-05-18', 'Ensemble de 2 chaises en velours bleu avec pieds en métal doré, style moderne.', 'Chaises modernes en velours', '250.00', '2') IF NOT EXISTS;

INSERT INTO products (id, date_ajout, description, nom, prix, idcategorie) 
VALUES ('10', '2022-11-05', 'Barbecue au charbon de bois avec grille en acier inoxydable et roulettes pour faciliter le déplacement.', 'Barbecue Weber Compact', '179.00', '5') IF NOT EXISTS;
