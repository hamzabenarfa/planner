import Whiteboard from '@/components/whiteboard/Whiteboard';

interface PageProps {
    params: {
        id: string;
    };
}

export default function BoardPage({ params }: PageProps) {
    const projectId = parseInt(params.id);

    if (isNaN(projectId)) {
        return <div>Invalid Project ID</div>;
    }

    return <Whiteboard projectId={projectId} />;
}
