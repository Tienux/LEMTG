# Utiliser l'image officielle de Cassandra
FROM cassandra:latest

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier .cql dans l'image (assurez-vous que le fichier se trouve dans le même répertoire que le Dockerfile)
COPY init.cql /app/init.cql

# Installer netcat pour vérifier si Cassandra est prêt
RUN apt-get update && apt-get install -y netcat

# Attendre que Cassandra soit prêt sur le port 9042 avant d'exécuter la commande
CMD ["sh", "-c", "\
    # Démarrer Cassandra en arrière-plan \
    docker-entrypoint.sh cassandra -f & \
    # Vérifier que Cassandra est prêt en écoutant sur le port 9042 sans afficher de message \
    while ! nc -z 127.0.0.1 9042; do \
        sleep 2; \
    done && \
    # Une fois Cassandra prêt, exécuter le fichier CQL \
    cqlsh -f /app/init.cql && \
    # Garder le conteneur en vie \
    tail -f /dev/null"]
