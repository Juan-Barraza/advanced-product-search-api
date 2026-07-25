import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortBy {
  RELEVANCE = 'relevance',
  POPULARITY = 'popularity',
  CREATED_AT = 'created_at',
}

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string; // principal way to search

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.RELEVANCE;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
