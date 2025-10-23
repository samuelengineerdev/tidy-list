import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTaskStatusClass(task: { completed: boolean; dueDate: string | Date }): string {
  const today = new Date();
  const dueDate = new Date(task.dueDate);

  // Normalize both dates to remove time (hours, minutes, seconds)
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (task.completed) {
    return "text-muted-foreground"; // Task is completed
  }

  if (dueDate.getTime() < today.getTime()) {
    return "text-destructive"; // Task is overdue
  }

  if (dueDate.getTime() === today.getTime()) {
    return "text-primary"; // Task is due today
  }

  return ""; // Task is upcoming (future)
}
