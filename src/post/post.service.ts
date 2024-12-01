import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Post } from './post.schema';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, post) {
    const createdPost = await this.postModel.create({ userId, ...post });

    const user = await this.userRepository.find({
      where: { user_id: Number(createdPost.userId) },
    });

    return {
      ...createdPost,
      user,
    }; 
  }

  async getOne(id: string) {
    const foundPost = await this.postModel.findById(id).lean();
    if (!foundPost) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepository.find({
      where: { user_id: Number(foundPost.userId) },
    });

    return {
      ...foundPost,
      user,
    };
  }

  async get(query: FilterQuery<Post> = {}) {
    const foundPosts = await this.postModel.find(query).lean();

    return {
      posts: await Promise.all(
        foundPosts.map(async (post) => {
          const user = await this.userRepository.find({
            where: { user_id: Number(post.userId) },
          });
  
          return {
            ...post,
            user,
          };
        }),
      ),
      count: foundPosts.length
    }
  }

  async delete(id: string) {
    return this.postModel.findOneAndDelete({ _id: id })
  }
}
