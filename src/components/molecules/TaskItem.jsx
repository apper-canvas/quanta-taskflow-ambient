import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import SubtaskList from '@/components/organisms/SubtaskList';
import subtaskService from '@/services/api/subtaskService';

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = [],
  className = '',
  isSelected = false,
  onSelect,
  showSelection = false,
  ...props 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [subtaskCount, setSubtaskCount] = useState(0);
  const [subtaskLoading, setSubtaskLoading] = useState(false);

const category = categories.find(c => c.Id === task.category_id);

  // Load subtask count
  useEffect(() => {
    const loadSubtaskCount = async () => {
      try {
        setSubtaskLoading(true);
        const subtasks = await subtaskService.getByTaskId(task.Id);
        setSubtaskCount(subtasks.length);
      } catch (error) {
        console.error('Failed to load subtask count:', error);
      } finally {
        setSubtaskLoading(false);
      }
    };

    if (task.Id) {
      loadSubtaskCount();
    }
  }, [task.Id]);
  
  const handleToggleComplete = async () => {
    if (task.completed) {
      // If unchecking, do it immediately
      onToggleComplete?.(task.Id);
    } else {
      // If checking, show animation then fade out
      setIsCompleting(true);
      await onToggleComplete?.(task.Id);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editTitle.trim() && editTitle !== task.title) {
        onEdit?.(task.Id, { title: editTitle.trim() });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

const formatDueDate = (dueDate) => {
if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  };

  const isDueDateOverdue = (dueDate) => {
    if (!dueDate || task.completed) return false;
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isCompleting && !task.completed ? 0 : 1,
        x: isCompleting && !task.completed ? -20 : 0
      }}
      transition={{ duration: 0.2 }}
      whileHover={{ 
        y: -2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      className={`
        bg-surface rounded-lg p-4 border shadow-sm transition-all duration-200
        ${task.completed ? 'opacity-60' : ''}
        ${isCompleting ? 'animate-fade-out' : ''}
        ${className}
      `.trim()}
      {...props}
>
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        {showSelection && (
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect?.(task.Id)}
            className="mt-1 flex-shrink-0"
          />
        )}

        {/* Category Color Bar */}
        {category && (
          <div 
            className="w-1 h-6 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: category.color }}
          />
        )}

{/* Completion Checkbox */}
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          className="mt-1 flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={handleKeyPress}
                className="flex-1 font-medium text-gray-900 bg-transparent border-b border-primary focus:outline-none"
                autoFocus
              />
            ) : (
              <h3 
                className={`
                  flex-1 font-medium break-words cursor-pointer
                  ${task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900 hover:text-primary'
                  }
                `.trim()}
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </h3>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit3"
                  onClick={handleEdit}
                  className="p-1 h-auto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => onDelete?.(task.Id)}
                  className="p-1 h-auto text-error hover:text-error hover:bg-error/10"
                />
              </div>
            )}
          </div>

{/* Meta Info */}
          <div className="flex items-center gap-3 text-sm">
            {/* Priority Badge */}
            <Badge variant={getPriorityVariant(task.priority)} size="xs">
              {task.priority}
            </Badge>

            {/* Due Date */}
{task.due_date && (
<div className={`flex items-center gap-1 ${
                isDueDateOverdue(task.due_date) ? 'text-error' : 'text-gray-500'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span className="text-xs">
{formatDueDate(task.due_date)}
                  {isDueDateOverdue(task.due_date) && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Category */}
            {category && (
              <div className="flex items-center gap-1 text-gray-500">
<ApperIcon name={category.icon} size={12} />
                <span className="text-xs">{category.Name}</span>
              </div>
            )}

            {/* Subtask Count & Toggle */}
            {subtaskCount > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
              >
                <ApperIcon name="ListChecks" size={12} />
                <span className="text-xs">{subtaskCount} subtask{subtaskCount !== 1 ? 's' : ''}</span>
                <ApperIcon 
                  name={showSubtasks ? "ChevronUp" : "ChevronDown"} 
                  size={10} 
                />
              </button>
            )}

            {/* Add Subtask Button */}
            {!showSubtasks && subtaskCount === 0 && (
              <button
                onClick={() => setShowSubtasks(true)}
                className="flex items-center gap-1 text-gray-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="Plus" size={12} />
                <span className="text-xs">Add subtask</span>
              </button>
            )}
          </div>
        </div>
</div>

      {/* Subtasks Section */}
      <AnimatePresence>
        {showSubtasks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-surface-200"
          >
            <SubtaskList 
              taskId={task.Id}
              onSubtaskUpdate={(updatedSubtask) => {
                // Reload subtask count when subtasks change
                if (task.Id) {
                  subtaskService.getByTaskId(task.Id).then(subtasks => {
                    setSubtaskCount(subtasks.length);
                  });
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;