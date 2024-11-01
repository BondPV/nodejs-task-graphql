import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './member.js';
import { UserType } from './user.js';
import { PrismaClient } from '@prisma/client';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async ({ id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      }
    },
    user: {
      type: UserType,
      resolve: async ({ id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id } });
      }
    },
  }),
});
