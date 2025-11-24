'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWhiteboardStore, ToolType, WhiteboardElement } from './store';
import CanvasRenderer from './CanvasRenderer';
import Toolbar from './Toolbar';
import { nanoid } from 'nanoid';
import { getDiagram, updateDiagram } from '@/actions/diagrams';
import { getBoard, updateBoard } from '@/actions/board';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface WhiteboardProps {
    projectId: number;
    diagramId?: number;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ projectId, diagramId }) => {
    const {
        elements,
        tool,
        addElement,
        updateElement,
        setElements,
        pan,
        zoom,
        setPan,
        setZoom,
    } = useWhiteboardStore();
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                if (diagramId !== undefined) {
                    const result = await getDiagram(diagramId);
                    if (result.success && result.data) {
                        if (result.data.content) {
                            try {
                                const parsed = JSON.parse(result.data.content);
                                setElements(parsed.elements || []);
                            } catch (e) {
                                console.error("Failed to parse diagram content", e);
                            }
                        }
                    } else {
                        toast.error("Failed to load diagram");
                    }
                } else {
                    const result = await getBoard(projectId);
                    if (result.success && result.data) {
                        if (result.data.content) {
                            try {
                                const parsed = JSON.parse(result.data.content);
                                setElements(parsed.elements || []);
                            } catch (e) {
                                console.error("Failed to parse board content", e);
                            }
                        }
                    } else {
                        toast.error("Failed to load board");
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error(diagramId !== undefined ? "Failed to load diagram" : "Failed to load board");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [projectId, diagramId, setElements]);

    // Auto-save (debounced)
    useEffect(() => {
        if (isLoading) return;

        const saveTimeout = setTimeout(async () => {
            const content = JSON.stringify({ elements });
            if (diagramId !== undefined) {
                await updateDiagram(diagramId, content);
            } else {
                await updateBoard(projectId, content);
            }
        }, 1000);

        return () => clearTimeout(saveTimeout);
    }, [elements, projectId, diagramId, isLoading]);

    // Helper to check if point is inside element (simplified)
    const isPointInElement = (x: number, y: number, element: WhiteboardElement) => {
        // Very simple hit testing
        const bounds = {
            left: element.x,
            top: element.y,
            right: element.x + (element.width || 0),
            bottom: element.y + (element.height || 0),
        };

        // Normalize bounds for negative width/height
        const x1 = Math.min(bounds.left, bounds.right);
        const x2 = Math.max(bounds.left, bounds.right);
        const y1 = Math.min(bounds.top, bounds.bottom);
        const y2 = Math.max(bounds.top, bounds.bottom);

        // For pencil/line, this is harder, but for rect/ellipse it's okay
        // For pencil, we'd need to check distance to points
        if (element.type === 'pencil' && element.points) {
            return element.points.some(p => Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10);
        }

        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX - pan.x) / zoom;
        const y = (clientY - pan.y) / zoom;

        if (tool === 'selection') {
            // Find clicked element (reverse to find top-most)
            const clickedElement = [...elements].reverse().find(el => isPointInElement(x, y, el));

            if (clickedElement) {
                useWhiteboardStore.getState().setSelectedElementId(clickedElement.id);
                setCurrentId(clickedElement.id);
                setIsDrawing(true); // Using isDrawing for "isDragging" in selection mode
            } else {
                useWhiteboardStore.getState().setSelectedElementId(null);
                setCurrentId(null);
            }
            return;
        }

        const id = nanoid();

        const newElement: WhiteboardElement = {
            id,
            type: tool,
            x,
            y,
            width: 0,
            height: 0,
            strokeColor: '#000000',
            backgroundColor: 'transparent',
            strokeWidth: 2,
            fillStyle: 'hachure',
            roughness: 1,
            points: tool === 'pencil' ? [{ x, y }] : undefined,
            text: tool === 'text' ? 'Text' : undefined, // Placeholder
        };

        addElement(newElement);
        setCurrentId(id);
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !currentId) return;

        const { clientX, clientY } = e;
        const x = (clientX - pan.x) / zoom;
        const y = (clientY - pan.y) / zoom;

        const element = elements.find((el) => el.id === currentId);
        if (!element) return;

        if (tool === 'selection') {
            // Move element
            // We need to track delta, but for simplicity let's just move to mouse pos (centering is better but complex)
            // Better: store offset on MouseDown. For now, simple delta.
            const dx = e.movementX / zoom;
            const dy = e.movementY / zoom;

            if (element.type === 'pencil' && element.points) {
                const newPoints = element.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                updateElement(currentId, { x: element.x + dx, y: element.y + dy, points: newPoints });
            } else {
                updateElement(currentId, { x: element.x + dx, y: element.y + dy });
            }
            return;
        }

        if (tool === 'pencil') {
            const newPoints = [...(element.points || []), { x, y }];
            updateElement(currentId, { points: newPoints });
        } else {
            updateElement(currentId, {
                width: x - element.x,
                height: y - element.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        if (tool !== 'selection') {
            setCurrentId(null);
            // If text tool, maybe prompt for text?
            // For now, keep it simple.
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedId = useWhiteboardStore.getState().selectedElementId;
                if (selectedId) {
                    useWhiteboardStore.getState().removeElement(selectedId);
                    useWhiteboardStore.getState().setSelectedElementId(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-gray-50"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Toolbar />
            <CanvasRenderer />
            {/* Zoom controls could go here */}
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow text-xs text-gray-500">
                {tool === 'selection' ? 'Select & Drag to move. Delete to remove.' : 'Drag to draw.'}
            </div>
        </div>
    );
};

export default Whiteboard;
