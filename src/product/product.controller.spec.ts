import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { ProductWithFormattedPriceDto } from './dtos/ProductWithFormattedPriceDto';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: InMemoryDBService<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [InMemoryDBService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService =
      module.get<InMemoryDBService<ProductEntity>>(InMemoryDBService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of ProductWithFormattedPriceDto', async () => {
      const products = [
        {
          id: 'id1',
          name: 'Product 1',
          price: {
            amount: 100,
            currency: 'EUR',
          },
          stock: 10,
        },
      ];
      const result = products.map(
        (product) => new ProductWithFormattedPriceDto(product),
      );
      jest.spyOn(productService, 'getAll').mockImplementation(() => products);

      expect(await controller.getProducts()).toEqual(result);
    });
  });

  describe('GetProductById', () => {
    it('should return a ProductWithFormattedPriceDto', async () => {
      const product = {
        id: 'id1',
        name: 'Product 1',
        price: {
          amount: 100,
          currency: 'EUR',
        },
        stock: 10,
      };
      const result = new ProductWithFormattedPriceDto(product);
      jest.spyOn(productService, 'get').mockImplementation(() => product);

      expect(await controller.GetProductById('id1')).toEqual(result);
    });

    it('should return a ProductWithFormattedPriceDto', () => {
      jest.spyOn(productService, 'get').mockImplementation(() => null as any);
      try {
        controller.GetProductById('id1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('EditProduct', () => {
    it('should return undefined', async () => {
      const product = {
        id: 'id1',
        name: 'Product 1',
        price: {
          amount: 100,
          currency: 'EUR',
        },
        stock: 10,
      };
      jest.spyOn(productService, 'get').mockImplementation(() => product);
      jest.spyOn(productService, 'update').mockImplementation(() => undefined);

      expect(await controller.EditProduct('id1', { stock: 5 })).toEqual(
        undefined,
      );
    });

    it('should throw if it cant find the product', async () => {
      jest.spyOn(productService, 'get').mockImplementation(() => null as any);
      jest.spyOn(productService, 'update').mockImplementation(() => undefined);

      try {
        controller.EditProduct('id1', { stock: 5 });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('CreateProduct', () => {
    it('should return the new product', async () => {
      const product = {
        id: 'id1',
        name: 'Product 1',
        price: {
          amount: 100,
          currency: 'EUR',
        },
        stock: 10,
      };
      jest.spyOn(productService, 'create').mockImplementation(() => product);

      expect(await controller.CreateProduct(product)).toEqual(product);
    });
  });
});
