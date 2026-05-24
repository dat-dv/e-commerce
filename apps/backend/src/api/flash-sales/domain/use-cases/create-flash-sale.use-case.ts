import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFlashSaleDto } from '../../dto/create-flash-sale.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class CreateFlashSaleUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly flashSalesRepository: IFlashSalesRepository,
  ) {}

  async execute(dto: CreateFlashSaleDto) {
    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (dto.time_slot_id) {
      const timeSlot = await this.flashSalesRepository.findTimeSlotById(dto.time_slot_id);
      if (!timeSlot) {
        throw new BadRequestException('Time slot not found');
      }
    }

    return this.flashSalesRepository.create(dto);
  }
}
