import { Test, TestingModule } from '@nestjs/testing';
import { AutocompleteUseCase } from './autocomplete.use-case';
import { SEARCH_REPOSITORY } from '../../domain/ports/search.repository';
import { CACHE_REPOSITORY } from '../../domain/ports/cache.repository';

describe('AutocompleteUseCase', () => {
  let useCase: AutocompleteUseCase;
  let mockSearchRepository: any;
  let mockCacheRepository: any;

  beforeEach(async () => {
    mockSearchRepository = {
      autocomplete: jest.fn(),
    };

    mockCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutocompleteUseCase,
        { provide: SEARCH_REPOSITORY, useValue: mockSearchRepository },
        { provide: CACHE_REPOSITORY, useValue: mockCacheRepository },
      ],
    }).compile();

    useCase = module.get<AutocompleteUseCase>(AutocompleteUseCase);
  });

  it('debe estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debe retornar un array vacío si el prefijo está vacío', async () => {
    const result = await useCase.execute('   ');
    expect(result).toEqual([]);
    expect(mockCacheRepository.get).not.toHaveBeenCalled();
  });

  it('debe retornar datos de la caché si existen (Cache Hit)', async () => {
    const cachedData = ['Zapatos Deportivos'];
    mockCacheRepository.get.mockResolvedValue(cachedData);

    const result = await useCase.execute('zap');

    expect(result).toEqual(cachedData);
    expect(mockCacheRepository.get).toHaveBeenCalledWith('autocomplete:zap');
    expect(mockSearchRepository.autocomplete).not.toHaveBeenCalled();
  });

  it('debe buscar en Elasticsearch y guardar en caché si no hay datos (Cache Miss)', async () => {
    mockCacheRepository.get.mockResolvedValue(null);
    const dbData = ['Zapatos Formales'];
    mockSearchRepository.autocomplete.mockResolvedValue(dbData);

    const result = await useCase.execute('zap');

    expect(result).toEqual(dbData);
    expect(mockSearchRepository.autocomplete).toHaveBeenCalledWith('zap');
    expect(mockCacheRepository.set).toHaveBeenCalledWith('autocomplete:zap', dbData, 30);
  });
});