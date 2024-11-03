import { GraphQLList, GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { IUser, UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId } from './types/member.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { ContextType } from './types/context.js';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
        resolve: async (_parent, _args, { prisma }: ContextType) => {
          return await prisma.memberType.findMany();
        },
      },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent, _args, { prisma }: ContextType) => {
        return await prisma.post.findMany();
      }
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_parent, _args, { prisma }: ContextType) => {
        return await prisma.profile.findMany();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, context: ContextType, resolveInfo: GraphQLResolveInfo) => {
        const parsedResolveInfo = parseResolveInfo(resolveInfo);
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfo as ResolveTree,
          resolveInfo.returnType,
        );

        const users: IUser[] = await context.prisma.user.findMany({
          include: {
            subscribedToUser: 'subscribedToUser' in fields,
            userSubscribedTo: 'userSubscribedTo' in fields,
          },
        });

        users.forEach((user) => {
          context.dataloaders.userDataLoader.prime(user.id, user);
        });

        return users;
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, context: ContextType) => {
        return await context.dataloaders.userDataLoader.load(args.id);
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
