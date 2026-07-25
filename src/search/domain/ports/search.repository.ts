import { Product } from '../entities/product.entity';

export interface SearchRepository {
  search(query: string, filters: any): Promise<Product[]>;
  autocomplete(prefix: string): Promise<string[]>;
}

export const SEARCH_REPOSITORY = Symbol('SEARCH_REPOSITORY');
