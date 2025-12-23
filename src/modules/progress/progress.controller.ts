import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { RecordProgressDto } from './dto/progress.dto';
import { ContentType } from './entities/progress.entity';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':childId')
  @ApiOperation({ summary: 'Record learning progress for a child' })
  @ApiResponse({ status: 201, description: 'Progress recorded' })
  async recordProgress(
    @Param('childId') childId: string,
    @Body() recordProgressDto: RecordProgressDto,
  ) {
    return this.progressService.recordProgress(childId, recordProgressDto);
  }

  @Get(':childId')
  @ApiOperation({ summary: 'Get all progress for a child' })
  @ApiResponse({ status: 200, description: 'Progress list' })
  async getProgress(@Param('childId') childId: string) {
    return this.progressService.getProgressByChild(childId);
  }

  @Get(':childId/summary')
  @ApiOperation({ summary: 'Get progress summary for a child' })
  @ApiResponse({ status: 200, description: 'Progress summary' })
  async getProgressSummary(@Param('childId') childId: string) {
    return this.progressService.getProgressSummary(childId);
  }

  @Get(':childId/content/:contentType')
  @ApiOperation({ summary: 'Get progress for specific content type' })
  @ApiResponse({ status: 200, description: 'Content progress' })
  async getContentProgress(
    @Param('childId') childId: string,
    @Param('contentType') contentType: ContentType,
  ) {
    return this.progressService.getContentProgress(childId, contentType);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get learning leaderboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Leaderboard' })
  async getLeaderboard(@Query('limit') limit?: number) {
    return this.progressService.getLeaderboard(limit || 10);
  }
}
