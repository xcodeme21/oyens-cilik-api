import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, AuthProvider } from './entities/user.entity';
import { Child } from './entities/child.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  // ==================== USER METHODS ====================

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['children'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const hashedToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.userRepository.update(id, { refreshToken: hashedToken });
  }

  async findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: profile.email },
      });

      if (user) {
        // Link existing account with Google
        user.googleId = profile.googleId;
        user.authProvider = AuthProvider.GOOGLE;
        if (profile.avatarUrl && !user.avatarUrl) {
          user.avatarUrl = profile.avatarUrl;
        }
        return this.userRepository.save(user);
      }

      // Create new Google user
      user = this.userRepository.create({
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        authProvider: AuthProvider.GOOGLE,
      });
      return this.userRepository.save(user);
    }

    return user;
  }

  // ==================== CHILD METHODS ====================

  async createChild(parentId: string, createChildDto: CreateChildDto): Promise<Child> {
    const parent = await this.findById(parentId);
    
    const child = this.childRepository.create({
      ...createChildDto,
      parent,
      parentId,
    });

    return this.childRepository.save(child);
  }

  async findChildrenByParent(parentId: string): Promise<Child[]> {
    return this.childRepository.find({
      where: { parentId },
      order: { createdAt: 'ASC' },
    });
  }

  async findChildById(childId: string, parentId: string): Promise<Child> {
    const child = await this.childRepository.findOne({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new NotFoundException('Anak tidak ditemukan');
    }

    return child;
  }

  async updateChild(
    childId: string,
    parentId: string,
    updateChildDto: UpdateChildDto,
  ): Promise<Child> {
    const child = await this.findChildById(childId, parentId);
    Object.assign(child, updateChildDto);
    return this.childRepository.save(child);
  }

  async deleteChild(childId: string, parentId: string): Promise<void> {
    const child = await this.findChildById(childId, parentId);
    await this.childRepository.remove(child);
  }

  async addStarsToChild(childId: string, stars: number): Promise<Child> {
    const child = await this.childRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Anak tidak ditemukan');
    }
    
    child.totalStars += stars;
    
    // Update level based on stars (every 100 stars = 1 level)
    child.level = Math.floor(child.totalStars / 100) + 1;
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (child.lastActiveDate) {
      const lastActive = new Date(child.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        child.streak += 1;
      } else if (diffDays > 1) {
        child.streak = 1;
      }
    } else {
      child.streak = 1;
    }
    
    child.lastActiveDate = today;
    
    return this.childRepository.save(child);
  }
}
