import { Module } from '@nestjs/common';
import { SearchController } from './infrastructure/http/search.controller';
import { SearchProductsUseCase } from './application/use-cases/search-products.use-case';
import { SEARCH_REPOSITORY } from './domain/ports/search.repository';
import { CACHE_REPOSITORY } from './domain/ports/cache.repository';
import { ElasticsearchRepository } from './infrastructure/adapters/elasticsearch.repository';
import { RedisRepository } from './infrastructure/adapters/redis.repository';
import { AutocompleteUseCase } from './application/use-cases/autocomplete.use-case';

@Module({
  controllers: [SearchController],
  providers: [
    SearchProductsUseCase,
    AutocompleteUseCase,
    {
      provide: SEARCH_REPOSITORY,
      useClass: ElasticsearchRepository,
    },
    {
      provide: CACHE_REPOSITORY,
      useClass: RedisRepository,
    },
  ],
})
export class SearchModule {}
