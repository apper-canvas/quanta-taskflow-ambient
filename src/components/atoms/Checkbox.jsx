import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange?.(!checked)}
      className={`
        ${sizes[size]}
        rounded border-2 transition-all duration-200 flex items-center justify-center
        ${checked 
          ? 'bg-primary border-primary text-white shadow-sm' 
          : 'border-gray-300 hover:border-gray-400 bg-white'
        }
        ${className}
      `.trim()}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="animate-bounce-subtle"
        >
          <ApperIcon name="Check" size={iconSizes[size]} />
        </motion.div>
      )}
    </motion.button>
  );
};

export default Checkbox;