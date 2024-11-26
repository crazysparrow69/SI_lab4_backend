import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { UserLevel } from './entities/user-level.entity';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Award, AwardSchema } from './awards.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, UserLevel]),
    MongooseModule.forFeature([{ name: Award.name, schema: AwardSchema }]),
    JwtModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
