import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

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

  @Post('api/login')
  async login(@Body() body: { username: string; password: string }): Promise<any> {
    const { username, password } = body;

    // Vérification des identifiants dans le service
    const user = await this.appService.authenticateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Si l'utilisateur est authentifié, renvoyer des données utilisateur
    return { message: 'Connexion réussie', user };
  }

  @Post('api/users')
  async createUser(@Body() body: { name: string; password: string }): Promise<any> {
    const { name, password } = body;

    // Appeler le service pour créer l'utilisateur avec un mot de passe
    return await this.appService.createUser(name, password);
  }

  @Delete('api/users/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    // Appeler le service pour supprimer l'utilisateur
    return await this.appService.deleteUser(id);
  }
}
