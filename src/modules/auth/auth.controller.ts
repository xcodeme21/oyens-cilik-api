import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (parent)' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async refreshTokens(
    @Request() req: any,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(req.user.id, refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'Berhasil logout' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: any) {
    const user = await this.authService.validateUser(req.user.id);
    if (!user) {
      return { message: 'User not found' };
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  // Google OAuth endpoints (for web)
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: any, @Res() res: Response) {
    const authResponse = await this.authService.googleLogin(req.user);
    
    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${authResponse.accessToken}&refreshToken=${authResponse.refreshToken}`;
    
    return res.redirect(redirectUrl);
  }

  // Google OAuth for mobile (using ID token)
  @Post('google/mobile')
  @ApiOperation({ summary: 'Google OAuth for mobile app' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  async googleMobileAuth(@Body() body: { idToken: string }) {
    // In production, verify the ID token with Google
    // For development, we'll accept a mock profile
    const mockProfile = {
      googleId: 'mock-google-id-' + Date.now(),
      email: 'googleuser@example.com',
      name: 'Google User',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    };

    return this.authService.googleLogin(mockProfile);
  }
}
