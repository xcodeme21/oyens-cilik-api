import { Controller, Get, Param, ParseIntPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ==================== LETTERS ====================

  @Get('letters')
  @ApiOperation({ summary: 'Get all letters A-Z' })
  @ApiResponse({ status: 200, description: 'List of all letters' })
  async getAllLetters() {
    return this.contentService.getAllLetters();
  }

  @Get('reseed-letters')
  @ApiOperation({ summary: 'Reseed letters (DEV ONLY)' })
  async reseedLetters() {
    return this.contentService.reseedLetters();
  }

  @Get('reseed-animals')
  @ApiOperation({ summary: 'Reseed animals (DEV ONLY)' })
  async reseedAnimals() {
    return this.contentService.reseedAnimals();
  }

  @Get('letters/:id')
  @ApiOperation({ summary: 'Get a specific letter by ID' })
  @ApiResponse({ status: 200, description: 'Letter details' })
  async getLetterById(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.getLetterById(id);
  }

  @Get('letters/order/:order')
  @ApiOperation({ summary: 'Get a letter by order (1-26)' })
  @ApiResponse({ status: 200, description: 'Letter details' })
  async getLetterByOrder(@Param('order', ParseIntPipe) order: number) {
    return this.contentService.getLetterByOrder(order);
  }

  @Get('letters/char/:letter')
  @ApiOperation({ summary: 'Get a letter by character' })
  @ApiResponse({ status: 200, description: 'Letter details' })
  async getLetterByChar(@Param('letter') letter: string) {
    return this.contentService.getLetterByChar(letter);
  }

  // ==================== NUMBERS ====================

  @Get('numbers')
  @ApiOperation({ summary: 'Get all numbers 0-20' })
  @ApiResponse({ status: 200, description: 'List of all numbers' })
  async getAllNumbers() {
    return this.contentService.getAllNumbers();
  }

  @Get('numbers/:id')
  @ApiOperation({ summary: 'Get a specific number by ID' })
  @ApiResponse({ status: 200, description: 'Number details' })
  async getNumberById(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.getNumberById(id);
  }

  @Get('numbers/order/:order')
  @ApiOperation({ summary: 'Get a number by order (1-21)' })
  @ApiResponse({ status: 200, description: 'Number details' })
  async getNumberByOrder(@Param('order', ParseIntPipe) order: number) {
    return this.contentService.getNumberByOrder(order);
  }

  @Get('numbers/value/:value')
  @ApiOperation({ summary: 'Get a number by its value' })
  @ApiResponse({ status: 200, description: 'Number details' })
  async getNumberByValue(@Param('value', ParseIntPipe) value: number) {
    return this.contentService.getNumberByValue(value);
  }

  // ==================== ANIMALS ====================

  @Get('animals')
  @ApiOperation({ summary: 'Get all animals' })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['easy', 'medium', 'hard'] })
  @ApiResponse({ status: 200, description: 'List of all animals' })
  async getAllAnimals(@Query('difficulty') difficulty?: string) {
    if (difficulty) {
      return this.contentService.getAnimalsByDifficulty(difficulty);
    }
    return this.contentService.getAllAnimals();
  }

  @Get('animals/quiz')
  @ApiOperation({ summary: 'Get random animals for quiz' })
  @ApiQuery({ name: 'count', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Random animals for quiz' })
  async getAnimalQuiz(@Query('count') count?: number) {
    return this.contentService.getRandomAnimalQuiz(count || 5);
  }

  @Get('animals/:id')
  @ApiOperation({ summary: 'Get a specific animal by ID' })
  @ApiResponse({ status: 200, description: 'Animal details' })
  async getAnimalById(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.getAnimalById(id);
  }

  @Get('animals/order/:order')
  @ApiOperation({ summary: 'Get an animal by order (1-15)' })
  @ApiResponse({ status: 200, description: 'Animal details' })
  async getAnimalByOrder(@Param('order', ParseIntPipe) order: number) {
    return this.contentService.getAnimalByOrder(order);
  }

  @Get('animals/image/:filename')
  @ApiOperation({ summary: 'Get animal image file' })
  @ApiResponse({ status: 200, description: 'Animal image file' })
  async getAnimalImage(@Param('filename') filename: string, @Res() res: Response) {
    const fs = require('fs');
    const path = require('path');
    
    // Security: only allow safe filenames
    const safeFilename = path.basename(filename);
    const imagePath = path.join(process.cwd(), 'public', 'uploads', 'animals', safeFilename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found',
        error: 'Not Found',
        statusCode: 404 
      });
    }
    
    res.sendFile(imagePath);
  }
}
