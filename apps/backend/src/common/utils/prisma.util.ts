import { BadRequestException } from '@nestjs/common';

type PrismaKnownError = Error & { code: string };

const isPrismaKnownError = (error: Error): error is PrismaKnownError => {
  return 'code' in error && typeof error.code === 'string';
};

export async function handlePrismaNotFound<T>(promise: Promise<T>, message = 'Record not found'): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof Error && isPrismaKnownError(error) && error.code === 'P2025') {
      throw new BadRequestException(message);
    }
    throw error;
  }
}
