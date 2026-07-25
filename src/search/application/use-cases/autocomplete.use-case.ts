import { Injectable, Inject } from '@nestjs/common';
import {
  SEARCH_REPOSITORY,
  type SearchRepository,
} from '../../domain/ports/search.repository';
import {
  CACHE_REPOSITORY,
  type CacheRepository,
} from '../../domain/ports/cache.repository';

@Injectable()
export class AutocompleteUseCase {
  constructor(
    @Inject(SEARCH_REPOSITORY)
    private readonly searchRepository: SearchRepository,
    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: CacheRepository,
  ) {}

  async execute(prefix: string): Promise<string[]> {
    if (!prefix || prefix.trim() === '') {
      return [];
    }

    const cleanPrefix = prefix.toLowerCase().trim();
    const cacheKey = `autocomplete:${cleanPrefix}`;

    const cachedResult = await this.cacheRepository.get<string[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const suggestions = await this.searchRepository.autocomplete(cleanPrefix);

    await this.cacheRepository.set(cacheKey, suggestions, 30);

    return suggestions;
  }
}
