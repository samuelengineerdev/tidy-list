import { useState, useEffect } from 'react';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { useCreateCategoryMutation, useGetAllCategoriesQuery } from '@/api/category-api';
import { Task } from './TaskCard';
import { useAppToast } from '@/hooks/use-app-toast';

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    onSave: (task: Omit<Task, 'id' | 'createdDate'> & { id?: string }) => void;
    categories: string[];
}

const TaskDialog = ({ 
    open, 
    onOpenChange, 
    task, 
    onSave, 
    categories 
}: TaskDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showNewCategory, setShowNewCategory] = useState(false);

    const toast = useAppToast();
    const [createCategory] = useCreateCategoryMutation();

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
            setCategory(task.category);
            setDueDate(task.dueDate);
        } else {
            setName('');
            setDescription('');
            setCategory('');
            setDueDate(new Date());
        }
        setShowNewCategory(false);
    }, [open, task]);

    const handleSave = () => {
        if (!name.trim() || !description || !category) return;

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

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            await createCategory({ name: newCategoryName.trim() }).unwrap();
            setCategory(newCategoryName.trim());
            setNewCategoryName('');
            setShowNewCategory(false);
            toast.success('Category created');
        } catch (error) {
            toast.error('Error creating category');
        }
    };

    return (
        <Modal isOpen={open} onClose={() => onOpenChange(false)} size="lg">
            <ModalBackdrop />
            <ModalContent>
                        <ModalHeader>
                            <Heading>
                                {task ? 'Edit Task' : 'New Task'}
                            </Heading>
                            <ModalCloseButton>
                            </ModalCloseButton>
                        </ModalHeader>
                <ModalBody>
                    <VStack space="md" className="px-4">
                        <VStack space="xs">
                            <Text>Name</Text>
                            <Input>
                                <InputField
                                    placeholder="Task name"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text>Description</Text>
                            <Textarea size="lg">
                                <TextareaInput
                                    placeholder="Describe your task..."
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </Textarea>
                        </VStack>

                        <VStack space="xs">
                            <Text>Category</Text>
                            {showNewCategory ? (
                                <HStack space="xs">
                                    <Input className="flex-1">
                                        <InputField
                                            placeholder="New category name"
                                            value={newCategoryName}
                                            onChangeText={setNewCategoryName}
                                        />
                                    </Input>
                                    <Button size="sm" onPress={handleCreateCategory}>
                                        <ButtonText>Add</ButtonText>
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onPress={() => setShowNewCategory(false)}
                                    >
                                        <ButtonText>Cancel</ButtonText>
                                    </Button>
                                </HStack>
                            ) : (
                                <HStack space="xs">
                                    <Select 
                                        selectedValue={category} 
                                        onValueChange={setCategory}
                                        className="flex-1"
                                    >
                                        <SelectTrigger variant="outline">
                                            <SelectInput placeholder="Select category" />
                                            <SelectIcon />
                                        </SelectTrigger>
                                        <SelectPortal>
                                            <SelectBackdrop />
                                            <SelectContent>
                                                <SelectDragIndicatorWrapper>
                                                    <SelectDragIndicator />
                                                </SelectDragIndicatorWrapper>
                                                {categories.map((cat, index) => (
                                                    <SelectItem 
                                                        key={`${cat}-${index}`} 
                                                        label={cat} 
                                                        value={cat}
                                                    />
                                                ))}
                                            </SelectContent>
                                        </SelectPortal>
                                    </Select>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onPress={() => setShowNewCategory(true)}
                                    >
                                        <ButtonText>+</ButtonText>
                                    </Button>
                                </HStack>
                            )}
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <HStack space="sm">
                        <Button 
                            variant="outline" 
                            onPress={() => onOpenChange(false)}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button 
                            onPress={handleSave} 
                            disabled={!name.trim() || !description || !category}
                        >
                            <ButtonText>
                                {task ? 'Save changes' : 'Create task'}
                            </ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskDialog;

