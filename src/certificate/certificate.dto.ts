import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CertificateDto {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  thumbnail: string;
}
