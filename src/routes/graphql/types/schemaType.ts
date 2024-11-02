import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { MemberType, MemberTypeId, MemberTypeListType } from './memberType.js';
import { ChangeUserInput, CreateUserInput, User, UserList } from './usersType.js';
import { UUIDType } from './uuid.js';
import { ChangePostInput, CreatePostInput, Post, Posts } from './postsType.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  Profile,
  ProfileList,
} from './profileType.js';

const createRootQuery = (prisma) => {
  const RootQuery = new GraphQLObjectType({
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
  });

  return RootQuery;
};

const createMutations = (prisma) => {
  const Mutations = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      createUser: {
        type: User,
        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.user.create({
            data: {
              name: dto.name,
              balance: dto.balance,
            },
          });
        },
      },
      createPost: {
        type: Post,
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.post.create({
            data: {
              authorId: dto.authorId,
              title: dto.title,
              content: dto.content,
            },
          });
        },
      },
      createProfile: {
        type: Profile,
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },
        resolve: async (_, { dto }) => {
          return prisma.profile.create({
            data: {
              isMale: dto.isMale,
              yearOfBirth: dto.yearOfBirth,
              userId: dto.userId,
              memberTypeId: dto.memberTypeId,
            },
          });
        },
      },
      changeUser: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.user.update({
            where: {
              id,
            },
            data: {
              name: dto.name,
              balance: dto.balance,
            },
          });
        },
      },
      changePost: {
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.post.update({
            where: {
              id,
            },
            data: {
              title: dto.title,
              content: dto.content,
            },
          });
        },
      },
      changeProfile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (_, { id, dto }) => {
          return prisma.profile.update({
            where: {
              id,
            },
            data: {
              isMale: dto.isMale,
              yearOfBirth: dto.yearOfBirth,
              memberTypeId: dto.memberTypeId,
            },
          });
        },
      },
      deleteUser: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.user.delete({
            where: {
              id,
            },
          });
          return 'User deleted';
        },
      },
      deletePost: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.post.delete({
            where: {
              id,
            },
          });
          return 'Post deleted';
        },
      },
      deleteProfile: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { id }) => {
          await prisma.profile.delete({
            where: {
              id,
            },
          });
          return 'Profile deleted';
        },
      },
      subscribeTo: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }) => {
          await prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId,
            },
          });
          return 'User subscribed';
        },
      },
      unsubscribeFrom: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, { userId, authorId }) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                authorId,
                subscriberId: userId,
              },
            },
          });
          return 'User unsubscribed';
        },
      },
    },
  });

  return Mutations;
};

export const createSchema = (prisma) => {
  const schema = new GraphQLSchema({
    query: createRootQuery(prisma),
    mutation: createMutations(prisma),
  });

  return schema;
};
