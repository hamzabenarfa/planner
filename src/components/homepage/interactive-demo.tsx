"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    DndContext, 
    DragOverlay, 
    useDraggable, 
    useDroppable, 
    DragEndEvent, 
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    KeyboardSensor
} from "@dnd-kit/core";
import { format, addDays, startOfWeek, addHours, isToday } from "date-fns";
import { Plus, Calendar, Lightbulb, CheckCircle2, MoreHorizontal, ArrowRight, Columns, Kanban, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Data ---

type ItemType = "spark" | "task" | "appointment";
type DemoMode = "schedule" | "kanban";

interface Item {
  id: string;
  title: string;
  type: ItemType;
  color: string;
  columnId?: string; // For Kanban
  date?: Date; // For Calendar
  duration?: number; // hours
}

const INITIAL_SPARKS: Item[] = [
  { id: "s1", title: "Launch Q4 Campaign", type: "spark", color: "bg-amber-50 border-amber-200 text-amber-900" },
  { id: "s2", title: "Client Review", type: "spark", color: "bg-purple-50 border-purple-200 text-purple-900" },
  { id: "s3", title: "Update Homepage", type: "spark", color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
];

const INITIAL_TASKS: Item[] = [
  { id: "t1", title: "User Interview", type: "task", columnId: "todo", color: "bg-blue-50 border-blue-200 text-blue-900" },
  { id: "t2", title: "Fix API Bug", type: "task", columnId: "in-progress", color: "bg-red-50 border-red-200 text-red-900" },
  { id: "t3", title: "Design System", type: "task", columnId: "done", color: "bg-green-50 border-green-200 text-green-900" },
];

const INITIAL_APPOINTMENTS: Item[] = [
  { id: "a1", title: "Team Sync", type: "appointment", date: addHours(startOfWeek(new Date()), 10 + 24), duration: 1, color: "bg-green-50 border-green-200 text-green-900" }, 
];

// --- Components ---

function DraggableItem({ item, className, isOverlay }: { item: Item; className?: string, isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item,
    disabled: isOverlay, 
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 rounded-lg border shadow-sm text-sm font-medium cursor-grab active:cursor-grabbing bg-white relative group",
        item.color,
        isDragging ? "opacity-30" : "opacity-100",
        "transition-all hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      {item.title}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20">
        <MoreHorizontal className="w-4 h-4" />
      </div>
    </div>
  );
}

function DroppableCalendarCell({ date, children, onDrop, isTarget }: { date: Date; children: React.ReactNode; onDrop?: (item: Item) => void, isTarget?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `calendar-${date.toISOString()}`,
    data: { date, type: 'calendar-cell' },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[100px] border-r border-b p-2 transition-all relative flex flex-col gap-1",
        isOver ? "bg-indigo-50 ring-2 ring-indigo-200 ring-inset z-10" : "bg-transparent",
        isToday(date) ? "bg-slate-50/50" : ""
      )}
    >
      <div className={cn(
        "text-xs mb-1 font-semibold flex justify-between", 
        isToday(date) ? "text-indigo-600" : "text-slate-400"
      )}>
        {format(date, "d")}
        {isToday(date) && <span className="text-[10px] uppercase tracking-wide">Today</span>}
      </div>
      
      <div className="flex-1 w-full space-y-1.5">
          {children}
      </div>
      
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                Drop to Schedule
            </div>
        </div>
      )}
    </div>
  );
}

function DroppableKanbanColumn({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
    data: { columnId: id, type: 'kanban-column' },
  });

  return (
    <div ref={setNodeRef} className={cn("flex-1 bg-slate-50 rounded-lg p-2 flex flex-col transition-colors", isOver ? "bg-indigo-50/50 ring-2 ring-indigo-200" : "")}>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">{title}</div>
        <div className="flex-1 space-y-2">
            {children}
        </div>
    </div>
  );
}

// --- Main Demo Component ---

export default function InteractiveDemo() {
  const [mode, setMode] = useState<DemoMode>("schedule");
  const [sparks, setSparks] = useState<Item[]>(INITIAL_SPARKS);
  const [tasks, setTasks] = useState<Item[]>(INITIAL_TASKS);
  const [appointments, setAppointments] = useState<Item[]>(INITIAL_APPOINTMENTS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const calendarDays = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveItem(active.data.current as Item);
    setHasInteracted(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    const item = active.data.current as Item;
    const overId = over.id as string;
    const overData = over.data.current;

    // Handle Calendar Drop
    if (overData?.type === 'calendar-cell') {
      const date = overData.date as Date;
      
      if (item.type === "spark") {
        setSparks((prev) => prev.filter((s) => s.id !== item.id));
      }
      
      const newAppointment: Item = {
        ...item,
        id: `apt-${Date.now()}`,
        type: "appointment",
        date: date,
        duration: 1,
        color: item.type === 'spark' ? "bg-indigo-50 border-indigo-200 text-indigo-900" : item.color
      };
      
      setAppointments((prev) => [...prev, newAppointment]);
    }
    
    // Handle Kanban Drop
    if (overData?.type === 'kanban-column') {
        const columnId = overData.columnId as string;
        
        if (item.type === 'task') {
            setTasks(prev => prev.map(t => t.id === item.id ? { ...t, columnId } : t));
        }
    }
  };

  return (
    <div className="flex flex-col-reverse gap-4 w-full h-full ">
        {/* Mode Switcher Tabs */}
        <div className="flex justify-center">
            <div className="bg-slate-100 p-1 rounded-full inline-flex">
                <button
                    onClick={() => setMode("schedule")}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        mode === "schedule" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Calendar className="w-4 h-4" /> Schedule
                </button>
                <button
                    onClick={() => setMode("kanban")}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                        mode === "kanban" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Kanban className="w-4 h-4" /> Kanban
                </button>
            </div>
        </div>

        <div className=" rounded-xl overflow-hidden border border-slate-200 shadow-2xl text-slate-800 font-sans hero-demo select-none relative group h-[400px]">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                
                {/* GUIDANCE OVERLAY */}
                <AnimatePresence>
                    {!hasInteracted && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute z-50 pointer-events-none inset-0 flex items-center justify-center bg-white/0"
                        >
                            <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
                                {mode === "schedule" ? "Drag a Spark to the Calendar" : "Move tasks between columns"} <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {mode === "schedule" ? (
                    // SCHEDULE MODE LAYOUT
                    <div className="flex h-full flex-col md:flex-row">
                        {/* Sparks Panel */}
                        <div className="w-full md:w-1/3 bg-white border-r border-slate-100 p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" /> Sparks
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Capture Ideas</p>
                                </div>
                                <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors" onClick={() => {
                                    setSparks(prev => [{ id: `s-${Date.now()}`, title: "New Idea", type: "spark", color: "bg-yellow-50 border-yellow-200 text-yellow-900" }, ...prev]);
                                }}>
                                <Plus className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                <AnimatePresence mode="popLayout">
                                    {sparks.map((spark) => (
                                    <motion.div
                                        key={spark.id}
                                        layout
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <DraggableItem item={spark} />
                                    </motion.div>
                                    ))}
                                </AnimatePresence>
                                {sparks.length === 0 && <div className="text-xs text-slate-400 text-center py-8 border-2 border-dashed border-slate-100 rounded-lg">All clear!</div>}
                            </div>
                        </div>

                        {/* Calendar Panel */}
                        <div className="flex-1 bg-slate-50/30 p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-indigo-500" /> Schedule
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Turn ideas into time</p>
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50/50">
                                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                                    <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
                                ))}
                                </div>
                                <div className="grid grid-cols-5 flex-1 divide-x divide-slate-100">
                                {calendarDays.map((day, i) => (
                                    <DroppableCalendarCell key={i} date={day}>
                                    {appointments.filter((apt) => apt.date && format(apt.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")).map((apt) => (
                                        <div key={apt.id} className={cn("p-1.5 rounded text-[11px] font-medium leading-tight shadow-sm border border-transparent", apt.color)}>
                                            {apt.title}
                                        </div>
                                    ))}
                                    </DroppableCalendarCell>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // KANBAN MODE LAYOUT
                    <div className="flex h-full p-6 gap-4 bg-slate-50/50">
                         <DroppableKanbanColumn id="todo" title="To Do">
                            {tasks.filter(t => t.columnId === 'todo').map((task) => (
                                <DraggableItem key={task.id} item={task} />
                            ))}
                         </DroppableKanbanColumn>
                         <DroppableKanbanColumn id="in-progress" title="In Progress">
                            {tasks.filter(t => t.columnId === 'in-progress').map((task) => (
                                <DraggableItem key={task.id} item={task} />
                            ))}
                         </DroppableKanbanColumn>
                         <DroppableKanbanColumn id="done" title="Done">
                            {tasks.filter(t => t.columnId === 'done').map((task) => (
                                <DraggableItem key={task.id} item={task} />
                            ))}
                         </DroppableKanbanColumn>
                    </div>
                )}

                <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeItem ? (
                        <div className={cn("p-3 rounded-lg border shadow-2xl text-sm font-medium bg-white scale-105 rotate-3 cursor-grabbing ring-2 ring-indigo-500/20 w-[200px]", activeItem.color)}>
                            <div className="flex items-center gap-2">
                                {activeItem.type === 'spark' && <Lightbulb className="w-3 h-3" />}
                                {activeItem.type === 'task' && <CheckCircle2 className="w-3 h-3" />}
                                {activeItem.title}
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    </div>
  );
}
