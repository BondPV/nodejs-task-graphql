import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import depthLimit from 'graphql-depth-limit';
import { graphql } from 'graphql';
import { validate } from 'graphql/validation/validate.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { schema } from './schema.js';
import { parse } from 'graphql/language/parser.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const validationErrors = validate(schema, parse(query), [depthLimit(5)]);

      if (validationErrors.length) {
        return { errors: validationErrors };
      }

      const response = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });

      return response;
    },
  });
};

export default plugin;
