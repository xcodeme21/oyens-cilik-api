import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Child } from '../users/entities/child.entity';
import { Progress } from '../progress/entities/progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Child, Progress]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
