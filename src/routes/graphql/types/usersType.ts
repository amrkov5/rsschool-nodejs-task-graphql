import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Posts } from './postsType.js';
import { Profile } from './profileType.js';

export const User = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (parent, _, context) => {
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(Posts),
      resolve: async (parent, _, context) => {
        if (parent.id) {
          return context.prisma.post.findMany({
            where: { authorId: parent.id },
          });
        }
        return null;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (parent, _, context) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (parent, _, context) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const UserList = new GraphQLList(User);
