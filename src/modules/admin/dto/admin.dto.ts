import { IsEmail, IsNotEmpty, IsOptional, IsEnum, MinLength } from 'class-validator';
import { AdminRole } from '../entities/admin-user.entity';

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}

export class UpdateAdminDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
