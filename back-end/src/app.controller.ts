import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
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

  @Get('api/users')
  async getAllUsers(): Promise<any> {
    return this.appService.getAllUsers();
  }

  @Get('api/users/:urlname')
  async getUser(@Param('urlname') urlname: string): Promise<any> {
    return this.appService.getUser(urlname);
  }




  
  @Post('api/users')
  async createUser(@Body() body: { name: string }): Promise<any> {
    return this.appService.createUser(body.name);
  }

  @Delete('api/users/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.appService.deleteUser(id);
  }

}