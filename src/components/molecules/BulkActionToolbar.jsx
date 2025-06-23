import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const BulkActionToolbar = ({
  selectedCount,
  totalCount,
  categories = [],
  onSelectAll,
  onBulkDelete,
  onBulkComplete,
  onBulkMoveCategory,
  onClearSelection
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const allSelected = selectedCount === totalCount;

  const handleMoveToCategory = (categoryId) => {
    onBulkMoveCategory(categoryId);
    setShowCategoryMenu(false);
  };

  const handleDelete = () => {
    onBulkDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-primary text-white rounded-lg p-4 shadow-lg border border-primary/20"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckSquare" size={20} />
            <span className="font-medium">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-white hover:bg-white/10 border-white/20"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mark Complete */}
          <Button
            variant="ghost"
            size="sm"
            icon="Check"
            onClick={onBulkComplete}
            className="text-white hover:bg-white/10 border-white/20"
          >
            Complete
          </Button>

          {/* Move to Category */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon="Folder"
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="text-white hover:bg-white/10 border-white/20"
            >
              Move to...
            </Button>

            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 min-w-48"
              >
                <div className="p-2">
                  {categories.map(category => (
                    <button
                      key={category.Id}
                      onClick={() => handleMoveToCategory(category.Id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <ApperIcon name={category.icon} size={16} className="flex-shrink-0" />
                      <span className="flex-1">{category.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-white hover:bg-red-500 border-white/20"
          >
            Delete
          </Button>

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClearSelection}
            className="text-white hover:bg-white/10 border-white/20"
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/90">
              <ApperIcon name="AlertTriangle" size={16} />
              <span>Delete {selectedCount} tasks permanently?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-white hover:bg-white/10 border-white/20"
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-white hover:bg-red-500 border-white/20"
              >
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Click outside handler for category menu */}
      {showCategoryMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCategoryMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default BulkActionToolbar;