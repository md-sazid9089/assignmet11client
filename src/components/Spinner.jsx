const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-4 border-primary-400`}></div>
    </div>
  );
};

export default Spinner;
