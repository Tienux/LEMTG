import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { createClient } from 'redis';

@Injectable()
export class AppService {
  private cassandraClient: Client;
  private redisClient;

  constructor() {
    // Initialisation de Cassandra
    this.cassandraClient = new Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      keyspace: 'projet_web',
    });

    // Initialisation de Redis
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  // Méthodes Cassandra
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getAllProducts(): Promise<any> {
    const query = 'SELECT * FROM products LIMIT 50';
    const result = await this.cassandraClient.execute(query);
    return result.rows;
  }

  async getProduct(productId: string): Promise<any> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const result = await this.cassandraClient.execute(query, [productId], { prepare: true });
    return result.rows[0];
  }
  

  async getAllCategories(): Promise<any> {
    const query = 'SELECT * FROM categories';
    const result = await this.cassandraClient.execute(query);
    return result.rows;
  }

  async getAllUsers(): Promise<any[]> {
    const query = 'SELECT id, name, password FROM users';
    const result = await this.cassandraClient.execute(query);
    const users = result.rows;
  
    return await Promise.all(
      users.map(async (user) => {
        const cart = await this.redisClient.hGetAll(`cart:${user.id}`);
        return {
          id: user.id,
          name: user.name,
          password: user.password,
          cart: Object.keys(cart).length > 0 ? cart : {},
        };
      }),
    );
  }
  
  async getUser(userId: string): Promise<any> {
    const userQuery = 'SELECT id, name, password FROM users WHERE id = ?';
    const userResult = await this.cassandraClient.execute(userQuery, [userId]);
  
    if (userResult.rowLength === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }
  
    const user = userResult.rows[0];
    const cart = await this.redisClient.hGetAll(`cart:${user.id}`);
  
    return {
      id: user.id,
      name: user.name,
      password: user.password,
      cart: Object.keys(cart).length > 0 ? cart : {},
    };
  }
  

  async createUser(name: string, password: string): Promise<any> {
    const usersQuery = 'SELECT MAX(id) AS maxId FROM users';
    const usersResult = await this.cassandraClient.execute(usersQuery);
    const maxId = parseInt(usersResult.rows[0]?.maxid || '0', 10); 
    const userId = (maxId + 1).toString();
    const query = 'INSERT INTO users (id, name, password) VALUES (?, ?, ?)';
    await this.cassandraClient.execute(query, [userId, name, password], { prepare: true });
  
    return { id: userId, name };
  }
  

  async deleteUser(userId: string): Promise<any> {
    const userQuery = 'SELECT id, idpanier FROM users WHERE id = ?';
    const userResult = await this.cassandraClient.execute(userQuery, [userId]);

    if (userResult.rowLength === 0) {
      throw new Error(`user ${userId} not found`);
    }

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await this.cassandraClient.execute(deleteQuery, [userId], { prepare: true });

    const cartId = userResult.rows[0].idpanier;
    await this.redisClient.del(`cart:${cartId}`);

    return { message: `user ${userId} deleted` };
  }

  async authenticateUser(username: string, password: string): Promise<any> {
    // Vérifier l'existence de l'utilisateur dans la base de données
    const query = 'SELECT id, name, password FROM users WHERE name = ? ALLOW FILTERING';
    const result = await this.cassandraClient.execute(query, [username]);

    if (result.rowLength === 0) {
      return null; // Utilisateur non trouvé
    }

    const user = result.rows[0];

    // Vérifier le mot de passe (assurez-vous de gérer cela correctement avec le hachage en vrai)
    if (user.password !== password) {
      return null; // Mot de passe incorrect
    }

    // Retourner les informations de l'utilisateur si l'authentification réussie
    return { id: user.id, name: user.name };
  }


  async setProductToCart(userId: string, productId: string, quantity: number): Promise<void> {
    const cartKey = `cart:${userId}`;

    try {
        // Ajouter dans Redis avec TTL
        await this.redisClient.hSet(cartKey, productId, quantity);
        await this.redisClient.expire(cartKey, 3600);
        console.log("Produit ajouté dans Redis avec TTL de 3600 secondes.");

        // Requête d'insertion dans Cassandra
        const query = `
            INSERT INTO carts (user_id, product_id, quantity)
            VALUES (?, ?, ?)
        `;

        const result = await this.cassandraClient.execute(query, [userId, productId, quantity], { prepare: true });

        // Vérification de la réponse de Cassandra
        if (result && result.info.queriedHost) {
            console.log("Requête Cassandra réussie. Hôte interrogé :", result.info.queriedHost);
        } else {
            console.warn("La requête Cassandra semble avoir échoué sans erreur explicite.");
        }

    } catch (error) {
        console.error("Erreur lors de l'ajout du produit dans Redis ou Cassandra :", error);
        throw new Error("Échec de l'ajout du produit au panier.");
    }
}



async removeProductFromCart(userId: string, productId: string): Promise<void> {
  const cartKey = `cart:${userId}`;
  await this.redisClient.hDel(cartKey, productId);
  const query = `
      DELETE FROM carts
      WHERE user_id = ? AND product_id = ?
  `;
  await this.cassandraClient.execute(query, [userId, productId], { prepare: true });
}


async getCart(userId: string): Promise<{ productId: string; quantity: number }[]> {
  const cartKey = `cart:${userId}`;
  let cart = await this.redisClient.hGetAll(cartKey);

  try {
      if (Object.keys(cart).length === 0) {
          console.log("Pas de donnée en mémoire, recherche dans Cassandra");

          // Requête pour récupérer le panier depuis Cassandra
          const query = `
              SELECT product_id, quantity
              FROM carts
              WHERE user_id = ?
          `;
          const result = await this.cassandraClient.execute(query, [userId], { prepare: true });

          // Vérification que des résultats ont été renvoyés par Cassandra
          if (result && result.rows && result.rows.length > 0) {
              cart = {};
              result.rows.forEach(row => {
                  cart[row.product_id] = row.quantity.toString();
              });
              if (Object.keys(cart).length > 0) {
                  console.log('Recharge du panier et TTL dans Redis');
                  await this.redisClient.hSet(cartKey, cart);
                  await this.redisClient.expire(cartKey, 3600);
              }
          } else {
              console.log('Aucun produit trouvé dans le panier pour l\'utilisateur.');
          }
      }

      console.log("Panier récupéré depuis Redis");
      return Object.entries(cart).map(([productId, quantity]) => ({
          productId,
          quantity: parseInt(quantity as string, 10),
      }));
  } catch (error) {
      console.error("Erreur lors de la récupération du panier dans Redis ou Cassandra :", error);
      throw new Error("Échec de la récupération du panier.");
  }
}




async clearCart(userId: string): Promise<void> {
  const cartKey = `cart:${userId}`;

  // Supprimer de Redis
  await this.redisClient.del(cartKey);

  // Supprimer de Cassandra
  const query = `
      DELETE FROM carts
      WHERE user_id = ?
  `;
  await this.cassandraClient.execute(query, [userId], { prepare: true });
}

  

  

}
