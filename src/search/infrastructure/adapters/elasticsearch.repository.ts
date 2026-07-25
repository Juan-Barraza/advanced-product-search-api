import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Client, errors } from '@elastic/elasticsearch';
import { SearchRepository } from '../../domain/ports/search.repository';
import { Product } from '../../domain/entities/product.entity';
import {
  SearchQueryDto,
  SortBy,
} from '../../application/dtos/search-query.dto';

@Injectable()
export class ElasticsearchRepository
  implements SearchRepository, OnModuleDestroy
{
  private readonly esClient: Client;
  private readonly indexName = 'products';

  constructor() {
    this.esClient = new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    });
  }

  async search(query: string, filters: SearchQueryDto): Promise<Product[]> {
    try {
      const must: Record<string, unknown>[] = [];
      const filter: Record<string, unknown>[] = [];

      if (query) {
        must.push({
          multi_match: {
            query,
            fields: ['name^3', 'description'], // name weighs more than description
            fuzziness: 'AUTO',
          },
        });
      } else {
        must.push({ match_all: {} });
      }

      if (filters.category) {
        filter.push({ term: { category: filters.category } });
      }
      if (filters.subcategory) {
        filter.push({ term: { subcategory: filters.subcategory } });
      }
      if (filters.location) {
        filter.push({ term: { location: filters.location } });
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const priceRange: { gte?: number; lte?: number } = {};
        if (filters.minPrice !== undefined) priceRange.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) priceRange.lte = filters.maxPrice;
        filter.push({ range: { price: priceRange } });
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const from = (page - 1) * limit;

      const sort: any[] = [];
      if (filters.sortBy === SortBy.CREATED_AT) {
        sort.push({ createdAt: { order: 'desc' } });
      } else if (!query) {
        sort.push({ createdAt: { order: 'desc' } });
      }

      const response = await this.esClient.search<Product>({
        index: this.indexName,
        from,
        size: limit,
        sort,
        query: {
          bool: { must, filter },
        },
      });

      return response.hits.hits
        .map((hit) => hit._source)
        .filter((source): source is Product => source !== undefined);
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return [];
      }
      throw error;
    }
  }

  async autocomplete(prefix: string): Promise<string[]> {
    try {
      if (!prefix) return [];

      const response = await this.esClient.search<Product>({
        index: this.indexName,
        _source: ['name'],
        size: 5,
        query: {
          match_phrase_prefix: {
            name: {
              query: prefix,
            },
          },
        },
      });

      const suggestions = response.hits.hits
        .map((hit) => hit._source?.name)
        .filter((name): name is string => name !== undefined);

      return [...new Set(suggestions)];
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return [];
      }
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.esClient.close();
  }
}
