import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SubtaskInput from '@/components/molecules/SubtaskInput';
import subtaskService from '@/services/api/subtaskService';

const SubtaskList = ({ 
  taskId,
  onSubtaskUpdate,
  className = ''
}) => {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (taskId) {
      loadSubtasks();
    }
  }, [taskId]);

  const loadSubtasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await subtaskService.getByTaskId(taskId);
      setSubtasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load subtasks');
      toast.error('Failed to load subtasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (subtaskId) => {
    try {
      const updatedSubtask = await subtaskService.toggleComplete(subtaskId);
      
      setSubtasks(prev => prev.map(subtask => 
        subtask.Id === subtaskId ? updatedSubtask : subtask
      ));
      
      onSubtaskUpdate?.(updatedSubtask);
      toast.success(updatedSubtask.completed ? 'Subtask completed!' : 'Subtask reopened');
    } catch (err) {
      toast.error('Failed to update subtask');
    }
  };

  const handleEditSubtask = async (subtaskId, description) => {
    if (!description.trim()) return;
    
    try {
      const updatedSubtask = await subtaskService.update(subtaskId, { 
        description: description.trim() 
      });
      
      setSubtasks(prev => prev.map(subtask => 
        subtask.Id === subtaskId ? updatedSubtask : subtask
      ));
      
      setEditingId(null);
      setEditDescription('');
      onSubtaskUpdate?.(updatedSubtask);
      toast.success('Subtask updated');
    } catch (err) {
      toast.error('Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!window.confirm('Are you sure you want to delete this subtask?')) {
      return;
    }

    try {
      await subtaskService.delete(subtaskId);
      setSubtasks(prev => prev.filter(subtask => subtask.Id !== subtaskId));
      toast.success('Subtask deleted');
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  const handleAddSubtask = async (description) => {
    try {
      const newSubtask = await subtaskService.create({
        description,
        taskId,
        completed: false
      });
      
      setSubtasks(prev => [...prev, newSubtask]);
      onSubtaskUpdate?.(newSubtask);
      toast.success('Subtask added');
    } catch (err) {
      toast.error('Failed to add subtask');
      throw err;
    }
  };

  const startEditing = (subtask) => {
    setEditingId(subtask.Id);
    setEditDescription(subtask.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDescription('');
  };

  const handleEditKeyPress = (e, subtaskId) => {
    if (e.key === 'Enter') {
      handleEditSubtask(subtaskId, editDescription);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  if (loading) {
    return <SkeletonLoader count={2} className={`ml-8 ${className}`} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadSubtasks}
        className={`ml-8 ${className}`}
      />
    );
  }

  return (
    <div className={`ml-8 space-y-2 ${className}`}>
      {/* Subtask Items */}
      <AnimatePresence mode="popLayout">
        {subtasks.map((subtask, index) => (
          <motion.div
            key={subtask.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-surface-50 rounded-md p-3 border border-surface-200"
          >
            <div className="flex items-start gap-3">
              {/* Completion Checkbox */}
              <Checkbox
                checked={subtask.completed}
                onChange={() => handleToggleComplete(subtask.Id)}
                className="mt-0.5 flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingId === subtask.Id ? (
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onBlur={() => handleEditSubtask(subtask.Id, editDescription)}
                    onKeyDown={(e) => handleEditKeyPress(e, subtask.Id)}
                    className="w-full text-sm bg-transparent border-b border-primary focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p 
                    className={`
                      text-sm cursor-pointer
                      ${subtask.completed 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-700 hover:text-primary'
                      }
                    `.trim()}
                    onClick={() => startEditing(subtask)}
                  >
                    {subtask.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {editingId !== subtask.Id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit3"
                    onClick={() => startEditing(subtask)}
                    className="p-1 h-auto text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDeleteSubtask(subtask.Id)}
                    className="p-1 h-auto text-xs text-error hover:text-error hover:bg-error/10"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add New Subtask */}
      <SubtaskInput onAddSubtask={handleAddSubtask} />
      
      {/* Empty State */}
      {subtasks.length === 0 && !loading && (
        <EmptyState 
          title="No subtasks"
          description="Add subtasks to break down this task"
          icon="ListChecks"
          className="py-4"
        />
      )}
    </div>
  );
};

export default SubtaskList;