import { Inject, Injectable } from '@nestjs/common';
import { IFlashSalesRepository } from '../entities/flash-sales.repository.interface';

@Injectable()
export class GetAllTimeSlotsUseCase {
  constructor(
    @Inject(IFlashSalesRepository)
    private readonly repository: IFlashSalesRepository,
  ) {}

  async execute() {
    return this.repository.findAllTimeSlots();
  }
}
