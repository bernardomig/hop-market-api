import { Length } from 'class-validator';

export class ProductDto {
  @Length(5)
  public name: string;
}
