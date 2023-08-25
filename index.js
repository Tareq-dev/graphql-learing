import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schemas.js";
import resolvers from "./resolvers.js";
import jwt from "jsonwebtoken";

const context = ({ req }) => {
  const { authorization } = req.headers;

  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.jwtSecret);
    return { userId };
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`💛 Server is ready on this ${url}`);
});
