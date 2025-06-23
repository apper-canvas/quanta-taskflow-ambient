import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import TaskInput from '@/components/molecules/TaskInput';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allTasks, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(allTasks);
      setCategories(categoriesData);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created!');
    } catch (err) {
      toast.error('Failed to create task');
      throw err;
    }
  };

const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleBulkDelete = async (taskIds) => {
    await Promise.all(taskIds.map(id => taskService.delete(id)));
    setTasks(prev => prev.filter(task => !taskIds.includes(task.Id)));
  };

  const handleBulkComplete = async (taskIds) => {
    const updatePromises = taskIds.map(id => taskService.update(id, { completed: true }));
    const updatedTasks = await Promise.all(updatePromises);
    
    setTasks(prev => prev.map(task => {
      const updated = updatedTasks.find(t => t.Id === task.Id);
      return updated || task;
    }));
  };

  const handleBulkMoveCategory = async (taskIds, categoryId) => {
    const updatePromises = taskIds.map(id => 
      taskService.update(id, { categoryId: parseInt(categoryId, 10) })
    );
    const updatedTasks = await Promise.all(updatePromises);
    
    setTasks(prev => prev.map(task => {
      const updated = updatedTasks.find(t => t.Id === task.Id);
      return updated || task;
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter tasks based on all criteria
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && task.categoryId !== parseInt(filterCategory, 10)) {
      return false;
    }
    
    // Completed filter
    if (!showCompleted && task.completed) {
      return false;
    }
    
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const activeFiltersCount = [
    filterPriority !== 'all',
    filterCategory !== 'all',
    !showCompleted
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600">
              {totalCount} total • {completedCount} completed
              {activeFiltersCount > 0 && ` • ${filteredTasks.length} filtered`}
            </p>
          </div>
          <ApperIcon name="List" size={32} className="text-primary" />
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search all tasks..."
          />
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <ApperIcon name="Flag" size={16} className="text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <ApperIcon name="Folder" size={16} className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.Id} value={category.Id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Completed Toggle */}
            <Button
              variant={showCompleted ? "primary" : "ghost"}
              size="sm"
              icon={showCompleted ? "Eye" : "EyeOff"}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Hide" : "Show"} Completed
            </Button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => {
                  setFilterPriority('all');
                  setFilterCategory('all');
                  setShowCompleted(true);
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Add */}
        <TaskInput
          onAddTask={handleAddTask}
          categories={categories}
          placeholder="Add a new task..."
        />

        {/* Task List */}
<TaskList
          tasks={filteredTasks}
          onTaskUpdate={handleTaskUpdate}
          onBulkDelete={handleBulkDelete}
          onBulkComplete={handleBulkComplete}
          onBulkMoveCategory={handleBulkMoveCategory}
          showCompleted={showCompleted}
          emptyTitle={activeFiltersCount > 0 ? "No tasks match your filters" : "No tasks yet"}
          emptyDescription={activeFiltersCount > 0 ? "Try adjusting your search or filters" : "Create your first task to get started"}
        />
      </div>
    </motion.div>
  );
};

export default AllTasks;