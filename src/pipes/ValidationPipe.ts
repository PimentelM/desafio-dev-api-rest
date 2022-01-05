import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe as VP,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe extends VP {
  constructor(options) {
    super(options);
  }

  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'ValidationError',
        message: 'Erro de validação, consulte a documentação da API',
        data: Object.entries(errors[0].constraints)[0][1],
      });
    }
    return value;
  }

  static toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object, Date];
    return !types.includes(metatype);
  }
}
