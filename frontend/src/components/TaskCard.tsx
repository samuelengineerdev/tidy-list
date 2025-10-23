import { Check, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getTaskStatusClass } from "@/lib/utils";

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdDate: Date;
  dueDate: Date;
  category: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const isOverdue = !task.completed && new Date() > task.dueDate;

  return (
    <Card
      className={`p-4 transition-smooth hover:shadow-md ${
        task.completed ? "bg-accent/30" : "bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 transition-smooth ${
            task.completed
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-muted-foreground/30 hover:border-primary"
          }`}
        >
          {task.completed && <Check className="h-4 w-4" />}
        </Button>

        <div className="flex-1 space-y-2">
          <div>
            <h3
              className={`font-semibold transition-smooth ${
                task.completed ? "text-muted-foreground line-through" : ""
              }`}
            >
              {task.name}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${
                  task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
                }`}
              >
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="transition-smooth">
              {task.category}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className={`${getTaskStatusClass(task)} font-medium`}>
                {format(task.dueDate, "d MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 transition-smooth hover:bg-secondary/20 hover:text-secondary"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            className="h-8 w-8 transition-smooth hover:bg-destructive/20 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
