import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLInputType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { MemberType, MemberTypeListType, MemberTypeId } from './types/memberType.js';
import { User, UserList } from './types/usersType.js';
import { UUIDType } from './types/uuid.js';
import { Post, Posts } from './types/postsType.js';
import { Profile, ProfileList } from './types/profileType.js';

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
        schema,
        source: req.body.query,
        contextValue: { prisma },
        variableValues: req.body.variables,
      });
    },
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        memberTypes: {
          type: MemberTypeListType,
          resolve: async () => prisma.memberType.findMany(),
        },
        memberType: {
          type: MemberType,
          args: {
            id: { type: MemberTypeId },
          },
          resolve: async (_, args) =>
            prisma.memberType.findUnique({
              where: { id: args.id },
            }),
        },
        users: {
          type: UserList,
          resolve: async () => prisma.user.findMany(),
        },
        user: {
          type: User,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (_, args) =>
            prisma.user.findUnique({
              where: {
                id: args.id,
              },
            }),
        },
        posts: {
          type: Posts,
          resolve: async () => prisma.post.findMany(),
        },
        post: {
          type: Post,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (_, args) => {
            return prisma.post.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
        profiles: {
          type: ProfileList,
          resolve: async () => prisma.profile.findMany(),
        },
        profile: {
          type: Profile,
          args: {
            id: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (_, args) => {
            return prisma.profile.findUnique({
              where: {
                id: args.id,
              },
            });
          },
        },
      },
    }),
  });
};

export default plugin;
