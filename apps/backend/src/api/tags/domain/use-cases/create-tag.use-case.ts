import { Injectable, Inject } from '@nestjs/common';
import { ITagsRepository } from '../entities/tags.repository.interface';
import { CreateTagDto } from '../../dto/create-tag.dto';

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(ITagsRepository)
    private readonly tagsRepository: ITagsRepository,
  ) {}

  async execute(createTagDto: CreateTagDto) {
    return this.tagsRepository.create(createTagDto);
  }
}
