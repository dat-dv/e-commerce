import { Injectable } from '@nestjs/common';
import { IAddressesRepository } from '../entities/addresses.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ShippingAddress } from '../../../../../generated/prisma/client';
import { ICreateAddressInput, IUpdateAddressInput } from '@ecommerce/shared';

@Injectable()
export class AddressesRepository implements IAddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: ICreateAddressInput): Promise<ShippingAddress> {
    return this.prisma.shippingAddress.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
  }

  async findAll(userId: string): Promise<ShippingAddress[]> {
    return this.prisma.shippingAddress.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string): Promise<ShippingAddress | null> {
    return this.prisma.shippingAddress.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: IUpdateAddressInput): Promise<ShippingAddress> {
    return this.prisma.shippingAddress.update({
      where: { id },
      data,
    });
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
