import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { AuthModule } from '../auth/auth.module';
import { ITagsRepository } from './domain/entities/tags.repository.interface';
import { TagsRepository } from './domain/infrastructure/tags.repository';
import { CreateTagUseCase } from './domain/use-cases/create-tag.use-case';
import { FindAllTagsUseCase } from './domain/use-cases/find-all-tags.use-case';
import { FindOneTagUseCase } from './domain/use-cases/find-one-tag.use-case';
import { UpdateTagUseCase } from './domain/use-cases/update-tag.use-case';
import { RemoveTagUseCase } from './domain/use-cases/remove-tag.use-case';

@Module({
  imports: [AuthModule],
  controllers: [TagsController],
  providers: [
    CreateTagUseCase,
    FindAllTagsUseCase,
    FindOneTagUseCase,
    UpdateTagUseCase,
    RemoveTagUseCase,
    {
      provide: ITagsRepository,
      useClass: TagsRepository,
    },
  ],
  exports: [FindAllTagsUseCase, ITagsRepository],
})
export class TagsModule {}
