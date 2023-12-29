import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class JargonDto {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
  @IsNotEmpty()
  @IsString()
  primary_text: string;
  @IsNotEmpty()
  @IsString()
  secondary_text: string;
}
