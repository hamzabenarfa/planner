"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function register(email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { data: null, roleUser: null, error: "User already exists" };
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        hash,
        role: Role.MANAGER,
      },
    });

    return { 
      data: { message: "User created successfully" }, 
      roleUser: user.role, 
      error: null 
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      data: null,
      roleUser: null,
      error: "An error occurred during registration",
    };
  }
}
