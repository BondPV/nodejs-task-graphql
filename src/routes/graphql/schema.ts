import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

const query = new GraphQLObjectType({
name: 'Query',
fields: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    users: {
      type: new GraphQLList(UserType),
    },
  },
});

export const schema = new GraphQLSchema({ query });
