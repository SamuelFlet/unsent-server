const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    id: ID!
    createdAt: String
    updatedAt: String
    title: String
    content: String
    published: Boolean
    author: User
  }

  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Query {
    hello: String
    getAllPosts: [Post]
    allUsers: [User]
  }

  type Mutation {
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

module.exports = typeDefs;
