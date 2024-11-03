import { GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { ChangeUserInputType, CreateUserInputType, IUserInput, UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { ChangePostInputType, CreatePostInputType, IPostInput, PostType } from './types/post.js';
import { ChangeProfileInputType, CreateProfileInputType, IProfileInput, ProfileType } from './types/profile.js';
import { ContextType } from './types/context.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: CreatePostInputType } },
      resolve: async (_parent, args: { dto: IPostInput }, { prisma }: ContextType) => {
        return await prisma.post.create({ data: args.dto });
      },
    },
    changePost: {
      type: PostType,
      args: { id: { type: UUIDType },
      dto: { type: ChangePostInputType }},
      resolve: async (_parent, args: {id: string, dto: IPostInput }, { prisma }: ContextType) => {
        return prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: {type: UUIDType} },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        try {
          await prisma.post.delete({ where: { id: args.id } });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    createUser: {
      type: UserType,
      args: { dto: { type: CreateUserInputType } },
      resolve: async (_parent, args: { dto: IUserInput }, { prisma }: ContextType) => {
        return prisma.user.create({
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: UserType,
      args: { id: { type: UUIDType },
      dto: { type: ChangeUserInputType },},
      resolve: async (_parent, args: { dto: IUserInput, id: string }, { prisma }: ContextType) => {
        return prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType} },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        try {
          await prisma.user.delete({
            where: { id: args.id },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: CreateProfileInputType } },
      resolve: async (_parent, args: { dto: IProfileInput }, { prisma }: ContextType) => {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: { id: { type: UUIDType },
      dto: { type: ChangeProfileInputType },},
      resolve: async (_parent, args: { id: string , dto: IProfileInput }, { prisma }: ContextType) => {
        return prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        try {
          await prisma.profile.delete({
            where: { id: args.id },
          });

          return true;
        } catch (err) {
          return false
        }
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (_parent, args: { userId: string; authorId: string }, { prisma }: ContextType) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
  
        const user = prisma.user.findUnique({ where: { id: args.userId } });

        return user;
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (_parent, args: { userId: string; authorId: string }, { prisma }: ContextType) => {
        try {
          await prisma.subscribersOnAuthors.deleteMany({
            where: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          });

          return true;
        } catch {
          return false;
        }
      },
    },
  },
});

