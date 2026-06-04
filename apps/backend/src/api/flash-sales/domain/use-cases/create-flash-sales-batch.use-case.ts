import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateFlashSalesBatchDto } from '../../dto/create-flash-sale.dto';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class CreateFlashSalesBatchUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly flashSalesRepository: IFlashSalesRepository,
  ) {}

  async execute(dto: CreateFlashSalesBatchDto) {
    if (!dto.flash_sales || dto.flash_sales.length === 0) {
      throw new BadRequestException('Flash sales list cannot be empty');
    }

    // Lọc ra các time_slot_id và loại bỏ trùng lặp
    const timeSlotIds = Array.from(
      new Set(dto.flash_sales.map((item) => item.time_slot_id).filter((id): id is string => !!id)),
    );

    // Batch fetch tất cả time slot liên quan
    const timeSlots = await this.flashSalesRepository.findTimeSlotsByIds(timeSlotIds);
    const timeSlotSet = new Set(timeSlots.map((ts) => ts.id));

    for (const item of dto.flash_sales) {
      const startTime = new Date(item.start_time);
      const endTime = new Date(item.end_time);

      if (startTime >= endTime) {
        throw new BadRequestException(`Start time must be before end time in campaign "${item.name}"`);
      }

      if (item.time_slot_id && !timeSlotSet.has(item.time_slot_id)) {
        throw new BadRequestException(`Time slot not found for campaign "${item.name}"`);
      }
    }

    return this.flashSalesRepository.createFlashSalesBatch(dto);
  }
}
