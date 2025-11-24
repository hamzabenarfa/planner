"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBoard(projectId: number) {
  if (isNaN(projectId)) {
    return { success: false, error: "Invalid project ID" };
  }
  
  try {
    let board = await db.board.findUnique({
      where: {
        projectId,
      },
    });

    if (!board) {
        // Auto-create if not exists
        board = await db.board.create({
            data: {
                projectId,
                content: JSON.stringify({ elements: [] }),
            }
        });
    }

    return { success: true, data: board };
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return { success: false, error: "Failed to fetch board" };
  }
}

export async function updateBoard(projectId: number, content: string) {
  try {
    const board = await db.board.update({
      where: {
        projectId,
      },
      data: {
        content,
      },
    });
    
    // No need to revalidate path aggressively for internal state, but good practice if we show last updated
    return { success: true, data: board };
  } catch (error) {
    console.error("Failed to update board:", error);
    return { success: false, error: "Failed to update board" };
  }
}
