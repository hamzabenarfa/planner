import {  Kanban,  Bolt} from "lucide-react";

export const routes = [
 
  {
    path: "/project/[id]/kanban",
    label: "Kanban ",
    icon: Kanban,
  },
  {
    path: "/project/[id]/setting",
    label: "Setting ",
    icon: Bolt,
  },
];
