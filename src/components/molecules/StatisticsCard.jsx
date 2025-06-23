import { motion } from 'framer-motion';
import { isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const StatisticsCard = ({ tasks = [] }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Overdue tasks (past due date and not completed)
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  ).length;
  
  // Today's tasks
  const todaysTasks = tasks.filter(task => 
    task.dueDate && isToday(new Date(task.dueDate))
  ).length;
  
  // Priority breakdown
  const priorityStats = {
    high: tasks.filter(task => !task.completed && task.priority === 'high').length,
    medium: tasks.filter(task => !task.completed && task.priority === 'medium').length,
    low: tasks.filter(task => !task.completed && task.priority === 'low').length
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const stats = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Pending Tasks',
      value: pendingTasks,
      icon: 'Clock',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: 'AlertTriangle',
      color: overdueTasks > 0 ? 'text-error' : 'text-gray-400',
      bgColor: overdueTasks > 0 ? 'bg-error/10' : 'bg-gray-100'
    },
    {
      label: 'Due Today',
      value: todaysTasks,
      icon: 'Calendar',
      color: 'text-info',
      bgColor: 'bg-info/10'
    }
  ];

  if (totalTasks === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="text-center py-8">
          <ApperIcon name="BarChart3" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Statistics Available</h3>
          <p className="text-gray-500">Create some tasks to see your productivity statistics</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Task Statistics</h3>
            <p className="text-sm text-gray-500">Your productivity overview</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className={`${stat.bgColor} rounded-lg p-4 transition-all duration-200 group-hover:shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name={stat.icon} size={20} className={stat.color} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{completedTasks} of {totalTasks} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${getCompletionColor(completionRate)} transition-all duration-300`}
          />
        </div>
      </div>

      {/* Priority Breakdown */}
      {(priorityStats.high > 0 || priorityStats.medium > 0 || priorityStats.low > 0) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Pending by Priority</h4>
          <div className="flex flex-wrap gap-2">
            {priorityStats.high > 0 && (
              <Badge variant="high" size="sm">
                <ApperIcon name="ArrowUp" size={12} />
                High: {priorityStats.high}
              </Badge>
            )}
            {priorityStats.medium > 0 && (
              <Badge variant="medium" size="sm">
                <ApperIcon name="Minus" size={12} />
                Medium: {priorityStats.medium}
              </Badge>
            )}
            {priorityStats.low > 0 && (
              <Badge variant="low" size="sm">
                <ApperIcon name="ArrowDown" size={12} />
                Low: {priorityStats.low}
              </Badge>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatisticsCard;