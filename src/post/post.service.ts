import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Post } from './post.schema';
import { In, Repository } from 'typeorm';
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

  async get(query) {
    const foundPosts = await this.postModel.find().lean();

    const userIds = foundPosts.map((post) => Number(post.userId));
    let users = await this.userRepository.find({
      where: { user_id: In(userIds)},
      relations: ['user_role_id', 'user_level_id'],
    });

    if (query.userRole) {
      users = users.filter((user) => user.user_role_id.name === query.userRole);
    }
    if (query.userLevel) {
      users = users.filter((user) => user.user_level_id.name === query.userLevel);
    }

    const userMap = new Map(users.map((user) => [user.user_id, user]));
    const postsWithUser = foundPosts.map((post) => ({
      ...post,
      user: userMap.get(Number(post.userId)),
    }));
    const filteredPosts = postsWithUser.filter((post) => post.user);
  
    return {
      posts: filteredPosts,
      count: filteredPosts.length,
    };
  }  

  async delete(id: string) {
    return this.postModel.findOneAndDelete({ _id: id });
  }
}
