import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchProductsUseCase } from '../../application/use-cases/search-products.use-case';
import { SearchQueryDto } from '../../application/dtos/search-query.dto';
import { AutocompleteUseCase } from '../../application/use-cases/autocomplete.use-case';

@ApiTags('Search')
@Controller('api/v1/search')
export class SearchController {
  constructor(
    private readonly searchProductUseCase: SearchProductsUseCase,
    private readonly autocompleteUseCase: AutocompleteUseCase,
  ) {}

  @Get('suggestions')
  @ApiOperation({
    summary: 'Obtener sugerencias de autocompletado (Typeahead)',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Prefijo ingresado por el usuario',
    example: 'zap',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sugerencias de nombres de productos.',
    type: [String],
  })
  async autocomplete(@Query('q') query: string) {
    return this.autocompleteUseCase.execute(query || '');
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Buscar productos con filtros avanzados, paginación y caché',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos que coinciden con la búsqueda.',
  })
  async search(@Query() queryDto: SearchQueryDto) {
    return this.searchProductUseCase.execute(queryDto);
  }
}
