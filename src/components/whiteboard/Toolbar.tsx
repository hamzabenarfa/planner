import React from 'react';
import { useWhiteboardStore, ToolType } from './store';
import { MousePointer2, Square, Circle, ArrowRight, Minus, Pencil, Type, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools: { type: ToolType; icon: React.ElementType; label: string }[] = [
    { type: 'selection', icon: MousePointer2, label: 'Selection' },
    { type: 'hand', icon: Hand, label: 'Hand (Pan)' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'ellipse', icon: Circle, label: 'Ellipse' },
    { type: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { type: 'line', icon: Minus, label: 'Line' },
    { type: 'pencil', icon: Pencil, label: 'Pencil' },
    { type: 'text', icon: Type, label: 'Text' },
];

const Toolbar = () => {
    const currentTool = useWhiteboardStore((state) => state.tool);
    const setTool = useWhiteboardStore((state) => state.setTool);

    return (
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border z-10">
            {tools.map(({ type, icon: Icon, label }) => (
                <Button
                    key={type}
                    variant={currentTool === type ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setTool(type)}
                    title={label}
                >
                    <Icon className="h-5 w-5" />
                </Button>
            ))}
        </div>
    );
};

export default Toolbar;
