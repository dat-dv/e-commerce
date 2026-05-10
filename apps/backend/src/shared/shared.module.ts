import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { PaginationService } from './services/pagination/pagination.service';

const shareServices = [PrismaService, PaginationService];
@Global()
@Module({
  providers: shareServices,
  exports: shareServices,
})
export class SharedModule {}
