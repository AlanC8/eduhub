import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  href,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}: ButtonProps) {
  
  // Base classes shared by all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size specific classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-gradient-primary text-white shadow-md hover:opacity-90 focus:ring-primary/30',
    secondary: 'bg-gradient-to-r from-secondary to-purple-600 text-white shadow-md hover:opacity-90 focus:ring-secondary/30',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300/30',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-200/30',
    success: 'bg-success text-white shadow-md hover:opacity-90 focus:ring-success/30',
    danger: 'bg-danger text-white shadow-md hover:opacity-90 focus:ring-danger/30',
    warning: 'bg-warning text-white shadow-md hover:opacity-90 focus:ring-warning/30',
  };
  
  // State specific classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Final classes
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`;
  
  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <span className={`material-icons-round ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
        {icon}
      </span>
    );
  };
  
  // Content with icon
  const content = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      {children}
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  );
  
  // Return link or button
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
} 