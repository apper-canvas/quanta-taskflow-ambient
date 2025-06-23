import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskItem from '@/components/molecules/TaskItem';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const TaskList = ({ 
  tasks: propTasks,
  onTaskUpdate,
  showCompleted = true,
  emptyTitle = "No tasks found",
  emptyDescription = "Add some tasks to get started",
  className = ''
}) => {
  const [tasks, setTasks] = useState(propTasks || []);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!propTasks);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propTasks) {
      setTasks(propTasks);
    } else {
      loadTasks();
    }
  }, [propTasks]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadTasks = async () => {
    if (propTasks) return; // Don't load if tasks are provided as props
    
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      // Notify parent if callback provided
      onTaskUpdate?.(updatedTask);
      
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      // Notify parent if callback provided
      onTaskUpdate?.(updatedTask);
      
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      
      // Update local state
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Filter tasks based on showCompleted prop
  const filteredTasks = tasks.filter(task => 
    showCompleted ? true : !task.completed
  );

  // Sort tasks: incomplete first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Priority order: high, medium, low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Due date: tasks with due dates first, then by date
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    // Finally by creation date
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return <SkeletonLoader count={5} className={className} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadTasks}
        className={className}
      />
    );
  }

  if (sortedTasks.length === 0) {
    return (
      <EmptyState 
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <TaskItem
              task={task}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;