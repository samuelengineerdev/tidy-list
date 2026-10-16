import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, Redirect } from 'expo-router';
import Logo from './components/Logo';
import { useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useColorScheme } from 'nativewind';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task } from '../services/taskService';
import { categoryService, Category } from '../services/categoryService';
import TaskDialog from './components/TaskDialog';

export default function Home() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { isAuthenticated, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAll,
  });

  // Fetch categories
  const { data: categories = [], refetch: loadCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // Map categoryId → name
  const getCategoryName = (categoryId: number) => {
    return categories.find((c: Category) => c.id === categoryId)?.name || '';
  };

  // Client-side filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && task.completed) ||
        (statusFilter === 'pending' && !task.completed);

      const matchesCategory =
        categoryFilter === 'all' || getCategoryName(task.categoryId) === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tasks, categories, searchQuery, statusFilter, categoryFilter]);

  // Task Mutations
  const toggleMutation = useMutation({
    mutationFn: (task: Task) => taskService.update({ id: task.id, completed: !task.completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to update task'),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: Parameters<typeof taskService.update>[0]) => taskService.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to update task'),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: Parameters<typeof taskService.create>[0]) => taskService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to create task'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to delete task'),
  });

  // Category Mutations
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => categoryService.update(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to update category'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to delete category'),
  });

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { id?: number }) => {
    if (taskData.id) {
      updateTaskMutation.mutate(taskData as any);
    } else {
      createTaskMutation.mutate(taskData as any);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task?', `Are you sure you want to delete "${task.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(task.id) },
    ]);
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const cat = categories.find((c: Category) => c.name === oldName);
    if (cat) {
      updateCategoryMutation.mutate({ id: cat.id, name: newName });
    }
  };

  const handleDeleteCategory = (name: string) => {
    const cat = categories.find((c: Category) => c.name === name);
    if (cat) {
      deleteCategoryMutation.mutate(cat.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isDark = colorScheme === 'dark';
  const mutedColor = isDark ? '#a1a1aa' : '#6b7280';
  const headerIconColor = isDark ? '#fafafa' : '#1a1a1a';

  const statusButtons: { key: 'all' | 'pending' | 'completed'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  const categoryNames = categories.map((c: Category) => c.name);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <Logo />
        <View className="flex-row items-center gap-4">
          <Pressable className="p-2 rounded-full active:bg-accent dark:active:bg-accent-dark" onPress={toggleColorScheme}>
            <Feather name={isDark ? 'sun' : 'moon'} size={20} color={headerIconColor} />
          </Pressable>
          <Pressable
            className="p-2 rounded-full active:bg-destructive/30"
            onPress={() => { logout(); router.replace('/(auth)/login'); }}
          >
            <Feather name="log-out" size={20} color={headerIconColor} />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 px-4 pt-6">

        {/* Title Area */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground-dark">My Tasks</Text>
            <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-1 text-sm">Organize and manage your activities</Text>
          </View>
          <Pressable onPress={handleAddNew} className="bg-primary px-4 py-2 rounded-md flex-row items-center gap-2 shadow-sm">
            <Feather name="plus" size={18} color="white" />
            <Text className="text-primary-foreground font-medium">New Task</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View className="flex-row my-2">
          <View className="flex-1 flex-row items-center bg-card dark:bg-card-dark border border-input dark:border-input-dark rounded-md px-3 h-10">
            <Feather name="search" size={16} color={mutedColor} />
            <TextInput
              placeholder="Search tasks..."
              placeholderTextColor={mutedColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-foreground dark:text-foreground-dark h-full py-0"
              textAlignVertical="center"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Feather name="x" size={16} color={mutedColor} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Status Filter Buttons */}
        <View className="flex-row gap-2 mt-3 mb-1">
          {statusButtons.map(btn => (
            <Pressable
              key={btn.key}
              onPress={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-md border ${
                statusFilter === btn.key
                  ? 'bg-primary border-primary'
                  : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
              }`}
            >
              <Text className={`text-sm font-medium ${
                statusFilter === btn.key
                  ? 'text-primary-foreground'
                  : 'text-foreground dark:text-foreground-dark'
              }`}>
                {btn.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Category Filter */}
        {categoryNames.length > 1 && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 mb-3">
              <View className="flex-row gap-2">
              <Pressable
                onPress={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full border ${
                  categoryFilter === 'all'
                    ? 'bg-secondary border-secondary'
                    : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                }`}
              >
                <Text className={`text-xs font-medium ${
                  categoryFilter === 'all'
                    ? 'text-secondary-foreground'
                    : 'text-foreground dark:text-foreground-dark'
                }`}>All Categories</Text>
              </Pressable>
              {categoryNames.map((name: string) => (
                <Pressable
                  key={name}
                  onPress={() => setCategoryFilter(name)}
                  className={`px-3 py-1.5 rounded-full border ${
                    categoryFilter === name
                      ? 'bg-secondary border-secondary'
                      : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                  }`}
                >
                  <Text className={`text-xs font-medium ${
                    categoryFilter === name
                      ? 'text-secondary-foreground'
                      : 'text-foreground dark:text-foreground-dark'
                  }`}>{name}</Text>
                </Pressable>
              ))}
            </View>
            </ScrollView>
          </View>
        )}

        {/* Task List */}
        <ScrollView className="flex-1 mt-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {tasksLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color={isDark ? '#f5a623' : '#e8952a'} />
              <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-3">Loading tasks...</Text>
            </View>
          ) : filteredTasks.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Feather name="inbox" size={48} color={mutedColor} />
              <Text className="text-muted-foreground dark:text-muted-dark-foreground mt-3 text-base">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No tasks found with those filters'
                  : 'No tasks yet. Create your first one!'}
              </Text>
            </View>
          ) : (
            filteredTasks.map((task: Task) => {
              const catName = getCategoryName(task.categoryId);
              return (
                <Pressable
                  key={task.id}
                  className={`p-4 rounded-xl border border-border dark:border-border-dark flex-row items-start gap-3 mb-3 ${
                    task.completed
                      ? 'bg-accent/30 dark:bg-accent-dark/30'
                      : 'bg-card dark:bg-card-dark'
                  }`}
                >
                  {/* Checkbox */}
                  <Pressable
                    onPress={() => toggleMutation.mutate(task)}
                    className={`mt-1 h-6 w-6 rounded-full border-2 items-center justify-center ${
                      task.completed
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30 dark:border-muted-dark-foreground/30'
                    }`}
                  >
                    {task.completed && <Feather name="check" size={14} color="white" />}
                  </Pressable>

                  <View className="flex-1">
                    <Text className={`font-semibold text-base ${
                      task.completed
                        ? 'text-muted-foreground dark:text-muted-dark-foreground line-through'
                        : 'text-card-foreground dark:text-card-dark-foreground'
                    }`}>
                      {task.name}
                    </Text>
                    {task.description ? (
                      <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
                        {task.description}
                      </Text>
                    ) : null}

                    <View className="flex-row items-center flex-wrap gap-2 mt-3">
                      {catName ? (
                        <View className="bg-secondary/10 dark:bg-secondary-dark/10 px-2 flex items-center justify-center py-0.5 rounded-full border border-secondary/20 dark:border-secondary-dark/20">
                          <Text className="text-secondary dark:text-secondary-dark text-xs font-medium">{catName}</Text>
                        </View>
                      ) : null}
                      <View className="flex-row items-center gap-1">
                        <Feather name="calendar" size={12} color={mutedColor} />
                        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground font-medium">
                          {formatDate(task.dueDate)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-1">
                    <Pressable className="p-2 rounded-md" onPress={() => handleEdit(task)}>
                      <Feather name="edit-2" size={16} color={mutedColor} />
                    </Pressable>
                    <Pressable className="p-2 rounded-md" onPress={() => handleDelete(task)}>
                      <Feather name="trash-2" size={16} color={mutedColor} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>

      </View>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
        categories={categories}
        loadCategories={loadCategories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </View>
  );
}
