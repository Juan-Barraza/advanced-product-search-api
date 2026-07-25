import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortBy {
  RELEVANCE = 'relevance',
  POPULARITY = 'popularity',
  CREATED_AT = 'created_at',
}

export class SearchQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda de texto libre',
    example: 'zapatos',
  })
  @IsOptional()
  @IsString()
  q?: string; // principal way to search

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Calzado',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Subcategoría del producto',
    example: 'Deporte',
  })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiPropertyOptional({
    description: 'Ubicación geográfica',
    example: 'Bogotá',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Precio mínimo', example: 50 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Precio máximo', example: 200 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Criterio de ordenamiento',
    enum: SortBy,
    default: SortBy.RELEVANCE,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RELEVANCE;

  @ApiPropertyOptional({
    description: 'Número de página para la paginación',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
