import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { CheckIcon, PencilIcon, TrashIcon } from '@/components/ui/icon';
import { Pressable } from 'react-native';

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
    const dueDateText = task.dueDate.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    return (
        <Card className={`p-4 ${task.completed ? 'bg-accent/30' : 'bg-card'}`}>
            <HStack space="md" className="items-start">
                <Pressable
                    onPress={() => onToggleComplete(task.id)}
                    className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 ${
                        task.completed
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30'
                    } items-center justify-center`}
                >
                    {task.completed && <CheckIcon className="h-4 w-4 text-primary-foreground" />}
                </Pressable>

                <VStack space="xs" className="flex-1">
                    <Text className={`font-semibold ${task.completed ? 'text-textMuted-foreground line-through' : ''}`}>
                        {task.name}
                    </Text>
                    
                    {task.description && (
                        <Text className={`text-sm ${task.completed ? 'text-textMuted-foreground/70' : 'text-textMuted-foreground'}`}>
                            {task.description}
                        </Text>
                    )}

                    <HStack space="sm" className="flex-wrap items-center">
                        <Badge variant="secondary" size="sm">
                            <BadgeText>{task.category}</BadgeText>
                        </Badge>
                        
                        <Text className={`text-xs ${isOverdue ? 'text-destructive' : 'text-textMuted-foreground'}`}>
                            {dueDateText}
                        </Text>
                    </HStack>
                </VStack>

                <HStack space="xs">
                    <Pressable
                        onPress={() => onEdit(task)}
                        className="h-8 w-8 items-center justify-center"
                    >
                        <PencilIcon className="h-4 w-4 text-textMuted-foreground" />
                    </Pressable>
                    <Pressable
                        onPress={() => onDelete(task)}
                        className="h-8 w-8 items-center justify-center"
                    >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                    </Pressable>
                </HStack>
            </HStack>
        </Card>
    );
};

export default TaskCard;

