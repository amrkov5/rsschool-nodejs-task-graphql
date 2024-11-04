import {
  GraphQLFloat,
  GraphQLInputObjectType,
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
      resolve: async (parent, _, { loaders }) => {
        return loaders.profileLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(Posts),
      resolve: async (parent, _, { loaders }) => {
        if (parent.id) {
          return loaders.postLoader.load(parent.id);
        }
        return null;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (parent, _, { loaders }) => {
        return loaders.userSubscribedToLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(User)),
      resolve: async (parent, _, { loaders }) => {
        return loaders.subscribedToUserLoader.load(parent.id);
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const UserList = new GraphQLList(User);
