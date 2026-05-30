import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AttributesController } from './attributes.controller';
import { IAttributesRepository } from './domain/entities/attributes.repository.interface';
import { AttributesRepository } from './domain/infrastructure/attributes.repository';
import { GetAttributesUseCase } from './domain/use-cases/get-attributes.use-case';

@Module({
  imports: [SharedModule],
  controllers: [AttributesController],
  providers: [
    GetAttributesUseCase,
    {
      provide: IAttributesRepository,
      useClass: AttributesRepository,
    },
  ],
  exports: [GetAttributesUseCase, IAttributesRepository],
})
export class AttributesModule {}
