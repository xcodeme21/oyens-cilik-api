import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap orang tua' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '08123456789', description: 'Nomor telepon' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Budi Santoso', description: 'Nama lengkap' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '08123456789', description: 'Nomor telepon' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL avatar' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
