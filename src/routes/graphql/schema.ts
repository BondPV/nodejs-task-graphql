import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { ChangeUserInputType, CreateUserInputType, IUserInput, UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { IMember, MemberType, MemberTypeIdEnum } from './types/member.js';
import { PrismaClient } from '@prisma/client';
import { ChangePostInputType, CreatePostInputType, IPostInput, PostType } from './types/post.js';
import { ChangeProfileInputType, CreateProfileInputType, IProfile, IProfileInput, ProfileType } from './types/profile.js';
import { ISubscription } from './types/subscription.js';

const query = new GraphQLObjectType({
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: CreatePostInputType } },
      async resolve(_source, args: { dto: IPostInput }, { prisma }: { prisma: PrismaClient }) {
        return prisma.post.create({ data: args.dto });
      },
    },
    changePost: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: ChangePostInputType }},
      async resolve(_source, args: {id: string, dto: IPostInput }, { prisma }: { prisma: PrismaClient }) {
        return prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: {type: new GraphQLNonNull(UUIDType)} },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.post.delete({
          where: { id: args.id },
        });

        return null
      },
    },
    createUser: {
      type: UserType,
      args: { dto: { type: CreateUserInputType } },
      async resolve(_source, args: { dto: IUserInput }, { prisma }: { prisma: PrismaClient }) {
        return prisma.user.create({
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: ChangeUserInputType },},
      async resolve(_source, args: { dto: IUserInput, id: string }, { prisma }: { prisma: PrismaClient }) {
        return prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType)} },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.user.delete({
          where: { id: args.id },
        });

        return null
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: CreateProfileInputType } },
      async resolve(_source, args: { dto: IProfileInput }, { prisma }: { prisma: PrismaClient }) {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: { id: { type: UUIDType },
      dto: { type: ChangeProfileInputType },},
      async resolve(_source, args: { id: string , dto: IProfileInput }, { prisma }: { prisma: PrismaClient }) {
        return prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.profile.delete({
          where: { id: args.id },
        });

        return null
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source,  { userId: id, authorId }: ISubscription, { prisma }: { prisma: PrismaClient }) {
        const user = prisma.user.update({
          where: { id },
          data: { userSubscribedTo: { create: { authorId } } },
        });

        return user;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, { userId: subscriberId, authorId }: ISubscription, { prisma }: { prisma: PrismaClient }) {
        await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId, authorId } },
        });
        return null
      },
    },
  },
});

export const schema = new GraphQLSchema({ query, mutation });
