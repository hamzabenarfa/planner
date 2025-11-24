import { Task } from "./task.type";
export type { Task };

export type Id = number | string;

export type Column = {
  id: Id;
  name: string;
  tasks?: Task[];
};

