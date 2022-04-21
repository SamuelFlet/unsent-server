const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { getUserId } = require("./utils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        userId: req && req.headers.authorization ? getUserId(req) : null,
      };
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app });

  app.use((req, res) => {
    res.send("Hello from express apollo server");
  });

  app.listen(process.env.PORT || 3000, () =>
    console.log("Server is running...")
  );
}
startServer();
