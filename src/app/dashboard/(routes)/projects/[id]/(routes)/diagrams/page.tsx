import React from "react";
import { getDiagrams } from "@/actions/diagrams";
import DiagramList from "@/components/diagrams/DiagramList";

interface DiagramsPageProps {
    params: {
        id: string;
    };
}

export default async function DiagramsPage({ params }: DiagramsPageProps) {
    const projectId = parseInt(params.id);
    const { data: diagrams, error } = await getDiagrams(projectId);

    if (error) {
        return <div>Error loading diagrams: {error}</div>;
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <DiagramList projectId={projectId} diagrams={diagrams || []} />
        </div>
    );
}
