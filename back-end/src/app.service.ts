import { Injectable } from '@nestjs/common';
import { Client, types} from 'cassandra-driver';


@Injectable()
export class AppService {
  private client: Client;

  constructor() {
    this.client = new Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      keyspace: 'projet_web'
    });
  }

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getAllProducts(): Promise<any> {
    const query = 'SELECT * FROM products limit 50';
    const result = await this.client.execute(query);
    return result.rows;
  }

  async getAllCategories(): Promise<any> {
    const query = 'SELECT * FROM categories';
    const result = await this.client.execute(query);
    return result.rows;
  }



}