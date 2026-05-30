import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { ILanguagesRepository } from './domain/entities/languages.repository.interface';
import { LanguagesRepository } from './domain/infrastructure/languages.repository';
import { GetLanguagesUseCase } from './domain/use-cases/get-languages.use-case';
import { LanguagesController } from './languages.controller';

@Module({
  imports: [SharedModule],
  controllers: [LanguagesController],
  providers: [
    GetLanguagesUseCase,
    {
      provide: ILanguagesRepository,
      useClass: LanguagesRepository,
    },
  ],
  exports: [GetLanguagesUseCase, ILanguagesRepository],
})
export class LanguagesModule {}
