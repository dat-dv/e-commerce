import { ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        console.log('--- CustomValidationPipe ---');
        const formattedErrors = errors.flatMap((err) =>
          Object.values(err.constraints || {}).map((msg) => ({
            field: err.property,
            message: msg,
          })),
        );
        return new BadRequestException(formattedErrors);
      },
    });
  }
}
