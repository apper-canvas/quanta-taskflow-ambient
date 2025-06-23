import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-surface rounded-lg p-4 border shadow-sm"
        >
          <div className="flex items-start gap-3">
            {/* Color bar skeleton */}
            <div className="w-1 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-200 rounded border-2 animate-pulse flex-shrink-0 mt-1"></div>
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="flex items-center gap-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;