import DataLoader from 'dataloader';

export const createMemberTypeLoader = (prisma) => {
  return new DataLoader(async (memberTypeIds) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: memberTypeIds } },
    });

    return memberTypeIds.map((id) => memberTypes.find((type) => type.id === id));
  });
};

export const createPostLoader = (prisma) => {
  return new DataLoader(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds } },
    });

    return authorIds.map((id) => posts.filter((post) => post.authorId === id));
  });
};

export const createProfileLoader = (prisma) => {
  return new DataLoader(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds } },
    });

    return userIds.map((id) => profiles.find((profile) => profile.userId === id));
  });
};

export const createUserSubscribedToLoader = (prisma) => {
  return new DataLoader(async (subscriberIds) => {
    const authors = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: subscriberIds } },
      include: { author: true },
    });

    return subscriberIds.map((id) =>
      authors
        .filter((author) => author.subscriberId === id)
        .map((author) => author.author),
    );
  });
};

export const createSubscribedToUserLoader = (prisma) => {
  return new DataLoader(async (authorIds) => {
    const subscribers = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: authorIds } },
      include: { subscriber: true },
    });

    return authorIds.map((id) =>
      subscribers
        .filter((subscriber) => subscriber.authorId === id)
        .map((subscriber) => subscriber.subscriber),
    );
  });
};
