#!/bin/bash

# Nom du conteneur
CONTAINER_NAME="cassandra-container"

# Supprimer l'ancien conteneur Cassandra
docker rm -f $CONTAINER_NAME

# Télécharger la dernière image Cassandra
docker pull cassandra:latest

# Démarrer Cassandra avec Docker Compose
docker-compose up -d

# Attendre que Cassandra démarre
echo "Attente du démarrage de Cassandra..."
sleep 30  # Ajuster ce délai si nécessaire

# Vérifier si le conteneur est en cours d'exécution
if [[ $(docker ps -q -f name=$CONTAINER_NAME) ]]; then
    echo "Cassandra est en cours d'exécution."

    # Créer un keyspace
    docker exec -it $CONTAINER_NAME cqlsh -e "CREATE KEYSPACE IF NOT EXISTS projet_web WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};"

    # Utiliser le keyspace
    docker exec -it $CONTAINER_NAME cqlsh -e "USE projet_web;"

    # Deleter la table si elle existe
    docker exec -it $CONTAINER_NAME cqlsh -e "DROP TABLE IF EXISTS projet_web.produits;"

    # Ajouter le fichier script.sql au conteneur
    docker cp ./script.sql $CONTAINER_NAME:/script.sql

    # Exécuter le fichier script.sql
    docker exec -it $CONTAINER_NAME cqlsh -f /script.sql

    # Afficher les données dans la table
    docker exec -it $CONTAINER_NAME cqlsh -e "SELECT * FROM projet_web.products;"
else
    echo "Le conteneur Cassandra n'a pas démarré correctement."
    exit 1
fi
