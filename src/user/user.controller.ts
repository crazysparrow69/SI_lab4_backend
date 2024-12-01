import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post("signup")
  signup(@Body() body) {
    return this.userService.signup(body);
  }

  @Post("signin")
  signin(@Body() body) {
    return this.userService.signin(body.email, body.password);
  }

  @Get("roles")
  getRoles() {
    return this.userService.getRoles();
  }

  @Get("levels")
  getLevels() {
    return this.userService.getLevels();
  }

  @Post("roles")
  createRole(@Body() body) {
    return this.userService.createRole(body);
  }

  @Post("levels")
  createLevel(@Body() body) {
    return this.userService.createLevel(body);
  }

  @Post("awards")
  createAward(@Body() body) {
    return this.userService.createAward(body);
  }

  @UseGuards(AuthGuard)
  @Get("awards")
  getAwards(@CurrentUser() userId: string) {
    return this.userService.getAwardsForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUser(@CurrentUser() userId: string) {
    return this.userService.getOne(Number(userId));
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateUser(@CurrentUser() userId: string, @Body() body) {
    return this.userService.update(Number(userId), body);
  }
}
