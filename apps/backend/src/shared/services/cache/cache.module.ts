import { Module, Global } from '@nestjs/common';
import { ICacheService } from './cache.interface';
import { ResilientCacheService } from './resilient-cache.service';

/**
 * Module Cache toàn cục, đăng ký ICacheService sử dụng bộ triển khai ResilientCacheService chịu lỗi tốt.
 */
@Global()
@Module({
  providers: [
    {
      provide: ICacheService,
      useClass: ResilientCacheService,
    },
  ],
  exports: [ICacheService],
})
export class CacheModule {}
