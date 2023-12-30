import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PortofolioTagDto {
  @IsOptional()
  @IsNumber()
  portofolio_id: number;

  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}
