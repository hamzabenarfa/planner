import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { useWhiteboardStore, WhiteboardElement } from './store';
import { getStroke } from 'perfect-freehand';

const CanvasRenderer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const elements = useWhiteboardStore((state) => state.elements);
    const selectedElementId = useWhiteboardStore((state) => state.selectedElementId);
    const pan = useWhiteboardStore((state) => state.pan);
    const zoom = useWhiteboardStore((state) => state.zoom);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        // Use the display size (CSS pixels) to set the physical size
        // We assume handleResize sets the style width/height correctly.
        // Actually, we should sync width/height here or in resize. 
        // Let's rely on resizing logic to set canvas.width/height to physical pixels.

        const rc = rough.canvas(canvas);

        // Clear canvas (physical pixels)
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to clear full buffer
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        // Order: Scale for DPR -> Scale for Zoom -> Translate for Pan
        // Actually: We want to work in "Logical World Coordinates".
        // Screen Pixel = (World Coord + Pan) * Zoom * DPR
        // ctx transforms apply in reverse order of code if thinking about matrices, 
        // or forward if thinking about coordinate spaces.
        // ctx.scale(dpr, dpr) -> transforms logical pixels to physical.
        // ctx.scale(zoom, zoom) -> transforms world units to logical pixels.
        // ctx.translate(pan.x, pan.y) -> moves world origin.
        
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.scale(zoom, zoom);
        ctx.translate(pan.x, pan.y);

        elements.forEach((element) => {
            drawElement(rc, ctx, element);
        });

        // Draw selection border
        if (selectedElementId) {
            const selectedElement = elements.find(el => el.id === selectedElementId);
            if (selectedElement) {
                drawSelectionBorder(ctx, selectedElement);
            }
        }

        ctx.restore();
    }, [elements, pan, zoom, selectedElementId]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const rect = canvasRef.current.parentElement.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                
                // Set physical size
                canvasRef.current.width = rect.width * dpr;
                canvasRef.current.height = rect.height * dpr;
                
                // Set CSS size
                canvasRef.current.style.width = `${rect.width}px`;
                canvasRef.current.style.height = `${rect.height}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); 

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

const drawSelectionBorder = (ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
    const padding = 8; // Increased padding for better visibility
    
    // Calculate bounds
    let x = element.x;
    let y = element.y;
    let w = element.width || 0;
    let h = element.height || 0;

    if (element.type === 'pencil' && element.points) {
        // Calculate bounding box for pencil
        const xs = element.points.map(p => p.x);
        const ys = element.points.map(p => p.y);
        x = Math.min(...xs);
        y = Math.min(...ys);
        w = Math.max(...xs) - x;
        h = Math.max(...ys) - y;
    } else if (element.type === 'line' || element.type === 'arrow') {
        // Normalize for bounding box
        const x1 = element.x;
        const y1 = element.y;
        const x2 = element.x + (element.width || 0);
        const y2 = element.y + (element.height || 0);
        x = Math.min(x1, x2);
        y = Math.min(y1, y2);
        w = Math.abs(x2 - x1);
        h = Math.abs(y2 - y1);
    } else {
        // Normalize negative width/height just in case (e.g. while dragging)
        if (w < 0) { x += w; w = Math.abs(w); }
        if (h < 0) { y += h; h = Math.abs(h); }
    }

    ctx.save();
    ctx.strokeStyle = '#3b82f6'; // Blue selection color
    ctx.lineWidth = 1 / window.devicePixelRatio; // Keep line thin
    if (ctx.lineWidth < 0.5) ctx.lineWidth = 0.5; // Min visible width
    
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x - padding, y - padding, w + padding * 2, h + padding * 2);
    
    // Draw corners (handles)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3b82f6';
    ctx.setLineDash([]);
    const handleSize = 8; // logical pixels
    
    // Top-left
    ctx.fillRect(x - padding - handleSize/2, y - padding - handleSize/2, handleSize, handleSize);
    ctx.strokeRect(x - padding - handleSize/2, y - padding - handleSize/2, handleSize, handleSize);
    
    // Top-right
    ctx.fillRect(x + w + padding - handleSize/2, y - padding - handleSize/2, handleSize, handleSize);
    ctx.strokeRect(x + w + padding - handleSize/2, y - padding - handleSize/2, handleSize, handleSize);

    // Bottom-left
    ctx.fillRect(x - padding - handleSize/2, y + h + padding - handleSize/2, handleSize, handleSize);
    ctx.strokeRect(x - padding - handleSize/2, y + h + padding - handleSize/2, handleSize, handleSize);

    // Bottom-right
    ctx.fillRect(x + w + padding - handleSize/2, y + h + padding - handleSize/2, handleSize, handleSize);
    ctx.strokeRect(x + w + padding - handleSize/2, y + h + padding - handleSize/2, handleSize, handleSize);

    ctx.restore();
};

const drawElement = (rc: any, ctx: CanvasRenderingContext2D, element: WhiteboardElement) => {
    const options = {
        stroke: element.strokeColor,
        strokeWidth: element.strokeWidth,
        fill: element.backgroundColor !== 'transparent' ? element.backgroundColor : undefined,
        fillStyle: element.fillStyle,
        roughness: element.roughness,
    };

    switch (element.type) {
        case 'rectangle':
            if (element.width && element.height) {
                rc.rectangle(element.x, element.y, element.width, element.height, options);
            }
            break;
        case 'ellipse':
            if (element.width && element.height) {
                rc.ellipse(element.x + element.width / 2, element.y + element.height / 2, element.width, element.height, options);
            }
            break;
        case 'line':
            if (element.width !== undefined && element.height !== undefined) {
                 rc.line(element.x, element.y, element.x + element.width, element.y + element.height, options);
            }
            break;
        case 'arrow':
            if (element.width !== undefined && element.height !== undefined) {
                const x1 = element.x;
                const y1 = element.y;
                const x2 = element.x + element.width;
                const y2 = element.y + element.height;

                rc.line(x1, y1, x2, y2, options);

                const angle = Math.atan2(y2 - y1, x2 - x1);
                const headLength = 20;
                rc.line(x2, y2, x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6), options);
                rc.line(x2, y2, x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6), options);
            }
            break;
        case 'pencil':
            if (element.points) {
                const stroke = getStroke(element.points, {
                    size: element.strokeWidth * 2,
                    thinning: 0.5,
                    smoothing: 0.5,
                    streamline: 0.5,
                });

                const pathData = getSvgPathFromStroke(stroke);
                ctx.fillStyle = element.strokeColor;
                ctx.fill(new Path2D(pathData));
            }
            break;
        case 'text':
            if (element.text) {
                ctx.font = `${element.strokeWidth * 10 + 10}px sans-serif`; 
                ctx.fillStyle = element.strokeColor;
                ctx.fillText(element.text, element.x, element.y);
            }
            break;
    }
};

// Helper for perfect-freehand
function getSvgPathFromStroke(stroke: any) {
    if (!stroke.length) return '';

    const d = stroke.reduce(
        (acc: any, [x0, y0]: any, i: number, arr: any) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );

    d.push('Z');
    return d.join(' ');
}

export default CanvasRenderer;