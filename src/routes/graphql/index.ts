import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { createSchema } from './types/schemaType.js';
import depthLimit from 'graphql-depth-limit';
import {
  createMemberTypeLoader,
  createPostLoader,
  createProfileLoader,
  createSubscribedToUserLoader,
  createUserSubscribedToLoader,
} from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const context = (prisma) => {
    return {
      prisma,
      loaders: {
        memberTypeLoader: createMemberTypeLoader(prisma),
        profileLoader: createProfileLoader(prisma),
        postLoader: createPostLoader(prisma),
        userSubscribedToLoader: createUserSubscribedToLoader(prisma),
        subscribedToUserLoader: createSubscribedToUserLoader(prisma),
      },
    };
  };

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      try {
        const schema = createSchema(prisma);

        const ast = parse(req.body.query);

        const errors = validate(schema, ast, [depthLimit(5)]);
        if (errors.length > 0) {
          throw new Error('Your request exceeds maximum operation depth of 5');
        }
        return graphql({
          schema,
          source: req.body.query,
          contextValue: context(prisma),
          variableValues: req.body.variables,
        });
      } catch (error) {
        reply.send({ errors: [{ message: (error as Error).message }] });
      }
    },
  });
};

export default plugin;
