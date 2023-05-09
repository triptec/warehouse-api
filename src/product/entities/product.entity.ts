import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface ProductEntity extends InMemoryDBEntity {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  stock: number;
}
