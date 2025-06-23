import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SubtaskInput = ({ 
  onAddSubtask,
  placeholder = "Add a subtask...",
  className = ''
}) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddSubtask(description.trim());
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setDescription('');
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!description.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      layout
      className={`${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <motion.input
              layout
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={isSubmitting}
              className={`
                w-full px-3 py-2 text-sm bg-surface border border-surface-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                placeholder:text-gray-400
                transition-all duration-200
                ${isExpanded ? 'bg-white shadow-sm' : 'bg-surface-50'}
              `.trim()}
            />
          </div>

          <AnimatePresence>
            {(isExpanded || description.trim()) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1"
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon="Plus"
                  disabled={!description.trim() || isSubmitting}
                  loading={isSubmitting}
                  className="px-3 py-2"
                />
                {isExpanded && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => {
                      setDescription('');
                      setIsExpanded(false);
                    }}
                    className="px-2 py-2"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tips */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-gray-500 pl-1"
            >
              Press Enter to add • Escape to cancel
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default SubtaskInput;