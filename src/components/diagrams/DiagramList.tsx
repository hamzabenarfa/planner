"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Diagram } from "@prisma/client";
import MermaidEditor from "./MermaidEditor";
import MermaidPreview from "./MermaidPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteDiagram, renameDiagram } from "@/actions/diagrams";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DiagramListProps {
    projectId: number;
    diagrams: Diagram[];
}

const DiagramList: React.FC<DiagramListProps> = ({ projectId, diagrams }) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);

    const handleCreate = () => {
        setSelectedDiagram(null);
        setIsEditing(true);
    };

    const handleEdit = (diagram: Diagram) => {
        setSelectedDiagram(diagram);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        const result = await deleteDiagram(id, projectId);
        if (result.success) {
            toast.success("Diagram deleted");
            router.refresh();
        } else {
            toast.error("Failed to delete diagram");
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        setSelectedDiagram(null);
        router.refresh();
    };

    if (isEditing) {
        return (
            <MermaidEditor
                projectId={projectId}
                initialDiagram={selectedDiagram}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Diagrams</h2>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New Diagram
                </Button>
            </div>

            {diagrams.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No diagrams found. Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {diagrams.map((diagram) => (
                        <Card key={diagram.id} className="flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg truncate" title={diagram.name}>
                                    {diagram.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4">
                                <div className="flex-1 min-h-[150px] max-h-[200px] border rounded bg-muted/20 overflow-hidden relative group">
                                    {/* We render a small preview. 
                       Note: Rendering many MermaidPreviews might be heavy. 
                       For a list, maybe just show code or a static icon? 
                       Let's try rendering it but maybe simplified or just the component. 
                   */}
                                    <div className="absolute inset-0 pointer-events-none transform scale-75 origin-top-left w-[133%] h-[133%]">
                                        <MermaidPreview chart={diagram.content} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-auto">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(diagram)}>
                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the diagram "{diagram.name}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(diagram.id)}>
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiagramList;
