import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Pressable, Modal, 
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { Task } from '../../services/taskService';
import { Category, categoryService } from '../../services/categoryService';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { id?: number }) => void;
  categories: Category[];
  loadCategories: () => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

export default function TaskDialog({
  open, onOpenChange, task, onSave, categories, loadCategories, onEditCategory, onDeleteCategory
}: TaskDialogProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#fafafa' : '#1a1a1a';
  const mutedColor = isDark ? '#a1a1aa' : '#6b7280';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  
  // Modals state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');

  // Edit Category state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (open) {
      if (task) {
        setName(task.name);
        setDescription(task.description);
        setDueDate(new Date(task.dueDate));
      } else {
        setName('');
        setDescription('');
        setCategoryName('');
        setDueDate(new Date());
      }
      setSearchCategory('');
    }
  }, [open, task]);

  useEffect(() => {
    if (open && task && !categoryName && categories.length > 0) {
      const cat = categories.find(c => c.id === task.categoryId);
      if (cat) setCategoryName(cat.name);
    }
  }, [open, task, categories, categoryName]);

  const handleSave = () => {
    if (!name.trim() || !categoryName) {
      Alert.alert('Validation Error', 'Name and Category are required.');
      return;
    }
    
    const cat = categories.find(c => c.name === categoryName);
    if (!cat) return; // Should not happen if correctly selected

    onSave({
      id: task?.id,
      name,
      description,
      categoryId: cat.id,
      dueDate: dueDate.toISOString(),
      completed: task?.completed || false,
    });
    
    onOpenChange(false);
  };

  const handleCreateCategory = async (newCatName: string) => {
    try {
      const created = await categoryService.create({ name: newCatName });
      loadCategories();
      setCategoryName(created.name);
      setShowCategoryModal(false);
      setSearchCategory('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create category');
    }
  };

  const handleSaveEditCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      onEditCategory(editingCategory, newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName('');
      if (categoryName === editingCategory) {
        setCategoryName(newCategoryName.trim());
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDueDate(selectedDate);
  };

  const openDateModal = () => setShowDatePicker(true);

  if (!open) return null;

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase()));

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-center bg-black/50 p-4">
        
        {/* Main Dialog Content */}
        {!showCategoryModal && !editingCategory && (
          <View className="bg-card dark:bg-card-dark rounded-xl w-full max-w-md mx-auto overflow-hidden border border-border dark:border-border-dark">
            <View className="p-5 border-b border-border dark:border-border-dark">
              <Text className="text-xl font-bold text-foreground dark:text-foreground-dark">{task ? "Edit Task" : "New Task"}</Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-1">
                {task ? "Edit your task details" : "Create a new task"}
              </Text>
            </View>

            <ScrollView className="max-h-[60vh] p-5">
              
              <View className="space-y-2 mb-4">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Task name"
                  placeholderTextColor={mutedColor}
                  className="w-full h-12 px-4 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                />
              </View>

              <View className="space-y-2 mb-4">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your task..."
                  placeholderTextColor={mutedColor}
                  multiline
                  numberOfLines={3}
                  className="w-full min-h-[80px] p-4 pt-3 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  textAlignVertical="top"
                />
              </View>

              <View className="space-y-2 mb-4">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">Category</Text>
                <Pressable 
                  onPress={() => setShowCategoryModal(true)}
                  className="w-full h-12 px-4 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark flex-row items-center justify-between"
                >
                  <Text className={categoryName ? "text-foreground dark:text-foreground-dark" : "text-muted-foreground dark:text-muted-dark-foreground"}>
                    {categoryName || "Select a category"}
                  </Text>
                  <Feather name="chevron-down" size={18} color={mutedColor} />
                </Pressable>
              </View>

              <View className="space-y-2 mb-4">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">Due date</Text>
                <Pressable 
                  onPress={openDateModal}
                  className="w-full h-12 px-4 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark flex-row items-center"
                >
                  <Feather name="calendar" size={16} color={mutedColor} className="mr-2" />
                  <Text className="text-foreground dark:text-foreground-dark ml-2">
                    {dueDate.toLocaleDateString()}
                  </Text>
                </Pressable>
              </View>

            </ScrollView>

            <View className="p-5 border-t border-border dark:border-border-dark flex-row justify-end space-x-3 gap-3">
              <Pressable 
                onPress={() => onOpenChange(false)}
                className="px-4 py-2 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark"
              >
                <Text className="text-foreground dark:text-foreground-dark font-medium">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleSave}
                disabled={!name.trim() || !categoryName}
                className={`px-4 py-2 rounded-md flex-row items-center justify-center ${(!name.trim() || !categoryName) ? 'bg-primary/50' : 'bg-primary'}`}
              >
                <Text className="text-primary-foreground font-medium">{task ? "Save changes" : "Create task"}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Date Picker (renders naturally on iOS, over app on Android) */}
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        )}

        {/* Category Selection Modal */}
        {showCategoryModal && !editingCategory && (
          <View className="bg-card dark:bg-card-dark rounded-xl w-full max-w-md mx-auto overflow-hidden border border-border dark:border-border-dark p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">Select Category</Text>
              <Pressable onPress={() => setShowCategoryModal(false)}>
                <Feather name="x" size={24} color={mutedColor} />
              </Pressable>
            </View>

            <View className="flex-row items-center bg-background dark:bg-background-dark border border-input dark:border-input-dark rounded-md px-3 h-10 mb-4">
              <TextInput
                placeholder="Search or create category..."
                placeholderTextColor={mutedColor}
                value={searchCategory}
                onChangeText={setSearchCategory}
                className="flex-1 text-foreground dark:text-foreground-dark h-full"
              />
            </View>

            <ScrollView className="max-h-[40vh] mb-4">
              {searchCategory.trim().length > 0 && !categories.find(c => c.name.toLowerCase() === searchCategory.trim().toLowerCase()) && (
                <Pressable 
                  onPress={() => handleCreateCategory(searchCategory.trim())}
                  className="flex-row items-center p-3 rounded-md active:bg-accent dark:active:bg-accent-dark mb-1"
                >
                  <Feather name="plus" size={16} color={textColor} />
                  <Text className="text-foreground dark:text-foreground-dark ml-2">Create "{searchCategory.trim()}"</Text>
                </Pressable>
              )}

              {filteredCategories.map((c) => (
                <View key={c.id} className="flex-row items-center justify-between p-3 rounded-md active:bg-accent dark:active:bg-accent-dark border-b border-border dark:border-border-dark/30">
                  <Pressable 
                    onPress={() => {
                      setCategoryName(c.name);
                      setShowCategoryModal(false);
                      setSearchCategory('');
                    }}
                    className="flex-1 flex-row items-center"
                  >
                    <Feather name="check" size={16} color={categoryName === c.name ? '#f5a623' : 'transparent'} />
                    <Text className="text-foreground dark:text-foreground-dark ml-2">{c.name}</Text>
                  </Pressable>
                  <View className="flex-row gap-4 ml-2 pl-2">
                    <Pressable onPress={() => { setEditingCategory(c.name); setNewCategoryName(c.name); }}>
                      <Feather name="edit-2" size={16} color={mutedColor} />
                    </Pressable>
                    <Pressable onPress={() => {
                      Alert.alert('Delete Category?', `This action will delete the category "${c.name}" and all associated tasks.`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => {
                          onDeleteCategory(c.name);
                          if (categoryName === c.name) setCategoryName('');
                        }}
                      ]);
                    }}>
                      <Feather name="trash-2" size={16} color={mutedColor} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <View className="bg-card dark:bg-card-dark rounded-xl w-full max-w-sm mx-auto overflow-hidden border border-border dark:border-border-dark p-5">
            <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">Edit Category</Text>
            <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground mt-1 mb-4">Change the category name</Text>

            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Category name"
              placeholderTextColor={mutedColor}
              className="w-full h-12 px-4 rounded-md border border-input dark:border-input-dark bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark mb-4"
            />

            <View className="flex-row justify-end gap-3 flex-wrap">
              <Pressable onPress={() => setEditingCategory(null)} className="px-4 py-2 rounded-md border border-input dark:border-input-dark">
                <Text className="text-foreground dark:text-foreground-dark">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveEditCategory} disabled={!newCategoryName.trim()} className={`px-4 py-2 rounded-md ${!newCategoryName.trim() ? 'bg-primary/50' : 'bg-primary'}`}>
                <Text className="text-primary-foreground font-medium">Save</Text>
              </Pressable>
            </View>
          </View>
        )}

      </KeyboardAvoidingView>
    </Modal>
  );
}
