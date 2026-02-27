import { prisma } from "../../lib/prisma";

const createProviderProfile = async (payload: any, userId: string) => {
  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Profile already exists");
  }

  const result = await prisma.providerProfile.create({
    data: {
      ...payload,
      userId,
    },
  });

  return result;
};

const getAllProviders = async (query: any) => {
  const { page = "1", limit = "10" } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const total = await prisma.providerProfile.count();

  const providers = await prisma.providerProfile.findMany({
    skip,
    take: limitNumber,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  return {
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: providers,
  };
};

const getSingleProvider = async (id: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      meals: {
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
        },
      },
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  return provider;
};
const getMyProviderProfile = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      meals: true,
    },
  });

  if (!provider) {
    throw new Error("Provider profile not found");
  }

  return provider;
};
export const providerService = {
  createProviderProfile,
  getAllProviders,
  getMyProviderProfile,
  getSingleProvider,
};
