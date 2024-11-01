import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { PrismaClient } from '@prisma/client';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (userId: string, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { userId } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (authorId: string, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findMany({ where: { authorId } });
      }
    },
  })
})
