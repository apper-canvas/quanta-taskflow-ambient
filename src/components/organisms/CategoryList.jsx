import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import categoryService from '@/services/api/categoryService';

const CategoryList = ({ className = '' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await categoryService.create({
        name: newCategoryName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        icon: 'Folder'
      });
      
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setIsAddingNew(false);
      toast.success('Category created');
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </motion.div>
          Categories
        </button>
        
<Button
          variant="ghost"
          size="sm"
          icon="Plus"
          onClick={() => setIsAddingNew(true)}
          className="p-1 h-auto"
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 mb-3">
              {categories.map(category => (
                <motion.div
                  key={category.Id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <ApperIcon name={category.icon} size={14} />
                  <span className="flex-1 min-w-0 truncate">{category.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Add New Category */}
            <AnimatePresence>
              {isAddingNew && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddCategory}
                  className="space-y-2"
                >
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    autoFocus
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={!newCategoryName.trim()}>
                      Add
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsAddingNew(false);
                        setNewCategoryName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;