import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { useWhiteboardStore, WhiteboardElement } from './store';
import { getStroke } from 'perfect-freehand';

const CanvasRenderer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const elements = useWhiteboardStore((state) => state.elements);
    const pan = useWhiteboardStore((state) => state.pan);
    const zoom = useWhiteboardStore((state) => state.zoom);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rc = rough.canvas(canvas);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        elements.forEach((element) => {
            drawElement(rc, ctx, element);
        });

        ctx.restore();
    }, [elements, pan, zoom]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

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
            if (element.points && element.points.length > 1) {
                // Assuming points[0] is start and points[last] is end for a simple line tool
                // But for a generic line, we might just draw from x,y to width,height relative?
                // Let's assume for 'line' tool it's just two points: (x,y) to (x+width, y+height)
                rc.line(element.x, element.y, element.x + (element.width || 0), element.y + (element.height || 0), options);
            }
            break;
        case 'arrow':
            if (element.width && element.height) {
                // Simple arrow implementation
                const x1 = element.x;
                const y1 = element.y;
                const x2 = element.x + element.width;
                const y2 = element.y + element.height;

                // Draw main line
                rc.line(x1, y1, x2, y2, options);

                // Draw arrow head (simplified)
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
                ctx.font = `${element.strokeWidth * 5 + 10}px sans-serif`; // Simple scaling
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
