import { GraphQLEnumType,  GraphQLFloat,  GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ProfileType } from './profile.js';
import { ContextType } from './context.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}


export const MemberType: GraphQLObjectType<IMember, ContextType> = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async ( parent, _args, { prisma }: ContextType) => {
        return await prisma.profile.findMany({
          where: { memberTypeId: parent?.id }
        });
      }
    },
  }),
});
