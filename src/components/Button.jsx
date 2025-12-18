import React from 'react';

/**
 * Button Component - Slate & Clay Theme
 * 
 * Design System Colors:
 * - Primary Clay: #b35a44 (Primary action buttons)
 * - Light Clay: #d97757 (Hover states, lighter accents)
 * - Deep Slate: #0f172a (Dark backgrounds)
 * - Muted Slate: #334155 (Secondary actions)
 * - Slate Tint: #f8fafc (Light backgrounds)
 * 
 * Variants:
 * - clay (primary): Primary Clay (#b35a44) for main CTAs
 * - slate: Muted Slate for secondary actions  
 * - outline-clay: Outlined with Primary Clay border
 * - outline-slate: Outlined with Slate border
 * - ghost: Minimal styling for tertiary actions
 * - admin: Deep Slate for admin panel actions
 * 
 * Usage:
 * <Button variant="clay" size="lg">Book Now</Button>
 * <Button variant="slate" size="md">Cancel</Button>
 * <Button variant="outline-clay" icon={<FaTicket />}>View Tickets</Button>
 */

const Button = ({ 
  children, 
  variant = 'clay', 
  size = 'md', 
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles using exact user-specified colors
  const variants = {
    // Primary action: #b35a44 (Primary Clay) with hover to darker #8e4636
    clay: 'bg-[#b35a44] hover:bg-[#8e4636] text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-[#d97757]/30',
    
    // Secondary action: Muted Slate
    slate: 'bg-[#334155] hover:bg-[#1e293b] text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:ring-slate-400',
    
    // Outlined Primary Clay
    'outline-clay': 'border-2 border-[#b35a44] text-[#b35a44] dark:text-[#d97757] hover:bg-[#b35a44]/10 hover:scale-[1.02] focus:ring-[#b35a44]/30',
    
    // Outlined Slate
    'outline-slate': 'border-2 border-[#334155] text-[#334155] dark:text-slate-300 dark:border-slate-500 hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] hover:scale-[1.02] focus:ring-slate-400',
    
    // Minimal ghost button
    ghost: 'text-[#334155] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] hover:text-[#b35a44] dark:hover:text-[#d97757]',
    
    // Admin panel: Deep Slate background
    admin: 'bg-[#0f172a] hover:bg-[#1e293b] text-white border border-[#334155] hover:border-[#b35a44] shadow-md hover:shadow-lg transition-all',
  };
  
  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-2.5 text-base gap-2',
    lg: 'px-8 py-3 text-lg gap-3',
    xl: 'px-10 py-4 text-xl gap-3',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant] || variants.clay}
        ${sizes[size]}
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && <span className="text-xl">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="text-xl">{icon}</span>}
    </button>
  );
};

export default Button;

// Example usage in your components:
/*
import Button from './components/Button';
import { FaTicketAlt, FaShoppingCart } from 'react-icons/fa';

// Primary action (clay)
<Button variant="clay" size="lg" icon={<FaTicketAlt />}>
  Book Now
</Button>

// Secondary action (slate)
<Button variant="slate" size="md">
  Learn More
</Button>

// Outline variant
<Button variant="outline-clay" icon={<FaShoppingCart />} iconPosition="right">
  Add to Cart
</Button>

// Admin panel button
<Button variant="admin">
  Manage Users
</Button>

// Full width button
<Button variant="clay" fullWidth>
  Complete Purchase
</Button>

// Loading state
<Button variant="clay" loading>
  Processing...
</Button>
*/
