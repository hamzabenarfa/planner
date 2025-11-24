"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeDialog } from "./add-employee-dialog";

export const AddEmployeeDialogWrapper = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Member
            </Button>
            <AddEmployeeDialog open={open} onOpenChange={setOpen} />
        </>
    );
};
