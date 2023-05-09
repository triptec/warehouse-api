import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import {
  CreateProductDto,
  CreateProductDtoSchema,
} from './dtos/CreateProductDto';

@Injectable()
export class CreateProductValidatorPipe implements PipeTransform {
  public transform(value: CreateProductDto): CreateProductDto {
    const result = CreateProductDtoSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
