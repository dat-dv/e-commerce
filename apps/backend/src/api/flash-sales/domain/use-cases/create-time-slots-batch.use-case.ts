import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTimeSlotsBatchDto } from '../../dto/create-time-slot.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class CreateTimeSlotsBatchUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly flashSalesRepository: IFlashSalesRepository,
  ) {}

  async execute(dto: CreateTimeSlotsBatchDto) {
    if (!dto.slots || dto.slots.length === 0) {
      throw new BadRequestException('Slots list cannot be empty');
    }

    for (const slot of dto.slots) {
      const startMinutesTotal = slot.start_hour * 60 + (slot.start_minute ?? 0);
      const endMinutesTotal = slot.end_hour * 60 + (slot.end_minute ?? 59);

      if (startMinutesTotal >= endMinutesTotal) {
        throw new BadRequestException(`Start time must be before end time in slot "${slot.name}"`);
      }
    }

    return this.flashSalesRepository.createTimeSlotsBatch(dto);
  }
}
