import { VideoModel } from '../models/video.model';

export const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL server! 🚀',
    health: () => ({
      status: 'ok',
      message: 'Server is running!',
      timestamp: new Date().toISOString(),
    }),
    getVideos: async () => {
      try {
        const videos = await VideoModel.find().sort({ createdAt: -1 });
        return videos;
      } catch (error) {
        throw new Error('Failed to fetch videos');
      }
    },
    getVideo: async (_: any, { id }: { id: string }) => {
      try {
        const video = await VideoModel.findById(id);
        if (!video) {
          throw new Error('Video not found');
        }
        return video;
      } catch (error) {
        throw new Error('Failed to fetch video');
      }
    },
  },
  Mutation: {
    addVideoLink: async (_: any, { url }: { url: string }, context: any) => {
      try {
        // Detect source type based on URL
        let sourceType = 'upload';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          sourceType = 'youtube';
        } else if (url.includes('teams.microsoft.com') || url.includes('sharepoint.com')) {
          sourceType = 'teams';
        }

        // Create new video entry
        const video = new VideoModel({
          userId: context.userId || 'guest',
          title: 'Untitled video',
          sourceType,
          url,
          processingStatus: 'pending',
        });

        const savedVideo = await video.save();
        return savedVideo;
      } catch (error) {
        throw new Error('Failed to save video link');
      }
    },
  },
};
