import { BadRequestException } from '@nestjs/common';

/**
 * Wraps a Prisma promise and throws a BadRequestException if the record is not found (P2025).
 *
 * @template T - The type of the expected result.
 * @param promise - The Prisma operation promise to wrap.
 * @param message - The message for the error (default: 'Record not found').
 * @returns The resolved value of the promise.
 * @throws {BadRequestException} If Prisma throws error P2025 (Record not found).
 */
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
