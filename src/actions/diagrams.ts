"use server";

import { prismaClientGlobal as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDiagrams(projectId: number) {
  if (isNaN(projectId)) {
    return { success: false, error: "Invalid project ID" };
  }
  
  console.log("getDiagrams called for projectId:", projectId);
  
  if (!db) {
      console.error("DB instance is undefined");
      return { success: false, error: "Database connection failed" };
  }
  
  // Check if diagram model exists on db instance (it might be hidden in $extends or similar, but usually it's a property)
  // We can't easily check keys on PrismaClient instance as they are getters, but we can try accessing it.
  
  try {
    console.log("Attempting to fetch diagrams...");
    const diagrams = await db.diagram.findMany({
      where: {
        projectId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { success: true, data: diagrams };
  } catch (error) {
    console.error("Failed to fetch diagrams for projectId:", projectId);
    console.error("Error details:", error);
    return { success: false, error: "Failed to fetch diagrams" };
  }
}

export async function getDiagram(id: number) {
  try {
    const diagram = await db.diagram.findUnique({
      where: {
        id,
      },
    });
    
    if (!diagram) {
        return { success: false, error: "Diagram not found" };
    }

    return { success: true, data: diagram };
  } catch (error) {
    console.error("Failed to fetch diagram:", error);
    return { success: false, error: "Failed to fetch diagram" };
  }
}

export async function createDiagram(projectId: number, name: string, content: string) {
  try {
    const diagram = await db.diagram.create({
      data: {
        name,
        content,
        projectId,
      },
    });
    
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, data: diagram };
  } catch (error) {
    console.error("Failed to create diagram:", error);
    return { success: false, error: "Failed to create diagram" };
  }
}

export async function updateDiagram(id: number, content: string) {
  try {
    const diagram = await db.diagram.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
    
    // We might need to revalidate the project page if the diagram list shows updated times
    // But since we don't have the projectId handy here easily without an extra query (or passing it),
    // and this is likely called from within the diagram editor, specific revalidation might be handled by the client or less critical.
    // However, to be safe and if we want to update the list "last updated" time:
    revalidatePath(`/dashboard/projects/${diagram.projectId}`);

    return { success: true, data: diagram };
  } catch (error) {
    console.error("Failed to update diagram:", error);
    return { success: false, error: "Failed to update diagram" };
  }
}

export async function deleteDiagram(id: number, projectId: number) {
  try {
    await db.diagram.delete({
      where: {
        id,
      },
    });
    
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete diagram:", error);
    return { success: false, error: "Failed to delete diagram" };
  }
}

export async function renameDiagram(id: number, name: string, projectId: number) {
    try {
      const diagram = await db.diagram.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
      
      revalidatePath(`/dashboard/projects/${projectId}`);
      return { success: true, data: diagram };
    } catch (error) {
      console.error("Failed to rename diagram:", error);
      return { success: false, error: "Failed to rename diagram" };
    }
  }
