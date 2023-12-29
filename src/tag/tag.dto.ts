import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TagDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
