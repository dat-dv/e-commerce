import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ITagsRepository } from '../entities/tags.repository.interface';
import { UpdateTagDto } from '../../dto/update-tag.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(ITagsRepository)
    private readonly tagsRepository: ITagsRepository,
  ) {}

  async execute(id: string, updateTagDto: UpdateTagDto): Promise<Prisma.TagGetPayload<Record<string, never>>> {
    const tag = await this.tagsRepository.findById(id);
    if (!tag) {
      throw new BadRequestException('Tag not found');
    }

    return this.tagsRepository.update(id, updateTagDto);
  }
}
