import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { PrismaClient } from '@prisma/client';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: UserType,
      resolve: async (source: IPost, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id: source.authorId } });
      }
    },
  }),
});
