
# 🚀 **Projet Etienne, Luc, Mathis, Gabriel, Thomas** 🎉

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <a href="http://vite.com/" target="blank">
    <img src="https://vitejs.dev/logo.svg" width="120" alt="Vite Logo" />
  </a>
  <a href="http://nodejs.org" target="blank">
    <img src="https://nodejs.org/static/logos/nodejsDark.svg" width="120" margin="100" alt="NodeJS Logo" />
  </a>
</p>

---

## 🛠 **Pré-requis**

- [Node.js](https://nodejs.org/en/download/) > 18.x
- [NestJS](https://docs.nestjs.com/) > 8.x
- [TypeScript](https://www.typescriptlang.org/) > 4.x
- [Docker](https://docs.docker.com/get-docker/) > 20.x
- [Cassandra](https://cassandra.apache.org/) > 4.x

---

## 🚢 **Configurer Cassandra avec Docker**

1. Placez votre fichier `init.cql` dans le même répertoire que `docker-compose.yml` et `Dockerfile`.
2. Lancer Docker sur votre machine.
3. Allez dans le répertoire `back-end` :
   ```bash
   $ cd back-end
   ```
4. Ensuite, accédez au dossier `cassandra-setup` :
   ```bash
   $ cd cassandra-setup
   ```
5. Lancez Cassandra :
   ```bash
   $ docker compose up -d
   ```
6. Une fois cassandra opérationnel, il est possible de vérifier les données :
   - Accédez au conteneur Cassandra :
     ```bash
     $ docker exec -it cassandra-container cqlsh
     ```
   - Utilisez le keyspace :
     ```bash
     $ USE projet_web;
     ```
    -  Selectionnez les données produits :
        ```bash
        $ SELECT * FROM products;
        ```

---

## 🖥️ **Lancer le projet**

### **Cloner le projet**

1. Clonez le projet depuis GitHub :
   ```bash
   $ git clone


### **Configuration du back-end**

1. Installez les dépendances nécessaires dans le dossier `back-end` :
   ```bash
   $ cd back-end
   $ npm install
   ```
   ou 
   ```bash
   $ yarn install
   ```
2. Lancez le serveur back-end :
   ```bash
   $ npm run start
   ```
   ou 
   ```bash
   $ yarn dev
   ```

### **Configuration du front-end**

1. Retournez au répertoire principal:
   ```bash
   $ cd ..
   ```
2. Installez les dépendances pour le front-end :
   ```bash
   $ npm install
   ```
   ou 
   ```bash
   $ yarn install
   ```
3. Lancez le serveur de développement :
   ```bash
   $ npm run dev
   ```
   ou 
   ```bash
   $ yarn dev
   ```

---

## 🔧 **Technologies utilisées**

- **NestJS** <img src="https://nestjs.com/img/logo-small.svg" width="30">
- **Vite.js** <img src="https://vitejs.dev/logo.svg" width="30">
- **npm** <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" width="30">
- **Docker** <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Docker_logo.png" width="30">
- **Cassandra** <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Cassandra_logo.svg" width="30">

## 👥 Contributeurs

<div style="display: flex; align-items: center;">
  <a href="" style="margin-left: 20px;">
    <img src="https://avatars.githubusercontent.com/u/70567344?v=4" alt="Etienne" width="50" />
    <p>Etienne</p>
  </a>
  <a href="" style="margin-left: 20px;">
    <img src="https://avatars.githubusercontent.com/u/55317571?v=40" alt="Gabriel" width="50" />
    <p>Gabriel</p>
  </a>
  <a href="" style="margin-left: 20px;">
    <img src="https://github.com/username3.png?size=100" alt="Luc" width="50" />
    <p>Luc</p>
  </a>
  <a href="" style="margin-left: 20px;">
    <img src="https://avatars.githubusercontent.com/u/101724814?v=4" alt="Mathis" width="50" />
    <p>Mathis</p>
  </a>
   <a href="" style="margin-left: 20px;">
    <img src="https://via.placeholder.com/50" alt="Thomas" width="50" />
    <p>Thomas</p>
</a>
</div>

