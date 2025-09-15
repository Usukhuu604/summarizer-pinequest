import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String!
    health: HealthStatus!
    getVideos: [Video!]!
    getVideo(id: ID!): Video
  }

  type Mutation {
    addVideoLink(url: String!): Video!
  }

  type Video {
    id: ID!
    userId: String!
    title: String!
    sourceType: String!
    url: String!
    duration: Int
    description: String
    thumbnailUrl: String
    processingStatus: String!
    createdAt: String!
  }

  type HealthStatus {
    status: String!
    message: String!
    timestamp: String!
  }
`;
