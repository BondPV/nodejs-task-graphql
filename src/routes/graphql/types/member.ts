import { GraphQLEnumType,  GraphQLFloat,  GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { ProfileType } from './profile.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async ( source: { id: string}, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findMany({ where: { memberTypeId: source.id } });
      }
    },
  }),
});
