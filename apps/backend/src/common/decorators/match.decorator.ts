import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const relatedPropertyName = args.constraints[0] as string;
          const relatedValue = (args.object as Record<string, string>)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
