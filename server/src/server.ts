import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
import connectDB from './database/db';

async function startServer() {
  const app = express();
  const PORT = 4000;

  // Connect to MongoDB
  await connectDB();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [],
  });

  await server.start();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Backend is connected!',
      timestamp: new Date().toISOString(),
    });
  });

  // GraphQL endpoint
  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 GraphQL: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
