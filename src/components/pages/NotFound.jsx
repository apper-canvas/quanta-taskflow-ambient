import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
          }}
        >
          <ApperIcon name="Search" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-heading font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            icon="Home"
            size="lg"
            className="w-full"
          >
            Go to Today
          </Button>
          
          <Button
            onClick={() => navigate('/all-tasks')}
            variant="ghost"
            icon="List"
            size="lg"
            className="w-full"
          >
            View All Tasks
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;