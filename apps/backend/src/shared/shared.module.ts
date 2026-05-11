import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { PaginationService } from './services/pagination/pagination.service';
import { TokenService } from './services/token/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

const shareServices = [PrismaService, PaginationService, TokenService];
@Global()
@Module({
  imports: [JwtModule],
  providers: shareServices,
  exports: shareServices,
})
export class SharedModule {}
