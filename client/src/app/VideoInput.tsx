"use client";
import React, { useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

interface Video {
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
}

// GraphQL mutations and queries
const ADD_VIDEO_LINK = gql`
  mutation AddVideoLink($url: String!) {
    addVideoLink(url: $url) {
      id
      userId
      title
      sourceType
      url
      duration
      description
      thumbnailUrl
      processingStatus
      createdAt
    }
  }
`;

const GET_VIDEOS = gql`
  query GetVideos {
    getVideos {
      id
      userId
      title
      sourceType
      url
      duration
      description
      thumbnailUrl
      processingStatus
      createdAt
    }
  }
`;

export const VideoInput = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const client = new GraphQLClient("http://localhost:4000/graphql");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result: { addVideoLink: Video } = await client.request(ADD_VIDEO_LINK, { url: url.trim() });

      if (result.addVideoLink) {
        setSuccessMessage(`Video link added successfully! Source: ${result.addVideoLink.sourceType}`);
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
      const result: { getVideos: Video[] } = await client.request(GET_VIDEOS);
      setVideos(result.getVideos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType) {
      case "youtube":
        return "bg-red-100 text-red-800";
      case "teams":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case "youtube":
        return "🎥";
      case "teams":
        return "💼";
      default:
        return "📁";
    }
  };

  // Fetch videos on component mount
  React.useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Video Lesson Converter</h1>
        <p className="text-gray-600 mb-6">
          Convert Microsoft Teams lessons and YouTube videos into digestible learning blocks with AI-powered
          summarization
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              id="video-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a video link (Teams or YouTube)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported: teams.microsoft.com, sharepoint.com, youtube.com, youtu.be
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Processing..." : "Add Video Link"}
          </button>
        </form>

        {error && <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Videos</h2>
          <button onClick={fetchVideos} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Refresh
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📹</div>
            <p>No videos added yet. Add your first video link above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getSourceTypeIcon(video.sourceType)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceTypeColor(video.sourceType)}`}
                      >
                        {video.sourceType.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video.processingStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : video.processingStatus === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {video.processingStatus.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-600 break-all mb-2">{video.url}</p>
                    <p className="text-xs text-gray-500">Added: {new Date(video.createdAt).toLocaleString()}</p>
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
