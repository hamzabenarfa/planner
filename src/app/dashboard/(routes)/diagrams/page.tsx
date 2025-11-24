import React from "react";
import Link from "next/link";
import { getMyProjects } from "@/actions/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Folder } from "lucide-react";

export default async function DiagramsPage() {
    const projects = await getMyProjects();

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Diagrams</h2>
                    <p className="text-muted-foreground">
                        Select a project to manage its diagrams.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {project.name}
                            </CardTitle>
                            <Folder className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground mb-4">
                                {project.status}
                            </div>
                            <Link href={`/dashboard/projects/${project.id}/diagrams`}>
                                <Button className="w-full" size="sm">
                                    Manage Diagrams <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No projects found. Create a project first to add diagrams.
                    </div>
                )}
            </div>
        </div>
    );
}
