import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() body) {
    return this.postService.create(userId, body);
  }

  @Get(':id')
  getOne(@Param("id") id: string) {
    return this.postService.getOne(id);
  }

  @Get()
  getUserPosts(@CurrentUser() userId: string) {
    return this.postService.get({ userId });
  }

  @Get("all")
  getAllPosts() {
    return this.postService.get();
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.postService.delete(id);
  }
}
