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

  async getAllCategories(): Promise<any> {
    const query = 'SELECT * FROM categories';
    const result = await this.cassandraClient.execute(query);
    return result.rows;
  }

  async getAllUsers(): Promise<any[]> {
    const query = 'SELECT id, idpanier, name, password FROM users'; // Ajout du champ password
    const result = await this.cassandraClient.execute(query);
    const users = result.rows;
  
    // Récupérer les paniers pour chaque utilisateur
    const usersWithCarts = await Promise.all(
      users.map(async (user) => {
        const cart = await this.redisClient.hGetAll(`cart:${user.idpanier}`);
        return {
          id: user.id,
          name: user.name,
          password: user.password, // Inclure le mot de passe
          cartId: user.idpanier,
          cart,
        };
      }),
    );
  
    return usersWithCarts;
  }
  
  


  async getUser(userId: string): Promise<any> {
    const userQuery = 'SELECT id, idpanier, name, password FROM users WHERE id = ?'; // Ajout du champ password
    const userResult = await this.cassandraClient.execute(userQuery, [userId]);
  
    if (userResult.rowLength === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }
  
    const user = userResult.rows[0];
    const cart = await this.redisClient.hGetAll(`cart:${user.idpanier}`);
  
    return {
      id: user.id,
      name: user.name,
      password: user.password, // Inclure le mot de passe
      cartId: user.idpanier,
      cart,
    };
  }
  
  
  // Méthodes Redis (Gestion du Panier)
  async getCart(userId: string): Promise<any> {
    const cart = await this.redisClient.hGetAll(`cart:${userId}`);
    return Object.entries(cart).map(([key, value]) => ({
      productId: key.replace('product:', ''),
      quantity: parseInt(value as string, 10),
    }));
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<void> {
    const existingQuantity = await this.redisClient.hGet(`cart:${userId}`, `product:${productId}`);
    const newQuantity = (existingQuantity ? parseInt(existingQuantity, 10) : 0) + quantity;
    await this.redisClient.hSet(`cart:${userId}`, `product:${productId}`, newQuantity);
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.redisClient.hDel(`cart:${userId}`, `product:${productId}`);
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(userId, productId);
    } else {
      await this.redisClient.hSet(`cart:${userId}`, `product:${productId}`, quantity);
    }
  }

  async clearCart(userId: string): Promise<void> {
    await this.redisClient.del(`cart:${userId}`);
  }
  async authenticateUser(username: string, password: string): Promise<any> {
    const query = 'SELECT * FROM users WHERE name = ? ALLOW FILTERING';
    const result = await this.cassandraClient.execute(query, [username]);
  
    if (result.rowLength === 0) {
      return null; // Utilisateur non trouvé
    }
  
    const user = result.rows[0];
  
    // Vérification du mot de passe (pas de sécurité pour l'instant, mais à améliorer plus tard)
    if (user.password === password) {
      return { id: user.id, name: user.name, idpanier: user.idpanier };
    }
  
    return null; // Identifiants incorrects
  }


  // Création utilisateur
  async createUser(name: string): Promise<any> {
    const usersQuery = 'SELECT MAX(id) AS maxId FROM users';
    const usersResult = await this.cassandraClient.execute(usersQuery);
    
    const maxId = parseInt(usersResult.rows[0].maxid || '0', 10); 
    const userId = (maxId + 1).toString();
  
    const cartsQuery = 'SELECT MAX(idpanier) AS maxCartId FROM users';
    const cartsResult = await this.cassandraClient.execute(cartsQuery);
    
    const maxCartId = parseInt(cartsResult.rows[0].maxcartid || '0', 10); 
    const cartId = (maxCartId + 1).toString();
  
    const query = 'INSERT INTO users (id, name, idpanier) VALUES (?, ?, ?)';
    await this.cassandraClient.execute(query, [userId, name, cartId], { prepare: true });
  
    const cartExists = await this.redisClient.exists(`cart:${cartId}`);
    if (!cartExists) {
      await this.redisClient.hSet(`cart:${cartId}`, 'initialized', 'true');
      console.log(`Panier initialisé pour l'utilisateur ${name} avec panier ID ${cartId}`);
    }
  
    return { id: userId, name, cartId, cart: { initialized: 'true' } };
  }
  
  
  
  

  // Delete user
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
}
