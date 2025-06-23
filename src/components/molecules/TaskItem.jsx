import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = [],
  className = '',
  ...props 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const category = categories.find(c => c.Id === task.categoryId);
  
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
        {/* Category Color Bar */}
        {category && (
          <div 
            className="w-1 h-6 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: category.color }}
          />
        )}

        {/* Checkbox */}
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
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${
                isDueDateOverdue(task.dueDate) ? 'text-error' : 'text-gray-500'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span className="text-xs">
                  {formatDueDate(task.dueDate)}
                  {isDueDateOverdue(task.dueDate) && ' (Overdue)'}
                </span>
              </div>
            )}

            {/* Category */}
            {category && (
              <div className="flex items-center gap-1 text-gray-500">
                <ApperIcon name={category.icon} size={12} />
                <span className="text-xs">{category.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;