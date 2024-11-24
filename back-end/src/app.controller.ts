import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UUID } from 'crypto';
import { types } from 'cassandra-driver';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('api/products')
  async getAllProducts(): Promise<any> {
    return this.appService.getAllProducts();
  }

  @Get('api/categories')
  async getAllCategories(): Promise<any> {
    return this.appService.getAllCategories();
  }

  @Get('api/categorie/:id')
  async getProductsByCategorie(@Param('id') id: String): Promise<any> {
    const id_categorie = id.toString();
    return this.appService.getProductsByCategorie(id_categorie);
  }

}