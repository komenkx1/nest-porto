import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isFutured: boolean;
}
