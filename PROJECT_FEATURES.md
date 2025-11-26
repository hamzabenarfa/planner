# Project Features Summary

This project is a comprehensive **Project Management & Planning Application** built with **Next.js**, designed to help teams and individuals organize tasks, manage projects, and visualize ideas.

## 🚀 Core Features

### 1. Project Management
- **Projects**: Create and manage multiple projects with status tracking (Building, Started, Pending, etc.).
- **Kanban Boards**: Interactive drag-and-drop boards for task management using `@dnd-kit`.
  - Custom columns (Todo, In Progress, Review, Done).
  - Task creation, editing, and assignment.
- **Burn Down Charts**: Visual progress tracking using `chart.js` to monitor sprint/project velocity.
- **Text/Board Views**: Multiple ways to view project content.

### 2. Team & Member Management
- **Teams**: Create teams and assign owners.
- **Member Directory**: Manage employees/members with roles (Admin, Manager, Member) and levels.
- **Assignments**: Assign members to specific teams and projects.
- **Role-Based Access Control**: Secure access based on user roles.

### 3. Calendar & Scheduling
- **Full Calendar View**: Monthly/Weekly/Daily views for managing schedule.
- **Appointments**:
  - Create events with priority, category (Work, Personal, Meeting, etc.), and location/meeting links.
  - **Recurring Events**: Support for repeating schedules.
  - **Reminders**: Notification system for upcoming appointments.
- **Sparks**: Quick idea capture widget, optionally linked to appointments.

### 4. Visual Collaboration Tools
- **Whiteboard**: Integrated interactive whiteboard for brainstorming and sketching.
  - Built with `perfect-freehand` and `roughjs`.
  - Custom toolbar for drawing tools.
- **Diagrams**: Built-in support for creating and editing technical diagrams using **Mermaid.js**.
  - Live editor and preview mode.

### 5. Dashboard & Analytics
- **Overview Dashboard**: High-level view of:
  - Recent Projects.
  - Project Status Charts.
  - Task Status Distribution.
  - Key Statistics Cards.
- **Profile Management**: User profile customization.

### 6. Authentication & Security
- **Secure Auth**: Powered by **NextAuth.js** (v5).
- **User Sessions**: Secure session management with Prisma adapter.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS, Framer Motion, shadcn/ui components
- **State Management**: Zustand, React Query
- **Visualization**: Chart.js, Mermaid.js
- **Interactions**: @dnd-kit (Drag & Drop)

