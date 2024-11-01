import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId, MemberTypeIdEnum } from './member.js';
import { UserType } from './user.js';
import { PrismaClient } from '@prisma/client';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
};

export interface IProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
};

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: UUIDType },
      memberTypeId: { type: MemberTypeIdEnum },
      user: {
        type: UserType,
        resolve: async (source: IProfile, _args, { prisma }: { prisma: PrismaClient }) => {
          return await prisma.user.findUnique({ where: { id: source.userId } });
        },
      },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: IProfile, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id: source.memberTypeId } });
      }
    },
  }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt},
    memberTypeId: { type: MemberTypeIdEnum },
    userId: { type: new GraphQLNonNull(UUIDType)  },
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});
