import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AdminUser } from './entities/admin-user.entity';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';
import { User } from '../users/entities/user.entity';
import { Child } from '../users/entities/child.entity';
import { Progress } from '../progress/entities/progress.entity';
import { Letter } from '../content/entities/letter.entity';
import { NumberEntity } from '../content/entities/number.entity';
import { Animal } from '../content/entities/animal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminUser,
      User,
      Child,
      Progress,
      Letter,
      NumberEntity,
      Animal,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'oyens-cilik-secret',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController, StatsController],
  providers: [AdminService, StatsService, AdminJwtAuthGuard],
  exports: [AdminService],
})
export class AdminModule {}
