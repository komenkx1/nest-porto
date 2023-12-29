import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
} from '@nestjs/class-validator';

export class UserDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
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
}
