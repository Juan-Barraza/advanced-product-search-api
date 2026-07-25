import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchProductsUseCase } from '../../application/use-cases/search-products.use-case';
import { AutocompleteUseCase } from '../../application/use-cases/autocomplete.use-case';
import { SearchQueryDto } from '../../application/dtos/search-query.dto';

describe('SearchController', () => {
  let controller: SearchController;
  let mockSearchProductsUseCase: any;
  let mockAutocompleteUseCase: any;

  beforeEach(async () => {
    mockSearchProductsUseCase = { execute: jest.fn() };
    mockAutocompleteUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchProductsUseCase,
          useValue: mockSearchProductsUseCase,
        },
        {
          provide: AutocompleteUseCase,
          useValue: mockAutocompleteUseCase,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('debe delegar la ejecución al SearchProductsUseCase y devolver el resultado', async () => {
      const dto: SearchQueryDto = { q: 'zapatos' };
      const expectedResult = [{ id: '1', name: 'Zapatos' }];
      
      mockSearchProductsUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.search(dto);

      expect(result).toEqual(expectedResult);
      expect(mockSearchProductsUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('autocomplete', () => {
    it('debe delegar la ejecución al AutocompleteUseCase y devolver sugerencias', async () => {
      const expectedResult = ['Zapatos Deportivos', 'Zapatos Formales'];
      mockAutocompleteUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.autocomplete('zap');

      expect(result).toEqual(expectedResult);
      expect(mockAutocompleteUseCase.execute).toHaveBeenCalledWith('zap');
    });

    it('debe pasar un string vacío al caso de uso si no se envía el parámetro q', async () => {
      await controller.autocomplete(undefined as any);
      expect(mockAutocompleteUseCase.execute).toHaveBeenCalledWith('');
    });
  });
});
