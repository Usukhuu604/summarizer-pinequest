"use client";
import { useEffect, useState } from "react";
import { GraphQLClient } from "graphql-request";
import { VideoProps } from "@/app/_types/video";
import { ADD_VIDEO_LINK, GET_VIDEOS } from "@/graphql";
import { Button, Input, Badge } from "@/components/ui/index";

export const VideoInput = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const client = new GraphQLClient(process.env.GRAPHQL_URL || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result: { addVideoLink: VideoProps } = await client.request(
        ADD_VIDEO_LINK,
        { url: url.trim() }
      );

      if (result.addVideoLink) {
        setSuccessMessage(
          `Video link added successfully! Source: ${result.addVideoLink.sourceType}`
        );
        setUrl("");
        // Refresh the videos list
        await fetchVideos();
      }
    } catch (error) {
      console.error("Error adding video link:", error);
      setError("Failed to add video link. Please try again.");
    }
    setLoading(false);
  };

  const fetchVideos = async () => {
    try {
      const result: { getVideos: VideoProps[] } = await client.request(
        GET_VIDEOS
      );
      setVideos(result.getVideos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          AI Based Lesson Summarizer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a video link from YouTube, Microsoft Teams, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
          >
            {loading ? "Processing..." : "Add Video Link"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Videos</h2>
          <Button
            onClick={fetchVideos}
            className=" text-sm font-medium cursor-pointer"
          >
            Refresh
          </Button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📹</div>
            <p>No videos added yet. Add your first video link above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant={"default"}
                        className={"px-2 py-1 rounded-full text-xs font-medium"}
                      >
                        {video.sourceType.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={"secondary"}
                        className={`px-2 py-1 rounded-full text-xs font-medium `}
                      >
                        {video.processingStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 break-all mb-2">
                      {video.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(video.createdAt)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
