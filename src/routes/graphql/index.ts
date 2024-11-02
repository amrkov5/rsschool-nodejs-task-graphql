import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberType, MemberTypeListType, MemberTypeId } from './types/memberType.js';
import { User, UserList, CreateUserInput, ChangeUserInput } from './types/usersType.js';
import { UUIDType } from './types/uuid.js';
import { ChangePostInput, CreatePostInput, Post, Posts } from './types/postsType.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  Profile,
  ProfileList,
} from './types/profileType.js';
import { createSchema } from './types/schemaType.js';

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
      return graphql({
        schema: createSchema(prisma),
        source: req.body.query,
        contextValue: { prisma },
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
