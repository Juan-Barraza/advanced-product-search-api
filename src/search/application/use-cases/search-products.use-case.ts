import { Injectable, Inject } from '@nestjs/common';
import { SearchQueryDto } from '../dtos/search-query.dto';
import {
  SEARCH_REPOSITORY,
  type SearchRepository,
} from '../../domain/ports/search.repository';
import {
  CACHE_REPOSITORY,
  type CacheRepository,
} from '../../domain/ports/cache.repository';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(SEARCH_REPOSITORY)
    private readonly searchRepository: SearchRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: CacheRepository,
  ) {}

  async execute(queryDto: SearchQueryDto) {
    const cacheKey = `search:${JSON.stringify(queryDto)}`;

    const cachedResult = await this.cacheRepository.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.searchRepository.search(
      queryDto.q || '',
      queryDto,
    );

    await this.cacheRepository.set(cacheKey, result, 60);

    return result;
  }
}
