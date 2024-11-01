import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { PrismaClient } from '@prisma/client';

interface IUser {
  id: string;
  name: string;
  balance: number;
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: (UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (source: IUser, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { userId: source.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source: IUser, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findMany({ where: { authorId: source.id } });
      }
    },
    userSubscribedTo: {type: new GraphQLList(UserType),
      async resolve(source: IUser, _args, { prisma }: { prisma: PrismaClient }) {
        const subscribers = await prisma.subscribersOnAuthors.findMany({ where: { subscriberId: source.id } });
  
        return await prisma.user.findMany({
          where: {
            id: { in: subscribers.map((user) => user.authorId) }
          }
        });
      }
    },
    subscribedToUser: {type: new GraphQLList(UserType),
      async resolve(source: IUser, _args, { prisma }: { prisma: PrismaClient }) {
        const subscribers =  await prisma.subscribersOnAuthors.findMany({ where: { authorId: source.id } });
  
        return await prisma.user.findMany({
          where: {
            id: { in: subscribers.map((user) => user.subscriberId) },
          },
        });
      }
    },
  })
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
