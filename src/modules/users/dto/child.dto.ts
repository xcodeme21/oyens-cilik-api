import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../entities/child.entity';

export class CreateChildDto {
  @ApiProperty({ example: 'Andi', description: 'Nama lengkap anak' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Andi', description: 'Nama panggilan anak' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '2020-05-15', description: 'Tanggal lahir anak' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Jenis kelamin' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 'cat_avatar_1', description: 'Avatar anak' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateChildDto {
  @ApiPropertyOptional({ example: 'Andi Budi', description: 'Nama lengkap anak' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Andi', description: 'Nama panggilan anak' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '2020-05-15', description: 'Tanggal lahir anak' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Jenis kelamin' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 'cat_avatar_2', description: 'Avatar anak' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
