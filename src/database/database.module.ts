import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLevel } from "src/user/entities/user-level.entity";
import { UserRole } from "src/user/entities/user-role.entity";
import { User } from "src/user/entities/user.entity";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get("MONGODB_DB_NAME"),
        uri: configService.get("MONGODB_URI"),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("MYSQL_HOST"),
        port: configService.get("MYSQL_PORT"),
        username: configService.get("MYSQL_USERNAME"),
        password: configService.get("MYSQL_PASSWORD"),
        database: configService.get("MYSQL_DATABASE"),
        synchronize: true,
        entities: [User, UserRole, UserLevel],
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: any[], mysqlEntities: any[] = []) {
    return {
      imports: [
        MongooseModule.forFeature(models),
        TypeOrmModule.forFeature(mysqlEntities),
      ],
    };
  }
}
