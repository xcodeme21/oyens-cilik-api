import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap orang tua' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiPropertyOptional({ example: '08123456789', description: 'Nomor telepon' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'budi@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token' })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 'uuid',
      name: 'Budi Santoso',
      email: 'budi@example.com',
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
      avatarUrl?: string;
  };
}
