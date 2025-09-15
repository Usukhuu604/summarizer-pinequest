import { Schema, model, Model, models } from 'mongoose';

export enum VideoSourceTypeEnum {
  TEAMS = 'teams',
  YOUTUBE = 'youtube',
}

export enum VideoProcessingStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

type VideoSchemaType = {
  userId: string;
  title: string;
  sourceType: VideoSourceTypeEnum;
  url: string;
  duration: number | null;
  createdAt: Date;
  description?: string;
  thumbnailUrl?: string;
  processingStatus: VideoProcessingStatusEnum;
};

const VideoSchema = new Schema<VideoSchemaType>(
  {
    userId: { type: String, default: 'guest', trim: true },
    title: { type: String, default: 'Untitled video', trim: true },
    sourceType: {
      type: String,
      enum: Object.values(VideoSourceTypeEnum),
      required: true,
    },
    url: { type: String, required: true, trim: true },
    duration: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
    description: { type: String, default: '', trim: true },
    thumbnailUrl: { type: String, default: '', trim: true },
    processingStatus: {
      type: String,
      enum: Object.values(VideoProcessingStatusEnum),
      default: VideoProcessingStatusEnum.PENDING,
    },
  },
  { timestamps: true },
);

export const VideoModel: Model<VideoSchemaType> = models['Video'] || model('Video', VideoSchema);
