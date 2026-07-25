
export interface CacheRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}

export const CACHE_REPOSITORY = Symbol('CACHE_REPOSITORY');