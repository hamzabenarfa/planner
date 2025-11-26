"use client";

import { useState } from "react";
import { SparkWithAppointment } from "@/types/appointment";
import { createSpark, deleteSpark } from "@/actions/spark";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SparkWidgetProps {
    sparks: SparkWithAppointment[];
    onSparkCreated: () => void;
}

export function SparkWidget({ sparks, onSparkCreated }: SparkWidgetProps) {
    const [content, setContent] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCreate = async () => {
        if (!content.trim()) return;

        setIsAdding(true);
        try {
            await createSpark({ content: content.trim() });
            setContent("");
            toast.success("Idea captured!");
            onSparkCreated();
        } catch (error: any) {
            toast.error(error.message || "Failed to capture idea");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteSpark(id);
            toast.success("Idea deleted");
            onSparkCreated();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete idea");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleCreate();
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Spark Ideas</h3>
                    <Badge variant="secondary" className="text-xs">
                        {sparks.length}
                    </Badge>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
            </div>

            {/* Quick capture input */}
            <div className="flex gap-2 mb-4">
                <Input
                    placeholder="Got 10 minutes? Capture a quick idea..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isAdding}
                />
                <Button
                    onClick={handleCreate}
                    disabled={!content.trim() || isAdding}
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Recent sparks list */}
            {isExpanded && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {sparks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No ideas captured yet. Start capturing your thoughts!
                        </p>
                    ) : (
                        sparks.map((spark) => (
                            <div
                                key={spark.id}
                                className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg"
                            >
                                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">{spark.content}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(spark.createdAt), "MMM d, h:mm a")}
                                        </span>
                                        {spark.linkedAppointment && (
                                            <Badge variant="outline" className="text-xs">
                                                Linked to: {spark.linkedAppointment.title}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-destructive hover:text-destructive flex-shrink-0"
                                    onClick={() => handleDelete(spark.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </Card>
    );
}
