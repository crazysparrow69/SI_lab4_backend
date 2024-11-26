import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user-role.entity';
import { UserLevel } from 'src/user/entities/user-level.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TypeOrmModule.forFeature([User, UserRole, UserLevel]),
    JwtModule
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
