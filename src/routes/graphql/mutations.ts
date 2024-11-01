import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangeUserInputType, CreateUserInputType, IUserInput, UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { ChangePostInputType, CreatePostInputType, IPostInput, PostType } from './types/post.js';
import { ChangeProfileInputType, CreateProfileInputType, IProfileInput, ProfileType } from './types/profile.js';

export const mutation = new GraphQLObjectType({
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
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, args: { userId: string; authorId: string }, { prisma }: { prisma: PrismaClient }) {
        return prisma.user.update({
          where: { id: args.userId },
          data: { userSubscribedTo: { create: { authorId: args.authorId } } },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_source, args: { userId: string; authorId: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.subscribersOnAuthors.delete({
          where: { 
            subscriberId_authorId: { 
              subscriberId: args.userId,
              authorId: args.authorId
            }
          },
        });
      },
    },
  },
});

