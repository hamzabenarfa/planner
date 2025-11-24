"use client";

import { ViewSwitcher } from "./_components/view-switcher";

const ProjectIdLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex flex-col overflow-hidden gap-4">
            <ViewSwitcher />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ProjectIdLayout;
