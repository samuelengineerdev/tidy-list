import Logo from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import { useLogout, useProfile } from '@/hooks/use-auth';
import { useCategories } from '@/hooks/use-categories';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '@/hooks/use-tasks';
import { ApiError } from '@/services/api';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function TasksScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const logout = useLogout();
  const profileQuery = useProfile();
  const tasksQuery = useTasks();
  const categoriesQuery = useCategories();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [dialogCategoryMenu, setDialogCategoryMenu] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategoryId, setTaskCategoryId] = useState<number | null>(null);
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);

  const categories = useMemo(() => categoriesQuery.data?.data ?? [], [categoriesQuery.data]);
  const mappedTasks = useMemo(() => {
    const tasks = tasksQuery.data?.data ?? [];
    return tasks.map((task) => {
      const category = categories.find((item) => item.id === task.categoryId)?.name ?? 'Uncategorized';
      return {
        id: task.id,
        name: task.name,
        description: task.description ?? '',
        category,
        categoryId: task.categoryId,
        status: task.completed ? 'completed' : 'pending',
        due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
        dueDateRaw: task.dueDate,
      } as const;
    });
  }, [tasksQuery.data, categories]);

  const filteredTasks = useMemo(() => {
    return mappedTasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [mappedTasks, searchQuery, statusFilter, categoryFilter]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const resetDialogForm = () => {
    setEditingTaskId(null);
    setTaskName('');
    setTaskDescription('');
    setTaskCategoryId(categories[0]?.id ?? null);
    setTaskDueDate('');
    setTaskCompleted(false);
    setDialogCategoryMenu(false);
  };

  const openCreateDialog = () => {
    setActionError(null);
    resetDialogForm();
    setTaskDialogOpen(true);
  };

  const openEditDialog = (taskId: number) => {
    setActionError(null);
    const task = mappedTasks.find((item) => item.id === taskId);
    if (!task) return;

    setEditingTaskId(task.id);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskCategoryId(task.categoryId);
    setTaskDueDate(task.dueDateRaw ? new Date(task.dueDateRaw).toISOString().slice(0, 10) : '');
    setTaskCompleted(task.status === 'completed');
    setDialogCategoryMenu(false);
    setTaskDialogOpen(true);
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    setActionError(null);
    try {
      await updateTaskMutation.mutateAsync({ id: taskId, completed: !completed });
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Could not update task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setActionError(null);
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Could not delete task.');
    }
  };

  const handleSaveTask = async () => {
    setActionError(null);

    if (!taskName.trim()) {
      setActionError('Task name is required.');
      return;
    }

    if (!taskCategoryId) {
      setActionError('Please select a category.');
      return;
    }

    try {
      if (editingTaskId) {
        await updateTaskMutation.mutateAsync({
          id: editingTaskId,
          name: taskName.trim(),
          description: taskDescription.trim(),
          categoryId: taskCategoryId,
          dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
          completed: taskCompleted,
        });
      } else {
        await createTaskMutation.mutateAsync({
          name: taskName.trim(),
          description: taskDescription.trim(),
          categoryId: taskCategoryId,
          dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
        });
      }

      setTaskDialogOpen(false);
      resetDialogForm();
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : 'Could not save task.');
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB] dark:bg-[#1A1A1A]">
      <View className="border-b border-[#E2E8F0] bg-white/95 px-4 pb-3 pt-12 dark:border-[#333333] dark:bg-[#242424]/95">
        <View className="flex-row items-center justify-between">
          <Logo />
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setColorScheme(isDark ? 'light' : 'dark')}
              className="h-10 w-10 items-center justify-center rounded-lg bg-[#F0F9FF] dark:bg-[#0A334D]"
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={isDark ? '#FAFAFA' : '#1A1A1A'}
              />
            </Pressable>
            <Pressable
              onPress={handleLogout}
              className="h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40"
            >
              <Ionicons name="log-out-outline" size={18} color={isDark ? '#F87171' : '#DC2626'} />
            </Pressable>
          </View>
        </View>
        <Text className="mt-2 text-xs text-[#737373] dark:text-[#A3A3A3]">
          {profileQuery.data?.data?.email ? `Signed in as ${profileQuery.data.data.email}` : 'Signed in'}
        </Text>
      </View>

      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="py-6">
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-[#1A1A1A] dark:text-[#FAFAFA]">My Tasks</Text>
              <Text className="mt-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                Organize and manage your activities
              </Text>
            </View>
            <Pressable onPress={openCreateDialog} className="rounded-lg bg-[#F99437] px-4 py-3">
              <Text className="font-semibold text-white">
                + New Task
              </Text>
            </Pressable>
          </View>

          <View className="mb-5 gap-3">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tasks..."
              placeholderTextColor={isDark ? '#A3A3A3' : '#737373'}
              className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#1A1A1A] dark:border-[#333333] dark:bg-[#242424] dark:text-[#FAFAFA]"
            />

            <View className="flex-row flex-wrap gap-2">
              {(['all', 'pending', 'completed'] as const).map((status) => {
                const selected = statusFilter === status;
                return (
                  <Pressable
                    key={status}
                    onPress={() => setStatusFilter(status)}
                    className={`rounded-lg border px-3 py-2 ${
                      selected
                        ? 'border-[#F99437] bg-[#F99437]'
                        : 'border-[#E2E8F0] bg-white dark:border-[#333333] dark:bg-[#242424]'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? 'text-white' : 'text-[#1A1A1A] dark:text-[#FAFAFA]'
                      }`}
                    >
                      {status[0].toUpperCase() + status.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setShowCategoryMenu((prev) => !prev)}
                className="rounded-lg border border-[#4B357D] bg-[#F0F9FF] px-3 py-2 dark:border-[#6846A3] dark:bg-[#0A334D]"
              >
                <Text className="text-sm font-medium text-[#4B357D] dark:text-[#C9B8EA]">
                  {categoryFilter === 'all' ? 'Category: All' : `Category: ${categoryFilter}`}
                </Text>
              </Pressable>
            </View>
            {showCategoryMenu ? (
              <View className="rounded-lg border border-[#E2E8F0] bg-white p-2 dark:border-[#333333] dark:bg-[#242424]">
                {['all', ...categories.map((item) => item.name)].map((category) => {
                  const selected = categoryFilter === category;
                  return (
                    <Pressable
                      key={category}
                      onPress={() => {
                        setCategoryFilter(category);
                        setShowCategoryMenu(false);
                      }}
                      className={`rounded-md px-3 py-2 ${
                        selected ? 'bg-[#4B357D]' : 'bg-transparent'
                      }`}
                    >
                      <Text className={`text-sm ${selected ? 'text-white' : 'text-[#1A1A1A] dark:text-[#FAFAFA]'}`}>
                        {category === 'all' ? 'All categories' : category}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
          {actionError ? (
            <Text className="mb-4 text-sm text-red-600 dark:text-red-400">{actionError}</Text>
          ) : null}
          {tasksQuery.isLoading || categoriesQuery.isLoading ? (
            <Text className="mb-4 text-sm text-[#737373] dark:text-[#A3A3A3]">Loading tasks...</Text>
          ) : null}

          <View className="gap-3">
            {filteredTasks.map((task) => {
              const completed = task.status === 'completed';
              return (
                <View
                  key={String(task.id)}
                  className={`rounded-xl border p-4 ${
                    completed
                      ? 'border-[#D9EAF7] bg-[#F0F9FF]/70 dark:border-[#23404F] dark:bg-[#0A334D]/40'
                      : 'border-[#E2E8F0] bg-white dark:border-[#333333] dark:bg-[#242424]'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center gap-2">
                        <Pressable
                          onPress={() => handleToggleComplete(task.id, completed)}
                          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                            completed
                              ? 'border-[#F99437] bg-[#F99437]'
                              : 'border-[#A3A3A3] dark:border-[#737373]'
                          }`}
                        >
                          {completed ? <Text className="text-xs font-bold text-white">✓</Text> : null}
                        </Pressable>
                        <Text
                          className={`text-base font-semibold ${
                            completed
                              ? 'text-[#737373] line-through dark:text-[#A3A3A3]'
                              : 'text-[#1A1A1A] dark:text-[#FAFAFA]'
                          }`}
                        >
                          {task.name}
                        </Text>
                      </View>
                      <Text className="mt-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                        {task.description}
                      </Text>
                      <View className="mt-3 flex-row items-center gap-2">
                        <View className="rounded-md bg-[#4B357D]/15 px-2 py-1 dark:bg-[#6846A3]/25">
                          <Text className="text-xs font-medium text-[#4B357D] dark:text-[#C9B8EA]">
                            {task.category}
                          </Text>
                        </View>
                        <Text className="text-xs font-medium text-[#F99437]">Due {task.due}</Text>
                      </View>
                    </View>

                    <View className="items-end gap-2">
                      <View className="flex-row gap-2">
                        <Pressable
                          onPress={() => openEditDialog(task.id)}
                          className="h-8 w-8 items-center justify-center rounded-md bg-[#F0F9FF] dark:bg-[#0A334D]"
                        >
                          <Ionicons name="create-outline" size={15} color={isDark ? '#FAFAFA' : '#1A1A1A'} />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDeleteTask(task.id)}
                          className="h-8 w-8 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/40"
                        >
                          <Ionicons name="trash-outline" size={15} color={isDark ? '#F87171' : '#DC2626'} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            {filteredTasks.length === 0 ? (
              <View className="rounded-xl border border-dashed border-[#E2E8F0] p-8 dark:border-[#333333]">
                <Text className="text-center text-sm text-[#737373] dark:text-[#A3A3A3]">
                  No tasks found with those filters
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal visible={taskDialogOpen} animationType="fade" transparent onRequestClose={() => setTaskDialogOpen(false)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-4">
          <View className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-[#333333] dark:bg-[#242424]">
            <Text className="text-xl font-bold text-[#1A1A1A] dark:text-[#FAFAFA]">
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </Text>
            <Text className="mt-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
              {editingTaskId ? 'Edit your task details' : 'Create a new task'}
            </Text>

            <View className="mt-4 gap-3">
              <View>
                <Text className="mb-1 text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Name</Text>
                <TextInput
                  value={taskName}
                  onChangeText={setTaskName}
                  placeholder="Task name"
                  placeholderTextColor={isDark ? '#A3A3A3' : '#737373'}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-3 py-3 text-[#1A1A1A] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-[#FAFAFA]"
                />
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Description</Text>
                <TextInput
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  placeholder="Describe your task..."
                  placeholderTextColor={isDark ? '#A3A3A3' : '#737373'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="min-h-[88px] rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-3 py-3 text-[#1A1A1A] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-[#FAFAFA]"
                />
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Category</Text>
                <Pressable
                  onPress={() => setDialogCategoryMenu((prev) => !prev)}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-3 py-3 dark:border-[#333333] dark:bg-[#1A1A1A]"
                >
                  <Text className="text-[#1A1A1A] dark:text-[#FAFAFA]">
                    {categories.find((item) => item.id === taskCategoryId)?.name ?? 'Select a category'}
                  </Text>
                </Pressable>
                {dialogCategoryMenu ? (
                  <View className="mt-2 rounded-lg border border-[#E2E8F0] bg-white p-2 dark:border-[#333333] dark:bg-[#242424]">
                    {categories.map((item) => {
                      const selected = item.id === taskCategoryId;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => {
                            setTaskCategoryId(item.id);
                            setDialogCategoryMenu(false);
                          }}
                          className={`rounded-md px-3 py-2 ${selected ? 'bg-[#4B357D]' : 'bg-transparent'}`}
                        >
                          <Text className={`${selected ? 'text-white' : 'text-[#1A1A1A] dark:text-[#FAFAFA]'}`}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Due date</Text>
                <TextInput
                  value={taskDueDate}
                  onChangeText={setTaskDueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? '#A3A3A3' : '#737373'}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-3 py-3 text-[#1A1A1A] dark:border-[#333333] dark:bg-[#1A1A1A] dark:text-[#FAFAFA]"
                />
              </View>
            </View>

            <View className="mt-5 flex-row justify-end gap-2">
              <Pressable
                onPress={() => setTaskDialogOpen(false)}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 dark:border-[#333333]"
              >
                <Text className="font-medium text-[#1A1A1A] dark:text-[#FAFAFA]">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveTask}
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                className="rounded-lg bg-[#F99437] px-4 py-2 disabled:opacity-60"
              >
                <Text className="font-medium text-white">
                  {createTaskMutation.isPending || updateTaskMutation.isPending
                    ? 'Saving...'
                    : editingTaskId
                      ? 'Save changes'
                      : 'Create task'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
