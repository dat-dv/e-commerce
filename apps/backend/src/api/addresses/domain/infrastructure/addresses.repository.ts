import { Injectable } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ICreateAddressInput, IUpdateAddressInput, IAddressResponse } from '@ecommerce/shared';

@Injectable()
export class AddressesRepository implements IAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: ICreateAddressInput): Promise<IAddressResponse> {
    const address = await this.prisma.shippingAddress.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
    return address;
  }

  async findAll(userId: string): Promise<IAddressResponse[]> {
    const addresses = await this.prisma.shippingAddress.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    return addresses;
  }

  async findById(id: string): Promise<IAddressResponse | null> {
    const address = await this.prisma.shippingAddress.findUnique({
      where: { id },
    });
    return address;
  }

  async update(id: string, data: IUpdateAddressInput): Promise<IAddressResponse> {
    const address = await this.prisma.shippingAddress.update({
      where: { id },
      data,
    });
    return address;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shippingAddress.delete({
      where: { id },
    });
  }

  async unsetOthersDefault(userId: string, excludeId: string): Promise<void> {
    await this.prisma.shippingAddress.updateMany({
      where: {
        user_id: userId,
        id: { not: excludeId },
        is_default: true,
      },
      data: {
        is_default: false,
      },
    });
  }
}
