import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from './user.js';
import { IProfile } from './profile.js';
import { IPost } from './post.js';
import { IMember } from './member.js';

export type DataLoaderType<T> = DataLoader<string, T | undefined, string>;

export type ContextType = {
  prisma: PrismaClient;
  dataloaders: {
    userDataLoader: DataLoaderType<IUser>;
    profileDataLoader: DataLoaderType<IProfile>;
    postDataLoader: DataLoaderType<IPost>;
    memberTypeDataLoader: DataLoaderType<IMember>;
  };
};
