import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "No tasks yet",
  description = "Create your first task to get started",
  actionLabel = "Add Task",
  onAction,
  icon = "CheckSquare",
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-16 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <ApperIcon name={icon} className="w-20 h-20 text-gray-300 mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} icon="Plus" size="lg">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;