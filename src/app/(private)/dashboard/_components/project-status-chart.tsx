"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Status } from "@prisma/client";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProjectStatusChartProps {
  statusCounts: Record<Status, number>;
}

export function ProjectStatusChart({ statusCounts }: ProjectStatusChartProps) {
  // Modern color palette
  const backgroundColors = {
    [Status.BUILDING]: "#8b5cf6", // violet-500
    [Status.STARTED]: "#3b82f6", // blue-500
    [Status.PENDING]: "#eab308", // yellow-500
    [Status.STOPPED]: "#ef4444", // red-500
    [Status.INPROGRESS]: "#22c55e", // green-500
  };

  const totalProjects = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const data = {
    labels: Object.keys(statusCounts).map(s => s.charAt(0) + s.slice(1).toLowerCase()),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (status) => backgroundColors[status as Status] || "#94a3b8"
        ),
        borderWidth: 0, // No border for cleaner look
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%", // Thinner ring
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                    size: 12,
                    family: "'Inter', sans-serif",
                },
                color: '#64748b' // slate-500
            }
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
                label: function(context: any) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const percentage = totalProjects > 0 ? Math.round((value / totalProjects) * 100) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-medium">Project Distribution</CardTitle>
        <CardDescription>By Current Status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full relative flex items-center justify-center mt-4">
            {totalProjects > 0 ? (
                 <>
                    <Doughnut data={data} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-foreground">{totalProjects}</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
                    </div>
                 </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p className="text-sm">No projects found</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
