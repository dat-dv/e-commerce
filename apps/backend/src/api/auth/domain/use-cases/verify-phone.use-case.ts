import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import * as admin from 'firebase-admin';
import { VerifyPhoneDto } from '../../dto/verify-phone.dto';

@Injectable()
export class VerifyPhoneUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string, dto: VerifyPhoneDto) {
    try {
      // Verify token with Firebase
      const decodedToken = await admin.auth().verifyIdToken(dto.token);
      const verifiedPhoneNumber = decodedToken.phone_number;

      if (!verifiedPhoneNumber) {
        throw new BadRequestException('Token does not contain a phone number');
      }

      // Validate that the provided phone and phone_code match the verified number
      const providedPhoneNumber = `${dto.phone_code}${dto.phone}`;

      const cleanProvided = providedPhoneNumber.replace(/\D/g, '');
      const cleanVerified = verifiedPhoneNumber.replace(/\D/g, '');

      if (cleanProvided !== cleanVerified) {
        throw new BadRequestException('Provided phone number does not match the verified token');
      }

      // Find user
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Add phone record
      await this.usersRepository.addUserPhone(userId, {
        phone: dto.phone,
        phone_code: dto.phone_code,
        is_verified: true,
        is_default: true,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired Firebase token');
    }
  }
}
