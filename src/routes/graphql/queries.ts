import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { IMember, MemberType, MemberTypeIdEnum } from './types/member.js';
import { PrismaClient } from '@prisma/client';
import { PostType } from './types/post.js';
import { IProfile, ProfileType } from './types/profile.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
        async resolve(_source, _args, { prisma }: { prisma: PrismaClient }) {
          return await prisma.memberType.findMany();
        },
      },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findMany();
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findMany();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (_source, args: IMember, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args: IProfile, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
