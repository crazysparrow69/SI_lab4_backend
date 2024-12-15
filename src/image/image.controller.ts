import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ImageService } from "./image.service";
import { CurrentUser } from "src/user/decorators/current-user.decorator";
import { AuthGuard } from "src/user/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("image")
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post("/avatar")
  @UseInterceptors(FileInterceptor("image"))
  async createAvatar(@CurrentUser() userId: string, @UploadedFile() file: any) {
    return this.imageService.uploadAvatar(Number(userId), file);
  }

  @Post("/background")
  @UseInterceptors(FileInterceptor("image"))
  async createBackground(@CurrentUser() userId: string, @UploadedFile() file: any) {
    return this.imageService.uploadBackground(Number(userId), file);
  }
}
