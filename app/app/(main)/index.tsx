import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { PlusIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { useAppToast } from '@/hooks/use-app-toast';
import { useHandleError } from '@/api/handle-error';
import { 
    useGetAllTasksQuery, 
    useUpdateTaskMutation, 
    useDeleteTaskMutation 
} from '@/api/task-api';
import { useGetAllCategoriesQuery } from '@/api/category-api';
import { useCreateTaskMutation } from '@/api/task-api';
import TaskCard, { Task } from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import TaskDialog from '@/components/TaskDialog';

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);

    const toast = useAppToast();
    const handleError = useHandleError();

    const { data: tasksResponse, isLoading, refetch } = useGetAllTasksQuery();
    const { data: categoriesResponse, refetch: refetchCategories } = useGetAllCategoriesQuery();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const [createTask] = useCreateTaskMutation();

    const categories = useMemo(() => {
        return categoriesResponse?.data?.map(c => c.name) || [];
    }, [categoriesResponse]);

    const tasks = useMemo(() => {
        if (!tasksResponse?.data || !categoriesResponse?.data) return [];
        
        return tasksResponse.data.map((task) => ({
            id: task.id.toString(),
            name: task.name,
            description: task.description,
            completed: task.completed,
            createdDate: new Date(task.createdAt),
            dueDate: new Date(task.dueDate),
            category: categoriesResponse.data.find((c) => c.id === task.categoryId)?.name || '',
        }));
    }, [tasksResponse, categoriesResponse]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'completed' && task.completed) ||
                (statusFilter === 'pending' && !task.completed);

            const matchesCategory =
                categoryFilter === 'all' || task.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [tasks, searchQuery, statusFilter, categoryFilter]);

    const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdDate'> & { id?: string }) => {
        try {
            const categoryData = categoriesResponse?.data;
            const category = categoryData?.find((c) => c.name === taskData.category);
            
            if (!category) {
                toast.error('Category not found');
                return;
            }

            if (taskData.id) {
                // Edit existing task
                await updateTask({
                    id: parseInt(taskData.id),
                    name: taskData.name,
                    description: taskData.description,
                    dueDate: taskData.dueDate.toISOString(),
                    categoryId: category.id,
                    completed: taskData.completed,
                }).unwrap();
                toast.success('Task updated successfully');
            } else {
                // Create new task
                await createTask({
                    name: taskData.name,
                    description: taskData.description,
                    dueDate: taskData.dueDate.toISOString(),
                    categoryId: category.id,
                }).unwrap();
                toast.success('Task created successfully');
            }

            refetch();
            setEditingTask(null);
        } catch (error) {
            console.error(error);
            toast.error(`Error saving task`);
            handleError.handleApiError(error);
        }
    };

    const handleToggleComplete = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        try {
            await updateTask({
                id: parseInt(id),
                completed: !task.completed,
            }).unwrap();

            toast.success(
                task.completed ? 'Task marked as pending' : 'Task completed!'
            );

            refetch();
        } catch (error) {
            toast.error('Error updating task');
            handleError.handleApiError(error);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteTask(parseInt(deletingTask?.id || '0')).unwrap();
            setDeletingTask(null);
            toast.success('Task deleted');
            refetch();
        } catch (error) {
            toast.error('Error deleting task');
            handleError.handleApiError(error);
        }
    };

    const handleAddNew = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                className="px-4"
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
            >
                <VStack space="lg" className="py-4">
                    {/* Header section with title and add button */}
                    <HStack className="items-center justify-between">
                        <VStack>
                            <Heading size="xl">My Tasks</Heading>
                            <Text className="text-textMuted-foreground">
                                Organize and manage your activities
                            </Text>
                        </VStack>
                        <Button
                            onPress={handleAddNew}
                            size="lg"
                            className="gap-2"
                        >
                            <ButtonIcon as={PlusIcon} className="h-5 w-5" />
                            <ButtonText>New Task</ButtonText>
                        </Button>
                    </HStack>

                    {/* Filters */}
                    <TaskFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        categories={categories}
                    />

                    {/* Task list */}
                    <VStack space="md">
                        {isLoading ? (
                            <VStack className="items-center justify-center min-h-[50vh]">
                                <Spinner size="large" />
                            </VStack>
                        ) : filteredTasks.length === 0 ? (
                            <VStack className="items-center justify-center py-12">
                                <Text className="text-textMuted-foreground">
                                    {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                                        ? 'No tasks found with those filters'
                                        : 'No tasks yet. Create your first one!'}
                                </Text>
                            </VStack>
                        ) : (
                            filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleComplete={handleToggleComplete}
                                    onEdit={handleEdit}
                                    onDelete={(task) => setDeletingTask(task)}
                                />
                            ))
                        )}
                    </VStack>
                </VStack>
            </ScrollView>

            {/* Task dialog */}
            <TaskDialog
                open={dialogOpen}
                onOpenChange={(value) => {
                    setDialogOpen(value);
                    if (!value) {
                        setEditingTask(null);
                    }
                }}
                task={editingTask}
                onSave={handleSaveTask}
                categories={categories}
            />
        </SafeAreaView>
    );
}
