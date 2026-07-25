import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SearchProductsUseCase } from '../../application/use-cases/search-products.use-case';
import { SearchQueryDto } from '../../application/dtos/search-query.dto';
import { AutocompleteUseCase } from '../../application/use-cases/autocomplete.use-case';

@Controller('api/v1/search')
export class SearchController {
  constructor(
    private readonly searchProductUseCase: SearchProductsUseCase,
    private readonly autocompleteUseCase: AutocompleteUseCase,
  ) {}

  @Get('suggestions')
  async autocomplete(@Query('q') query: string) {
    return this.autocompleteUseCase.execute(query || '');
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async search(@Query() queryDto: SearchQueryDto) {
    return this.searchProductUseCase.execute(queryDto);
  }
}
