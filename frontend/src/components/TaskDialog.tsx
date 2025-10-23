import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Task } from "./TaskCard";
import { categoryService } from "@/services/categoryService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";
import { Toast } from "./Toast";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (task: Omit<Task, "id" | "createdDate"> & { id?: string }) => void;
  categories: string[];
  loadCategories: () => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const TaskDialog = ({ open, onOpenChange, task, onSave, categories, loadCategories, onEditCategory, onDeleteCategory }: TaskDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [openCategoryCombo, setOpenCategoryCombo] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setCategory(task.category);
      setDueDate(task.dueDate);
    } else {
      setName("");
      setDescription("");
      setCategory("");
      setDueDate(new Date());
    }
    setSearchCategory("")
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      id: task?.id,
      name,
      description,
      category,
      dueDate,
      completed: task?.completed || false,
    });

    onOpenChange(false);
  };

  const handleCreateCategory = async (newCategory: string) => {
    try {
      const category = await categoryService.create({ name: newCategory });
      loadCategories();
      setCategory(category.name);
      setSearchCategory("");
    } catch (error) {
      Toast.error(error instanceof Error ? error.message : "Request failed");
      console.error("Error creando categoría", error);
    }
  };

  const handleEditClick = (category: string) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };

  const handleSaveEdit = () => {
    if (editingCategory && newCategoryName.trim() && onEditCategory) {
      onEditCategory(editingCategory, newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName("");
    }
  };

  const handleDeleteClick = (category: string) => {
    setDeletingCategory(category);
  };

  const handleConfirmDelete = () => {
    if (deletingCategory && onDeleteCategory) {
      onDeleteCategory(deletingCategory);
      setDeletingCategory(null);
      if (category === deletingCategory) {
        setCategory("");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
            <DialogDescription>
              {task ? "Edit your task details" : "Create a new task"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your task..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Popover open={openCategoryCombo} onOpenChange={setOpenCategoryCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategoryCombo}
                    className="w-full justify-between"
                  >
                    {category || "Select a category"}
                    <Check className={cn("ml-2 h-4 w-4", category ? "opacity-100" : "opacity-0")} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search or create category..."
                      value={searchCategory}
                      onValueChange={setSearchCategory}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <button
                          onClick={() => {
                            if (searchCategory.trim()) {
                              handleCreateCategory(searchCategory.trim());

                            }
                          }}
                          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Create "{searchCategory}"
                        </button>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories?.map((cat, index) => (
                          <CommandItem
                            key={`${cat}-${index}`}
                            value={cat}
                            onSelect={(currentValue) => {
                              setCategory(currentValue);
                              setOpenCategoryCombo(false);
                              setSearchCategory("");
                            }}
                            className="flex justify-between items-center group cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category === cat ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {cat}
                            </div>

                            {/* right-side actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(cat);
                                }}
                                className="hover:text-primary"
                                title="Edit category"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(cat);
                                }}
                                className="hover:text-destructive"
                                title="Delete category"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>

                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP", { locale: es })
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    disabled={{ before: new Date() }}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="flex flex-col xs:flex-row xs:justify-end gap-2 xs:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !description || !category}>
              {task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Change the category name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!newCategoryName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingCategory}
        onChange={(open) => !open && setDeletingCategory(null)}
        title="Delete Category?"
        description={`This action will delete the category ${deletingCategory} and all associated tasks. This action cannot be undone.`}
        onCancelButton={() => setDeletingCategory(null)}
        onDeleteButton={handleConfirmDelete}
      />

    </>
  );
};

export default TaskDialog;
