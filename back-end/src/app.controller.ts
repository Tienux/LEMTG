import { Body, Controller, Delete, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService, // Injecter le service JWT
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('api/products')
  async getAllProducts(): Promise<any> {
    return this.appService.getAllProducts();
  }

  @Get('api/products/:id')
  async getProduct(@Param('id') id: string): Promise<any> {
    return this.appService.getProduct(id);
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
  async createUser(@Body() body: { name: string; password: string }): Promise<any> {
    const { name, password } = body;
    return await this.appService.createUser(name, password);
  }

  @Delete('api/users/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.appService.deleteUser(id);
  }

  @Post('api/login')
  async login(@Body() body: { username: string; password: string }): Promise<any> {
    const { username, password } = body;

    // Vérification des identifiants dans la base de données
    const user = await this.appService.authenticateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Création du token JWT
    const payload = { username: user.name, sub: user.id };
    const token = this.jwtService.sign(payload); // Générer le token

    // Retourner le token JWT et les informations de l'utilisateur
    return { message: 'Connexion réussie', user, token };
  }


  // Panier
  @Post('api/users/:userId/cart')
  async addToCart(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number }
  ): Promise<any> {
    const { productId, quantity } = body;
    return this.appService.addToCart(userId, productId, quantity);
  }

  // Nouvelle méthode pour supprimer un produit du panier
  @Delete('api/users/:userId/cart')
  async removeFromCart(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number }
  ): Promise<any> {
    const { productId, quantity } = body;
    return this.appService.removeFromCart(userId, productId, quantity);
  }

  // Nouvelle méthode pour récupérer le panier d'un utilisateur
  @Get('api/users/:userId/cart')
  async getCart(@Param('userId') userId: string): Promise<any> {
    return this.appService.getCart(userId);
  }

  // Nouvelle méthode pour vider le panier d'un utilisateur
  @Delete('api/users/:userId/cart/clear')
  async clearCart(@Param('userId') userId: string): Promise<any> {
    return this.appService.clearCart(userId);
  }
}
