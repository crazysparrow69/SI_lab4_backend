import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './entities/user-role.entity';
import { UserLevel } from './entities/user-level.entity';
import { Award } from './awards.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserLevel)
    private readonly userLevelRepository: Repository<UserLevel>,
    @InjectModel(Award.name) private awardModel: Model<Award>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }
    
    const foundUser = await this.userRepository.findOne({
      where: { email, password },
    });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const token = await this.jwtService.signAsync(
      {
        sub: foundUser.user_id,
      },
      { secret: this.configService.get('ACCESS_TOKEN_SECRET') },
    );

    return { token };
  }

  async signup(user: any) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const createdUser = await this.userRepository.save(user);

    const token = await this.jwtService.signAsync(
      {
        sub: createdUser.user_id,
      },
      { secret: this.configService.get('ACCESS_TOKEN_SECRET') },
    );

    return { token };
  }

  async getOne(user_id: number) {
    const foundUser = await this.userRepository.findOne({ where: { user_id } });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async update(user_id: number, data: Partial<User>) {
    const userToUpdate = await this.userRepository.preload({ user_id, ...data });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(userToUpdate);
  }

  createRole(role) {
    return this.userRoleRepository.save(role);
  }

  createLevel(level) {
    return this.userLevelRepository.save(level);
  }

  createAward(award) {
    return this.awardModel.create(award);
  }

  getAwardsForUser(userId) {
    return this.awardModel.find({ userId });
  }

  getRoles() {
    return this.userRoleRepository.find();
  }

  getLevels() {
    return this.userLevelRepository.find();
  }
}
