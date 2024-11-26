import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';

import { AbstractDocument } from '../database/abstract.schema';

@Schema({ timestamps: true })
export class Post extends AbstractDocument {
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
