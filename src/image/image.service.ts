import * as fs from 'fs';
import * as path from 'path';
import * as cloudinary from 'cloudinary';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Background } from './entities/background.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
    private readonly configService: ConfigService,
  ) {
    cloudinary.v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAvatar(
    user_id: number,
    file: any,
  ): Promise<{ url: string; public_id: string }> {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid file mimetype');
    }

    const filename = `${Date.now()}-avatar`;
    const destinationPath = path.join(
      __dirname,
      '..',
      '..',
      '/uploads',
      filename,
    );

    const foundUser = await this.userRepository.findOne({ where: { user_id } });
    const publicId = foundUser.avatar_public_id;

    if (publicId) {
      this.deleteAvatar(publicId);
    }

    try {
      this.saveFileLocal(file.buffer, destinationPath);

      const result = await cloudinary.v2.uploader.upload(destinationPath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      this.deleteFileLocal(destinationPath);

      Object.assign(foundUser, {
        avatar_url: result.secure_url,
        avatar_public_id: result.public_id,
      });

      await this.userRepository.save(foundUser);

      return { url: result.secure_url, public_id: result.public_id };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadBackground(user_id: number, file: any): Promise<Background> {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid file mimetype');
    }

    const user = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const background = await this.backgroundRepository.findOne({
      where: { background_id: user.background_id as unknown as number },
    });

    const newBackground = this.backgroundRepository.create({
      data: file.buffer,
      user_id: user.user_id,
    });

    const savedBackground = await this.backgroundRepository.save(newBackground);

    user.background_id = savedBackground.background_id as unknown as Background;
    console.log(user);
    await this.userRepository.save(user);

    if (background) {
      await this.backgroundRepository.remove(background);
    }

    return newBackground;
  }

  deleteAvatar(publicId: string): Promise<void> {
    return cloudinary.v2.uploader.destroy(publicId);
  }

  saveFileLocal(fileData: any, filePath: string): string {
    fs.writeFileSync(filePath, fileData);
    return filePath;
  }

  deleteFileLocal(filePath: string): void {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
