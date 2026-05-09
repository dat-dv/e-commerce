import { BadRequestException } from '@nestjs/common';

export async function handlePrismaNotFound<T>(promise: Promise<T>, message = 'Record not found'): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    if ((error as { code: string }).code === 'P2025') {
      throw new BadRequestException(message);
    }
    throw error;
  }
}
