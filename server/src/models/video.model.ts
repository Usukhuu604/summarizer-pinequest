import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest',
  },
  title: {
    type: String,
    default: 'Untitled video',
  },
  sourceType: {
    type: String,
    enum: ['upload', 'teams', 'youtube'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Additional fields for future use
  description: String,
  thumbnailUrl: String,
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending',
  },
});

export const VideoModel = mongoose.model('Video', videoSchema);
