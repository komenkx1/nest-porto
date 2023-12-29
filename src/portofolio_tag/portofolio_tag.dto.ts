import { IsNotEmpty, IsNumber } from 'class-validator';

export class PortofolioTagDto {
  @IsNotEmpty()
  @IsNumber()
  portofolio_id: number;

  @IsNotEmpty()
  @IsNumber()
  tag_id: number;
}
