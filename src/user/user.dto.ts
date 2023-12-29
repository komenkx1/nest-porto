import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
} from '@nestjs/class-validator';
import { IsBoolean } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}