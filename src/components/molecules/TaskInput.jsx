import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskInput = ({ 
  onAddTask, 
  categories = [],
  defaultCategory = null,
  placeholder = "Add a new task...",
  className = ''
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState(defaultCategory || (categories[0]?.Id || 1));
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onAddTask?.({
        title: title.trim(),
        priority,
categoryId: parseInt(categoryId, 10),
        dueDate: dueDate || null
      });
      
      // Reset form
      setTitle('');
      setPriority('medium');
      setDueDate('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
    }
  };

  return (
    <motion.div
      layout
      className={`bg-surface rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all duration-200 hover:border-primary/50 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Input */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <ApperIcon name="Plus" size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Expanded Options */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-3 border-t space-y-3">
            {/* Priority and Category Row */}
            <div className="flex items-center gap-4">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <ApperIcon name="Flag" size={16} className="text-gray-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <ApperIcon name="Folder" size={16} className="text-gray-400" />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.map(category => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                disabled={!title.trim()}
              >
                Add Task
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TaskInput;