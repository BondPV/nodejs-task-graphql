import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { IUser } from './types/user.js';
import { IProfile } from './types/profile.js';
import { IPost } from './types/post.js';
import { IMember } from './types/member.js';

export const userDataLoader = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const users: IUser[] = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    const usersByIds = ids.map((id) => users.find((user) => user.id === id));

    return usersByIds;
  });

  return dl;
};

export const profileDataLoader = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const profiles: IProfile[] = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const profilesByIds = ids.map((id) =>
      profiles.find((profile) => profile.userId === id),
    );

    return profilesByIds;
  });

  return dl;
};

export const postDataLoader = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const posts: IPost[] = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    const postsByIds = ids.map((id) => posts.filter((post) => post.authorId === id));

    return postsByIds;
  });

  return dl;
};

export const memberTypeDataLoader = (prisma: PrismaClient) => {
  const dl = new DataLoader(async (ids: Readonly<string[]>) => {
    const memberTypes: IMember[] = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });

    const memberTypesByIds = ids.map((id) =>
      memberTypes.find((memberType) => memberType.id === id),
    );

    return memberTypesByIds;
  });

  return dl;
};

export const getDataLoaders = (prisma: PrismaClient) => {
  return {
    userDataLoader: userDataLoader(prisma),
    profileDataLoader: profileDataLoader(prisma),
    postDataLoader: postDataLoader(prisma),
    memberTypeDataLoader: memberTypeDataLoader(prisma),
  };
};
