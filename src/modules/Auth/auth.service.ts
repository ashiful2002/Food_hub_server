import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { UserRole, UserStatus } from "@prisma/client";

const createUserIntoDB = async (payload: any) => {
  const password = payload.password;
  const hashedPassword = await bcrypt.hash(password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
  return result;
};

const loginUser = async (payload: any) => {
  const { email } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }
  if (user.status !== UserStatus.ACTIVE) {
    throw new Error("User is suspended");
  }
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("password does not matched");
  }
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(userData, config.jwt_secret, {
    expiresIn: "1d",
  });

  return {
    token,
    user,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return {
    user,
  };
};

const updateProfile = async (userId: string, payload: any) => {
  const allowedFields = [
    "name",
    "phone",
    "avatar",
    "street",
    "city",
    "postalCode",
    "address",
  ];

  const data: any = {};
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return { user: updatedUser };
};

export const AuthService = {
  createUserIntoDB,
  loginUser,
  getMe,
  updateProfile,
};
