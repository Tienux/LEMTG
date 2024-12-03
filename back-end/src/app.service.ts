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

  async getAllUsers(): Promise<any> {
    const query = 'SELECT * FROM users';
    const result = await this.cassandraClient.execute(query);
    return result.rows;
  }

  async initializeCartsForExistingUser(): Promise<void> {
    const usersQuery = 'SELECT id, idpanier FROM users';
    const usersResult = await this.cassandraClient.execute(usersQuery);
  
    const users = usersResult.rows;
  
    for (const user of users) {
      const userId = user.id;
      const cartId = user.idpanier;
      const cartExists = await this.redisClient.exists(`cart:${cartId}`);
      if (!cartExists) {
        await this.redisClient.hSet(`cart:${cartId}`, {});
        console.log(`Panier initialisé vide pour l'utilisateur ${userId} avec le panier ID ${cartId}`);
      } else {
        console.log(`Le panier ${cartId} pour l'utilisateur ${userId} existe déjà`);
      }
    }
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
}
