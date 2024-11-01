import { GraphQLEnumType,  GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { ProfileType } from './profile.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLID) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async ( { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findMany({ where: { id } });
      }
    },
  }),
});










interface IMemberType {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const memberType = new GraphQLObjectType<IMemberType>({
  name: 'Member',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getMemberTypeById: {
      type: memberType,
      args: {
        memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, { memberTypeId }, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id: memberTypeId } });
      }
    },
  }
});

export const schema = new GraphQLSchema({
  query: Query,
});
