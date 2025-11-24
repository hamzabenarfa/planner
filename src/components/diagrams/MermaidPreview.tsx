"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidPreviewProps {
    chart: string;
}

const MermaidPreview: React.FC<MermaidPreviewProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
        });
    }, []);

    useEffect(() => {
        const renderChart = async () => {
            if (ref.current && chart) {
                try {
                    setError(null);
                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (err) {
                    console.error("Mermaid render error:", err);
                    // Mermaid error handling is a bit tricky, it often renders an error message in the DOM itself
                    // but we can catch it here to show a cleaner UI or just log it.
                    setError("Failed to render diagram. Please check syntax.");
                }
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div className="w-full h-full overflow-auto p-4 bg-white rounded-lg border shadow-sm">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div ref={ref} className="mermaid-container flex justify-center" />
        </div>
    );
};

export default MermaidPreview;
