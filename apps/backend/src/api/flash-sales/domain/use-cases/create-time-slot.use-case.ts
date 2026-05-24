import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTimeSlotDto } from '../../dto/create-time-slot.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class CreateTimeSlotUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly flashSalesRepository: IFlashSalesRepository,
  ) {}

  async execute(dto: CreateTimeSlotDto) {
    const startMinutesTotal = dto.start_hour * 60 + (dto.start_minute ?? 0);
    const endMinutesTotal = dto.end_hour * 60 + (dto.end_minute ?? 59);

    if (startMinutesTotal >= endMinutesTotal) {
      throw new BadRequestException('Start time must be before end time within the same day time slot');
    }

    return this.flashSalesRepository.createTimeSlot(dto);
  }
}
