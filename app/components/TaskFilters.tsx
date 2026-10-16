import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { SearchIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

interface TaskFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    categories: string[];
}

const TaskFilters = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
}: TaskFiltersProps) => {
    return (
        <VStack space="md">
            {/* Search bar */}
            <Input className="w-full">
                <InputField
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </Input>

            {/* Filter buttons */}
            <HStack space="sm" className="flex-wrap">
                <Button
                    variant={statusFilter === 'all' ? 'solid' : 'outline'}
                    onPress={() => setStatusFilter('all')}
                    size="sm"
                >
                    <ButtonText>All</ButtonText>
                </Button>
                <Button
                    variant={statusFilter === 'pending' ? 'solid' : 'outline'}
                    onPress={() => setStatusFilter('pending')}
                    size="sm"
                >
                    <ButtonText>Pending</ButtonText>
                </Button>
                <Button
                    variant={statusFilter === 'completed' ? 'solid' : 'outline'}
                    onPress={() => setStatusFilter('completed')}
                    size="sm"
                >
                    <ButtonText>Completed</ButtonText>
                </Button>

                <Select selectedValue={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger variant="outline" size="sm" className="min-w-[120]">
                        <SelectInput placeholder="Category" />
                        <SelectIcon />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectItem label="All categories" value="all" />
                            {categories.map((category, index) => (
                                <SelectItem 
                                    key={`${category}-${index}`} 
                                    label={category} 
                                    value={category}
                                />
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </HStack>
        </VStack>
    );
};

export default TaskFilters;

