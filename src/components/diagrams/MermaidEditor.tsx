"use client";

import React, { useState, useEffect } from "react";
import MermaidPreview from "./MermaidPreview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createDiagram, updateDiagram } from "@/actions/diagrams";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface MermaidEditorProps {
    projectId: number;
    initialDiagram?: {
        id: number;
        name: string;
        content: string;
    } | null;
    onSave?: () => void;
    onCancel?: () => void;
}

const TEMPLATES = [
    {
        name: "Flowchart",
        code: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]`,
    },
    {
        name: "Sequence Diagram",
        code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
    },
    {
        name: "Class Diagram",
        code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }`,
    },
    {
        name: "State Diagram",
        code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    },
    {
        name: "ER Diagram",
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    },
    {
        name: "Gantt Chart",
        code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    },
    {
        name: "Pie Chart",
        code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
    },
    {
        name: "Mindmap",
        code: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping`,
    },
];

const MermaidEditor: React.FC<MermaidEditorProps> = ({
    projectId,
    initialDiagram,
    onSave,
    onCancel,
}) => {
    const [code, setCode] = useState(initialDiagram?.content || TEMPLATES[0].code);
    const [name, setName] = useState(initialDiagram?.name || "New Diagram");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialDiagram) {
            setCode(initialDiagram.content);
            setName(initialDiagram.name);
        }
    }, [initialDiagram]);

    const handleTemplateChange = (value: string) => {
        const template = TEMPLATES.find((t) => t.name === value);
        if (template) {
            setCode(template.code);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Please enter a diagram name");
            return;
        }
        if (!code.trim()) {
            toast.error("Please enter mermaid code");
            return;
        }

        setIsSaving(true);
        try {
            if (initialDiagram) {
                const result = await updateDiagram(initialDiagram.id, code);
                if (result.success) {
                    toast.success("Diagram updated successfully");
                    onSave?.();
                } else {
                    toast.error(result.error || "Failed to update diagram");
                }
            } else {
                const result = await createDiagram(projectId, name, code);
                if (result.success) {
                    toast.success("Diagram created successfully");
                    onSave?.();
                } else {
                    toast.error(result.error || "Failed to create diagram");
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Diagram Name"
                        className="max-w-xs font-semibold"
                        disabled={!!initialDiagram}
                    />
                    <Select onValueChange={handleTemplateChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Template" />
                        </SelectTrigger>
                        <SelectContent>
                            {TEMPLATES.map((t) => (
                                <SelectItem key={t.name} value={t.name}>
                                    {t.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 gap-4 min-h-0">
                <div className="w-1/2 flex flex-col gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Editor</div>
                    <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 font-mono text-sm resize-none p-4"
                        placeholder="Enter Mermaid code here..."
                    />
                </div>
                <div className="w-1/2 flex flex-col gap-2">
                    <div className="text-sm font-medium text-muted-foreground">Preview</div>
                    <div className="flex-1 border rounded-md bg-white overflow-hidden">
                        <MermaidPreview chart={code} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MermaidEditor;
