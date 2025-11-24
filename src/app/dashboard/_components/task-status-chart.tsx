"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskStatusChartProps {
  statusCounts: Record<string, number>;
}

export function TaskStatusChart({ statusCounts }: TaskStatusChartProps) {
  // Map specific keys to colors, fallback for dynamic ones
  const getColor = (status: string) => {
    const map: Record<string, string> = {
      'TODO': '#94a3b8', // slate-400
      'INPROGRESS': '#3b82f6', // blue-500
      'InReview': '#a855f7', // purple-500
      'DONE': '#22c55e', // green-500
    };
    return map[status] || '#cbd5e1';
  };

  const data = {
    labels: Object.keys(statusCounts).map(s => 
        s === 'InReview' ? 'In Review' : 
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    ),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(getColor),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 32, // Fixed width bars for cleaner look
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
            family: "'Inter', sans-serif",
            size: 13
        },
        bodyFont: {
            family: "'Inter', sans-serif",
            size: 13
        },
        displayColors: false,
        callbacks: {
            title: (items: any[]) => items[0].label,
            label: (item: any) => `${item.raw} tasks`
        }
      },
    },
    scales: {
        x: {
            grid: {
                display: false,
                drawBorder: false,
            },
            ticks: {
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                color: '#64748b'
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: '#f1f5f9', // Very subtle grid
                drawBorder: false,
            },
            ticks: {
                precision: 0,
                font: {
                    family: "'Inter', sans-serif",
                    size: 11
                },
                color: '#94a3b8',
                padding: 10
            },
            border: {
                display: false
            }
        }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Task Overview</CardTitle>
        <CardDescription>Distribution across workflows</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] p-2 sm:p-6">
        <div className="h-full w-full">
            {Object.values(statusCounts).reduce((a, b) => a + b, 0) > 0 ? (
                 <Bar data={data} options={options} />
            ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No tasks available
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
