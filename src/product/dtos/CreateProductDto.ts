import * as Joi from 'joi';

export interface CreateProductDto {
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  stock: number;
}

const priceSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().valid('EUR', 'SEK').required(),
});

export const CreateProductDtoSchema = Joi.object({
  name: Joi.string().required(),
  price: priceSchema,
  stock: Joi.number().min(0).required(),
}).options({
  abortEarly: false,
});
