const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("./utils");

const resolvers = {
  Query: {
    hello: () => {
      return "Hello, World!";
    },

    getAllPosts: async () => {
      return await prisma.post.findMany({
        include: {
          author: true,
        },
      });
    },

    allUsers: async () => {
      return await prisma.user.findMany({
        include: {
          posts: true,
          profile: true,
        },
      });
    },
  },

  Mutation: {
    signup: async (parent, args, context, info) => {
      const password = await bcrypt.hash(args.password, 10);

      // 2cle
      const user = await context.prisma.user.create({
        data: { ...args, password },
      });

      // 3
      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      // 4
      return {
        token,
        user,
      };
    },

    login: async (parent, args, context, info) => {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new Error("No such user found");
      }

      // 2
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      // 3
      return {
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;
