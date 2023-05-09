import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import * as productData from '../seed/products.json';
import { CreateProductDto } from './dtos/CreateProductDto';
import { ProductWithFormattedPriceDto } from './dtos/ProductWithFormattedPriceDto';
import { UpdateProductStockDto } from './dtos/UpdateProductStockDto';
import { ProductEntity } from './entities/product.entity';
import { CreateProductValidatorPipe } from './validation.pipe';

@Controller('products')
export class ProductController {
  constructor(private productService: InMemoryDBService<ProductEntity>) {}

  @Get('seed')
  SeedProducts() {
    for (const product of productData.products) {
      this.productService.create({
        ...product,
      });
    }
  }

  @Get()
  getProducts(): ProductWithFormattedPriceDto[] {
    const products = this.productService.getAll();
    const formattedProducts = products.map(
      (product) => new ProductWithFormattedPriceDto(product),
    );
    return formattedProducts;
  }

  @Get(':id')
  GetProductById(@Param('id') id: string): ProductWithFormattedPriceDto {
    const product = this.productService.get(id);
    if (!product) {
      throw new NotFoundException('Not found');
    }
    return new ProductWithFormattedPriceDto(product);
  }

  @HttpCode(204)
  @Put(':id/stock')
  EditProduct(@Param('id') id: string, @Body() product: UpdateProductStockDto) {
    const productToUpdate = this.productService.get(id);
    if (!productToUpdate) {
      throw new NotFoundException('Not found');
    }
    productToUpdate.stock = product.stock;
    this.productService.update(productToUpdate);
  }

  @HttpCode(201)
  @Post()
  @UsePipes(new CreateProductValidatorPipe())
  CreateProduct(@Body() product: CreateProductDto) {
    return this.productService.create(product);
  }
}
