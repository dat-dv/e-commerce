import { Injectable, Inject } from '@nestjs/common';
import { ITagsRepository } from '../entities/tags.repository.interface';

@Injectable()
export class FindAllTagsUseCase {
  constructor(
    @Inject(ITagsRepository)
    private readonly tagsRepository: ITagsRepository,
  ) {}

  async execute(page: number, limit: number) {
    return this.tagsRepository.findAll(page, limit);
  }
}
