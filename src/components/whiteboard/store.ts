import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type ToolType = 'selection' | 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'pencil' | 'text';

export interface WhiteboardElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[]; // For pencil/lines
  text?: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  fillStyle: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed' | 'zigzag-line';
  roughness: number;
}

interface WhiteboardState {
  elements: WhiteboardElement[];
  selectedElementId: string | null;
  tool: ToolType;
  pan: { x: number; y: number };
  zoom: number;
  
  // Actions
  setTool: (tool: ToolType) => void;
  addElement: (element: WhiteboardElement) => void;
  updateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  removeElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setElements: (elements: WhiteboardElement[]) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  elements: [],
  selectedElementId: null,
  tool: 'selection',
  pan: { x: 0, y: 0 },
  zoom: 1,

  setTool: (tool) => set({ tool }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    })),
  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
    })),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setPan: (pan) => set({ pan }),
  setZoom: (zoom) => set({ zoom }),
  setElements: (elements) => set({ elements }),
}));
