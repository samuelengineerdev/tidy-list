import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import Header from "@/components/Header";
import TaskCard, { Task } from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import TaskFilters from "@/components/TaskFilters";
import { Toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { categoryService } from "@/services/categoryService";
import { taskService } from "@/services/taskService";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadCategories = async () => {
    const categoriesData = await categoryService.getAll();
    setCategories(categoriesData.map((c) => c.name));
    return categoriesData;
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        loadCategories(),
      ]);

      const formattedTasks = tasksData.map((task) => ({
        id: task.id.toString(),
        name: task.name,
        description: task.description,
        completed: task.completed,
        createdDate: new Date(task.createdAt),
        dueDate: new Date(task.dueDate),
        category: categoriesData.find((c) => c.id === task.categoryId)?.name || "",
      }));

      setTasks(formattedTasks);
    } catch (error) {
      Toast.error("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && task.completed) ||
        (statusFilter === "pending" && !task.completed);

      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter]);

  const handleSaveTask = async (taskData: Omit<Task, "id" | "createdDate"> & { id?: string }) => {
    try {
      const categoryData = await categoryService.getAll();
      const category = categoryData.find((c) => c.name === taskData.category);
      if (taskData.id) {
        // Edit existing task
        await taskService.update({
          id: parseInt(taskData.id),
          name: taskData.name,
          description: taskData.description,
          dueDate: format(taskData.dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          categoryId: category.id!,
          completed: taskData.completed,
        });
        Toast.success("Task updated successfully");
      } else {
        // Create new task
        await taskService.create({
          name: taskData.name,
          description: taskData.description,
          dueDate: format(taskData.dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          categoryId: category.id!!,
        });
        Toast.success("Task created successfully");
      }

      loadData();
      setEditingTask(null);
    } catch (error) {
      console.error(error);
      Toast.error(`Error saving task: ${error}`);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      await taskService.update({
        id: parseInt(id),
        completed: !task.completed,
      });

      Toast.success(
        task.completed ? "Task marked as pending" : "Task completed!"
      );

      loadData();
    } catch (error) {
      Toast.error("Error updating task");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await taskService.delete(parseInt(deletingTask?.id));
      setDeletingTask(null);
      Toast.success("Task deleted");
      loadData();
    } catch (error) {
      Toast.error("Error deleting task");
    }
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    try {
      const categoryData = await categoryService.getAll();
      const categoryToEdit = categoryData.find((c) => c.name === oldName);

      if (categoryToEdit) {
        await categoryService.update(categoryToEdit.id, { name: newName });
        Toast.success("Category updated");
        loadCategories();
      }
    } catch (error) {
      Toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (name: string) => {
    try {
      const categoryData = await categoryService.getAll();
      const categoryToDelete = categoryData.find((c) => c.name === name);

      if (categoryToDelete) {
        await categoryService.delete(categoryToDelete.id);
        if (editingTask?.category === name) setEditingTask(null);
        Toast.success("Category deleted");
        loadCategories();
      }
    } catch (error) {
      Toast.error("Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header section with title and add button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
              <p className="mt-1 text-muted-foreground">
                Organize and manage your activities
              </p>
            </div>
            <Button
              onClick={handleAddNew}
              size="lg"
              className="gap-2 transition-smooth shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              New Task
            </Button>
          </div>

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
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[50dvh]">
                <Spinner size={10} />
              </div>

            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? "No tasks found with those filters"
                    : "No tasks yet. Create your first one!"}
                </p>
              </div>
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
          </div>
        </div>
      </main>

      {/* Task dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={(value) => {
          setDialogOpen(value);
          loadData();
        }}
        task={editingTask}
        onSave={handleSaveTask}
        categories={categories}
        loadCategories={loadCategories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ConfirmDeleteDialog
        open={!!deletingTask}
        onChange={(open) => !open && setDeletingTask(null)}
        title="Delete Task?"
        description={`This action will delete the task ${deletingTask?.name}. This action cannot be undone.`}
        onCancelButton={() => setDeletingTask(null)}
        onDeleteButton={handleDelete}
      />

    </div>
  );
};

export default Index;
