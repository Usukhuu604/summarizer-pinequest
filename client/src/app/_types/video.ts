export type VideoProps = {
  id: string;
  userId: string;
  title: string;
  sourceType: string;
  url: string;
  duration?: number | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  processingStatus: string;
  createdAt: string;
};
