import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { ActivityHistory } from './entities/activity-history.entity';
import { Child } from '../users/entities/child.entity';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress, ActivityHistory, Child]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProgressController, ProfileController],
  providers: [ProgressService, ProfileService],
  exports: [ProgressService, ProfileService],
})
export class ProgressModule {}
