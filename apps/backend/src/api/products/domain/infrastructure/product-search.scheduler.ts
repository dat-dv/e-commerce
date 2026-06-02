import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductSearchService } from './product-search.service';

@Injectable()
export class ProductSearchScheduler {
  private readonly logger = new Logger(ProductSearchScheduler.name);
  private isRunning = false;

  constructor(private readonly productSearchService: ProductSearchService) {}

  @Cron('0 0 3 * * *', {
    name: 'products-search-nightly-reindex',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async reindexProductsAtNight(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Nightly product search reindex skipped because previous run is still running.');
      return;
    }

    this.isRunning = true;

    try {
      const result = await this.productSearchService.reindexProducts();
      this.logger.log(`Nightly product search reindex completed: ${result.index}, indexed ${result.indexed} products.`);
    } catch (error) {
      this.logger.error(`Nightly product search reindex failed: ${(error as Error).message}`);
    } finally {
      this.isRunning = false;
    }
  }
}
