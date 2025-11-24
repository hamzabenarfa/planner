'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWhiteboardStore, ToolType, WhiteboardElement } from './store';
import CanvasRenderer from './CanvasRenderer';
import Toolbar from './Toolbar';
import { nanoid } from 'nanoid';
import { getDiagram, updateDiagram } from '@/actions/diagrams';
import { getBoard, updateBoard } from '@/actions/board';
import toast from 'react-hot-toast';
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        removeElement,
        setTool,
        selectedElementId,
        setSelectedElementId
    } = useWhiteboardStore();

    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [spacePressed, setSpacePressed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastMousePos = useRef<{ x: number; y: number } | null>(null);

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

    // Handle spacebar for panning
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) {
                setSpacePressed(true);
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedId = useWhiteboardStore.getState().selectedElementId;
                if (selectedId) {
                    removeElement(selectedId);
                    setSelectedElementId(null);
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setSpacePressed(false);
                setIsPanning(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [removeElement, setSelectedElementId]);

    // Prevent default wheel behavior for zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => container.removeEventListener('wheel', onWheel);
    }, []);

    const getMouseCoordinates = (e: React.MouseEvent | React.WheelEvent | MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0, clientX: 0, clientY: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - pan.x) / zoom,
            y: (e.clientY - rect.top - pan.y) / zoom,
            clientX: e.clientX,
            clientY: e.clientY
        };
    };

    const isPointInElement = (x: number, y: number, element: WhiteboardElement) => {
        const padding = 10 / zoom;
        let bounds = {
            left: element.x,
            top: element.y,
            right: element.x + (element.width || 0),
            bottom: element.y + (element.height || 0),
        };

        // Normalize bounds
        const x1 = Math.min(bounds.left, bounds.right);
        const x2 = Math.max(bounds.left, bounds.right);
        const y1 = Math.min(bounds.top, bounds.bottom);
        const y2 = Math.max(bounds.top, bounds.bottom);

        if (element.type === 'pencil' && element.points) {
            return element.points.some(p => 
                Math.abs(p.x - x) < padding && Math.abs(p.y - y) < padding
            );
        }

        if (element.type === 'line' || element.type === 'arrow') {
             // Basic line hit detection (distance from point to line segment)
             // simplified: check bounding box with padding
             return x >= x1 - padding && x <= x2 + padding && y >= y1 - padding && y <= y2 + padding;
        }

        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y, clientX, clientY } = getMouseCoordinates(e);
        lastMousePos.current = { x: clientX, y: clientY };

        // Panning check
        if (spacePressed || tool === 'hand' || e.button === 1) {
            setIsPanning(true);
            return;
        }

        if (tool === 'selection') {
            const clickedElement = [...elements].reverse().find(el => isPointInElement(x, y, el));
            
            if (clickedElement) {
                setSelectedElementId(clickedElement.id);
                setCurrentId(clickedElement.id);
                setIsDrawing(true); // Using isDrawing for dragging logic
            } else {
                setSelectedElementId(null);
                setCurrentId(null);
                // Start selection rectangle (optional: not implemented yet, using panning on empty space for now?)
                // Or maybe drag to pan if clicking on empty space?
                // Let's default to panning on empty space if selection tool is active but nothing hit?
                // For now, just deselect.
            }
            return;
        }

        // Creating new element
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
            text: tool === 'text' ? 'Double click to edit' : undefined,
        };

        addElement(newElement);
        setCurrentId(id);
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { x, y, clientX, clientY } = getMouseCoordinates(e);

        if (isPanning) {
            if (lastMousePos.current) {
                const dx = clientX - lastMousePos.current.x;
                const dy = clientY - lastMousePos.current.y;
                setPan({ x: pan.x + dx, y: pan.y + dy });
                lastMousePos.current = { x: clientX, y: clientY };
            }
            return;
        }

        if (!isDrawing || !currentId) return;

        const element = elements.find((el) => el.id === currentId);
        if (!element) return;

        if (tool === 'selection') {
            // Dragging selection
            const dx = (clientX - (lastMousePos.current?.x || clientX)) / zoom;
            const dy = (clientY - (lastMousePos.current?.y || clientY)) / zoom;
            
            if (element.type === 'pencil' && element.points) {
                const newPoints = element.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                updateElement(currentId, { x: element.x + dx, y: element.y + dy, points: newPoints });
            } else {
                updateElement(currentId, { x: element.x + dx, y: element.y + dy });
            }
            lastMousePos.current = { x: clientX, y: clientY };
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
        
        // Don't update lastMousePos for drawing tools as we need origin for width/height calc (except selection)
        // Wait, for width/height we use element.x/y which are fixed start points.
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsPanning(false);
        lastMousePos.current = null;

        if (currentId && tool !== 'selection' && tool !== 'pencil') {
             // Normalize width/height if negative for shapes that need it (rect, ellipse)
             // For line/arrow, negative width/height encodes direction, so don't normalize unless we change how we store them.
             const element = elements.find(el => el.id === currentId);
             
             if (element && (element.type === 'rectangle' || element.type === 'ellipse')) {
                 if ((element.width && element.width < 0) || (element.height && element.height < 0)) {
                     const newX = element.width && element.width < 0 ? element.x + element.width : element.x;
                     const newY = element.height && element.height < 0 ? element.y + element.height : element.y;
                     const newWidth = Math.abs(element.width || 0);
                     const newHeight = Math.abs(element.height || 0);
                     
                     updateElement(currentId, {
                         x: newX,
                         y: newY,
                         width: newWidth,
                         height: newHeight
                     });
                 }
             }
        }
        
        if (tool !== 'selection') {
            // Stay in drawing mode or switch to selection? 
            // Usually tools like rectangle persist until user switches.
             setCurrentId(null);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            const delta = -e.deltaY;
            const zoomStep = 0.1;
            const newZoom = delta > 0 ? Math.min(zoom + zoomStep, 5) : Math.max(zoom - zoomStep, 0.1);
            
            // Calculate zoom to center around mouse
            // Currently just zooms center/top-left. 
            // Perfect zoom to mouse requires adjusting pan as well.
            // Simplified:
            setZoom(newZoom);
        } else {
            // Pan
            setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const cursorClass = spacePressed || tool === 'hand' || isPanning 
        ? isPanning ? 'cursor-grabbing' : 'cursor-grab'
        : tool === 'selection' ? 'cursor-default' : 'cursor-crosshair';

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-50 flex flex-col">
            <div 
                ref={containerRef}
                className={`flex-1 relative overflow-hidden ${cursorClass}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <Toolbar />
                <CanvasRenderer />
                
                {/* Zoom Controls */}
                <div className="absolute bottom-4 left-4 flex gap-2 bg-white p-1 rounded-md shadow-md border z-20">
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}><ZoomOut className="h-4 w-4" /></Button>
                    <span className="flex items-center text-xs w-12 justify-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(zoom + 0.1, 5))}><ZoomIn className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setZoom(1); setPan({x: 0, y: 0}); }} title="Reset View"><RotateCcw className="h-4 w-4" /></Button>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded shadow text-xs text-gray-500 pointer-events-none select-none z-10">
                    {tool === 'selection' ? 'Click to select. Drag to move. Del to delete.' : 'Drag to draw. Space/Wheel to pan.'}
                </div>
            </div>
        </div>
    );
};

export default Whiteboard;