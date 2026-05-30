/**
 * Interface cho Cache Service, giúp trừu hóa các phương thức lưu trữ cache.
 */
export interface ICacheService {
  /**
   * Lấy giá trị cache theo key.
   */
  get(key: string): Promise<string | null>;

  /**
   * Lưu giá trị cache kèm TTL (giây).
   */
  set(key: string, value: string, ttlSeconds: number): Promise<void>;

  /**
   * Xóa giá trị cache theo key.
   */
  delete(key: string): Promise<void>;
}

export const ICacheService = Symbol('ICacheService');
