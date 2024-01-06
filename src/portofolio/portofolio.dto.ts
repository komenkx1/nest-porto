import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PortofolioDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  category_id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  thumbnail: string;

  @IsOptional()
  portofolioTag: any;
}
