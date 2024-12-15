import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { Background } from "./entities/background.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Background]),
    UserModule,
    JwtModule
  ],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
