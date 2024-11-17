import { GraphQLSchema } from 'graphql';
import { query } from './queries.js';
import { mutation } from './mutations.js';

export const schema = new GraphQLSchema({
  query,
  mutation,
});
