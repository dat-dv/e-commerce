import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { AuthModule } from '../auth/auth.module';
import { ITagsRepository } from './domain/tags.repository.interface';
import { TagsRepository } from './infrastructure/tags.repository';
import { CreateTagUseCase } from './use-cases/create-tag.use-case';
import { FindAllTagsUseCase } from './use-cases/find-all-tags.use-case';
import { FindOneTagUseCase } from './use-cases/find-one-tag.use-case';
import { UpdateTagUseCase } from './use-cases/update-tag.use-case';
import { RemoveTagUseCase } from './use-cases/remove-tag.use-case';

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
  exports: [ITagsRepository],
})
export class TagsModule {}
