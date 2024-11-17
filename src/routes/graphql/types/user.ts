import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { IProfile, ProfileType } from './profile.js';
import { IPost, PostType } from './post.js';
import { ContextType } from './context.js';

export interface IUserInput {
  name: string;
  balance: number;
}

export type IUser = {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo?: ISubscriber[];
  subscribedToUser?: ISubscriber[];
};

interface ISubscriber {
  subscriberId: string;
  authorId: string;
};

export const UserType: GraphQLObjectType<IUser, ContextType> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: (UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async (parent, _args, context: ContextType) => {
        return await context.dataloaders.profileDataLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, _args, context: ContextType) => {
        return await context.dataloaders.postDataLoader.load(parent.id);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, context) => {
        if (parent.userSubscribedTo && parent.userSubscribedTo?.length) {
          const usersIds = parent.userSubscribedTo.map((user) => user.authorId);
          const authors = context.dataloaders.userDataLoader.loadMany(usersIds);

          return authors;
        }
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, context) => {
        if (parent.subscribedToUser && parent.subscribedToUser?.length) {
          const usersIds = parent.subscribedToUser.map((user) => user.subscriberId);
          const subscribers = context.dataloaders.userDataLoader.loadMany(usersIds);

          return subscribers;
        }
      },
    },
  })
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
