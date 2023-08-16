import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    quotes: [Quotes]
    iquote(by: ID!): [Quotes]
  }
  type User {
    id: ID!
    name: String
    email: String
    password: String
    quotes: [Quotes]
  }
  type Quotes {
    by: ID!
    name: String
  }
  type Mutation {
    signUpUser(userNew: UserInput): User
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
`;

export default typeDefs;
