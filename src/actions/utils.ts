import { auth } from "@/auth";

export async function authenticatedUser() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  return parseInt(session.user.id);
}
