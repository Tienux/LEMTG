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


  //panier
  async setProductToCart(userId: string, productId: string, quantity: number): Promise<any> {
    const cartKey = `cart:${userId}`;
    await this.redisClient.hSet(cartKey, productId, quantity);
  }

  async removeProductFromCart(userId: string, productId: string): Promise<any> {
    const cartKey = `cart:${userId}`;
    await this.redisClient.hDel(cartKey, productId);
  }


  async getCart(userId: string): Promise<{ productId: string; quantity: number }[]> {
  const cartKey = `cart:${userId}`;
  const cart = await this.redisClient.hGetAll(cartKey);

  // Convertir les valeurs en entiers pour les quantités
  const cartItems = Object.entries(cart).map(([productId, quantity]) => ({
    productId,
    quantity: parseInt(quantity as string, 10),
  }));

  return cartItems.length > 0 ? cartItems : [];
}


  async clearCart(userId: string): Promise<any> {
    const cartKey = `cart:${userId}`;
    await this.redisClient.del(cartKey);
  
    return { message: `Cart cleared for user ${userId}` };
  }
  

  

}
