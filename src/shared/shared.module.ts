import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';

const shareServices = [PrismaService];
@Global()
@Module({
  providers: shareServices,
  exports: shareServices,
})
export class SharedModule {}
