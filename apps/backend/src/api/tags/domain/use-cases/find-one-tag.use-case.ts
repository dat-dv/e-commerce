import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ITagsRepository } from '../entities/tags.repository.interface';

@Injectable()
export class FindOneTagUseCase {
  constructor(
    @Inject(ITagsRepository)
    private readonly tagsRepository: ITagsRepository,
  ) {}

  async execute(id: string) {
    const tag = await this.tagsRepository.findById(id);
    if (!tag) {
      throw new BadRequestException('Tag not found');
    }
    return tag;
  }
}
