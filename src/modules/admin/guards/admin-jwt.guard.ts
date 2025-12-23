import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtService.verify(token);
      
      // Check if this is an admin token
      if (payload.type !== 'admin') {
        throw new UnauthorizedException('Akses ditolak - bukan admin');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
