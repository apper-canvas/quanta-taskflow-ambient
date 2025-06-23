import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    high: 'bg-error/10 text-error border border-error/20',
    medium: 'bg-warning/10 text-warning border border-warning/20',
    low: 'bg-info/10 text-info border border-info/20',
    success: 'bg-success/10 text-success border border-success/20'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const badgeClasses = `
    inline-flex items-center rounded-full font-medium
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <span className={badgeClasses} {...props}>
      {icon && <ApperIcon name={icon} size={12} className="mr-1" />}
      {children}
    </span>
  );
};

export default Badge;