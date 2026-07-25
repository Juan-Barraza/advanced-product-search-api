import { Test, TestingModule } from '@nestjs/testing';
import { SearchProductsUseCase } from './search-products.use-case';
import { SEARCH_REPOSITORY } from '../../domain/ports/search.repository';
import { CACHE_REPOSITORY } from '../../domain/ports/cache.repository';
import { SearchQueryDto } from '../dtos/search-query.dto';
import { Product } from '../../domain/entities/product.entity';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let mockSearchRepository: any;
  let mockCacheRepository: any;

  beforeEach(async () => {
    mockSearchRepository = {
      search: jest.fn(),
    };

    mockCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchProductsUseCase,
        { provide: SEARCH_REPOSITORY, useValue: mockSearchRepository },
        { provide: CACHE_REPOSITORY, useValue: mockCacheRepository },
      ],
    }).compile();

    useCase = module.get<SearchProductsUseCase>(SearchProductsUseCase);
  });

  it('debe estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debe retornar resultados de la caché si existen', async () => {
    const dto: SearchQueryDto = { q: 'laptop' };
    const cachedProducts: Product[] = [
      { id: '1', name: 'Laptop Gamer', price: 1000, category: 'Tecnología', createdAt: new Date().toISOString() },
    ];
    
    mockCacheRepository.get.mockResolvedValue(cachedProducts);

    const result = await useCase.execute(dto);

    expect(result).toEqual(cachedProducts);
    expect(mockSearchRepository.search).not.toHaveBeenCalled();
  });

  it('debe consultar a Elasticsearch y guardar en caché si está vacía', async () => {
    const dto: SearchQueryDto = { q: 'laptop' };
    const dbProducts: Product[] = [
      { id: '1', name: 'Laptop Gamer', price: 1000, category: 'Tecnología', createdAt: new Date().toISOString() },
    ];
    
    mockCacheRepository.get.mockResolvedValue(null);
    mockSearchRepository.search.mockResolvedValue(dbProducts);

    const result = await useCase.execute(dto);

    expect(result).toEqual(dbProducts);
    expect(mockSearchRepository.search).toHaveBeenCalledWith('laptop', dto);
    
    const expectedCacheKey = `search:${JSON.stringify(dto)}`;
    expect(mockCacheRepository.set).toHaveBeenCalledWith(expectedCacheKey, dbProducts, 60);
  });
});