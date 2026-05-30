import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EnvVars } from 'src/config/config.validation';
import { ICacheService } from './cache.interface';

/**
 * Dịch vụ cache có tính chịu lỗi cao sử dụng Redis.
 * Tự động bỏ qua các thao tác và ghi nhận lỗi khi Redis mất kết nối mà không gây crash ứng dụng.
 */
@Injectable()
export class ResilientCacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ResilientCacheService.name);
  private redisClient: Redis | null = null;
  private isRedisHealthy = false;

  constructor(private readonly configService: ConfigService<EnvVars>) {}

  /**
   * Khởi tạo kết nối Redis và lắng nghe các sự kiện trạng thái.
   */
  onModuleInit(): void {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = Number(this.configService.get<number>('REDIS_PORT'));
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.logger.log(`Connecting to Redis at ${host}:${port}...`);

    this.redisClient = new Redis({
      host,
      port,
      password: password || undefined,
      // Tắt offline queue để các lệnh truy vấn thất bại và bỏ qua ngay lập tức khi Redis sập
      enableOfflineQueue: false,
      // Khống chế số lần thử kết nối để tránh nghẽn thread chính
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        // Sử dụng chiến lược linear backoff để giãn cách các lần thử kết nối lại tối đa 5 giây
        const delay = Math.min(times * 1000, 5000);
        this.logger.warn(`Redis connection failed. Reconnecting (attempt ${times}) in ${delay}ms...`);
        return delay;
      },
    });

    // Lắng nghe sự kiện để xác định trạng thái sẵn sàng của Redis
    this.redisClient.on('connect', () => {
      this.isRedisHealthy = true;
      this.logger.log('Successfully connected to Redis.');
    });

    this.redisClient.on('error', (err) => {
      this.isRedisHealthy = false;
      // Bắt lỗi kết nối để ghi log cảnh báo thay vì quăng exception gây sập ứng dụng
      this.logger.error(`Redis client error: ${err.message}`);
    });

    this.redisClient.on('close', () => {
      this.isRedisHealthy = false;
      this.logger.warn('Redis connection closed.');
    });
  }

  /**
   * Đóng kết nối Redis an toàn khi tắt module.
   */
  async onModuleDestroy(): Promise<void> {
    if (this.redisClient) {
      this.logger.log('Disconnecting from Redis...');
      await this.redisClient.quit();
    }
  }

  /**
   * Lấy giá trị từ Redis. Trả về null nếu Redis offline hoặc có lỗi.
   */
  async get(key: string): Promise<string | null> {
    if (!this.isRedisHealthy || !this.redisClient) {
      this.logger.debug(`Redis is offline. Returning null for key "${key}".`);
      return null;
    }

    try {
      return await this.redisClient.get(key);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis GET failed for key "${key}". Returning null: ${message}`);
      return null;
    }
  }

  /**
   * Ghi giá trị vào Redis. Bỏ qua nếu Redis offline hoặc có lỗi.
   */
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!this.isRedisHealthy || !this.redisClient) {
      this.logger.debug(`Redis is offline. Skipping SET for key "${key}".`);
      return;
    }

    try {
      await this.redisClient.set(key, value, 'EX', ttlSeconds);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis SET failed for key "${key}": ${message}`);
    }
  }

  /**
   * Xóa key trong Redis. Bỏ qua nếu Redis offline hoặc có lỗi.
   */
  async delete(key: string): Promise<void> {
    if (!this.isRedisHealthy || !this.redisClient) {
      this.logger.debug(`Redis is offline. Skipping DEL for key "${key}".`);
      return;
    }

    try {
      await this.redisClient.del(key);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis DEL failed for key "${key}": ${message}`);
    }
  }

  /**
   * Xóa nhiều key theo pattern bằng SCAN để tránh block Redis khi số lượng key lớn.
   */
  async deleteByPattern(pattern: string): Promise<void> {
    if (!this.isRedisHealthy || !this.redisClient) {
      this.logger.debug(`Redis is offline. Skipping DEL for pattern "${pattern}".`);
      return;
    }

    try {
      let cursor = '0';

      do {
        const [nextCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis DEL pattern failed for pattern "${pattern}": ${message}`);
    }
  }
}
