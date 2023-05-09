import { ProductEntity } from '../entities/product.entity';

export class ProductWithFormattedPriceDto {
  id: string;
  name: string;
  price: string;
  stock: number;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.price = new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: product.price.currency,
    }).format(product.price.amount);
    this.stock = product.stock;
  }
}
