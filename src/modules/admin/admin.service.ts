import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUser, AdminRole } from './entities/admin-user.entity';
import { CreateAdminDto, UpdateAdminDto, AdminLoginDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AdminLoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role, type: 'admin' };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    };
  }

  async validateAdmin(id: string): Promise<AdminUser | null> {
    return this.adminRepository.findOne({ where: { id, isActive: true } });
  }

  async getMe(adminId: string) {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');
    
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }

  async findAll() {
    const admins = await this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });
    return admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    }));
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }

  async create(createDto: CreateAdminDto) {
    const existing = await this.adminRepository.findOne({
      where: { email: createDto.email },
    });
    if (existing) {
      throw new ConflictException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const admin = this.adminRepository.create({
      ...createDto,
      password: hashedPassword,
      role: createDto.role || AdminRole.ADMIN,
    });

    await this.adminRepository.save(admin);
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }

  async update(id: string, updateDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (updateDto.email && updateDto.email !== admin.email) {
      const existing = await this.adminRepository.findOne({
        where: { email: updateDto.email },
      });
      if (existing) throw new ConflictException('Email sudah digunakan');
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    Object.assign(admin, updateDto);
    await this.adminRepository.save(admin);

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }

  async remove(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    await this.adminRepository.remove(admin);
    return { message: 'Admin deleted successfully' };
  }
}
