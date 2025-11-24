import Whiteboard from '@/components/whiteboard/Whiteboard';

interface PageProps {
    params: {
        projectId: string;
    };
}

export default function BoardPage({ params }: PageProps) {
    const projectId = parseInt(params.projectId);

    if (isNaN(projectId)) {
        return <div>Invalid Project ID</div>;
    }

    return <Whiteboard projectId={projectId} />;
}
