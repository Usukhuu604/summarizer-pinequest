import { gql } from "graphql-request";
// GraphQL mutations and queries
export const ADD_VIDEO_LINK = gql`
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

export const GET_VIDEOS = gql`
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
