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
    const query = 'SELECT id, idpanier, name, password FROM users';
    const result = await this.cassandraClient.execute(query);
    const users = result.rows;
  
    const usersWithCarts = await Promise.all(
      users.map(async (user) => {
        const cart = await this.redisClient.hGetAll(`cart:${user.idpanier}`);
        return {
          id: user.id,
          name: user.name,
          password: user.password,
          cartId: user.idpanier,
          cart,
        };
      }),
    );
  
    return usersWithCarts;
  }

  async getUser(userId: string): Promise<any> {
    const userQuery = 'SELECT id, idpanier, name, password FROM users WHERE id = ?';
    const userResult = await this.cassandraClient.execute(userQuery, [userId]);
  
    if (userResult.rowLength === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }
  
    const user = userResult.rows[0];
    const cart = await this.redisClient.hGetAll(`cart:${user.idpanier}`);
  
    return {
      id: user.id,
      name: user.name,
      password: user.password,
      cartId: user.idpanier,
      cart,
    };
  }

  async createUser(name: string, password: string): Promise<any> {
    const usersQuery = 'SELECT MAX(id) AS maxId FROM users';
    const usersResult = await this.cassandraClient.execute(usersQuery);
    const maxId = parseInt(usersResult.rows[0]?.maxid || '0', 10); 
    const userId = (maxId + 1).toString();

    const cartsQuery = 'SELECT MAX(idpanier) AS maxCartId FROM users';
    const cartsResult = await this.cassandraClient.execute(cartsQuery);
    const maxCartId = parseInt(cartsResult.rows[0]?.maxcartid || '0', 10); 
    const cartId = (maxCartId + 1).toString();

    const query = 'INSERT INTO users (id, name, idpanier, password) VALUES (?, ?, ?, ?)';
    await this.cassandraClient.execute(query, [userId, name, cartId, password], { prepare: true });

    const cartExists = await this.redisClient.exists(`cart:${cartId}`);
    if (!cartExists) {
      await this.redisClient.hSet(`cart:${cartId}`, 'initialized', 'true');
      console.log(`Panier initialisé pour l'utilisateur ${name} avec panier ID ${cartId}`);
    }

    return { id: userId, name, cartId, cart: { initialized: 'true' } }
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
}
