'use client';
import { motion, Transition } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  fullWidth?: boolean;
};

export function Button({
  children, variant = 'primary', size = 'md',
  href, onClick, disabled, loading, type = 'button',
  className, fullWidth,
}: Props) {
  const baseClasses = "relative inline-flex items-center justify-center font-display font-medium uppercase tracking-widest whitespace-nowrap overflow-hidden z-10 transition-all duration-300 rounded-full";
  
  const sizeClasses = {
    sm: "px-5 py-2.5 text-[10px]",
    md: "px-8 py-3.5 text-xs",
    lg: "px-10 py-5 text-sm",
  };

  const variantClasses = {
      primary:
        "bg-boinng-yellow text-boinng-black shadow-sm hover:shadow-md",
      secondary:
        "bg-boinng-blue text-[#FFFEFA] shadow-sm hover:shadow-md",
      outline:
        "bg-boinng-bg text-boinng-black hover:bg-boinng-black hover:text-boinng-bg",
      ghost: "bg-transparent text-boinng-black hover:bg-black/5",
  };

  const classes = cn(
    baseClasses, 
    sizeClasses[size], 
    variantClasses[variant], 
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const innerMotion = {
    rest: { y: 0 },
    hover: { y: 0 },
  };

  const Content = (
    <motion.span 
      className="relative z-10 flex items-center gap-2"
      variants={innerMotion}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </motion.span>
  );

  // Framer Motion spring config
  const spring: Transition = {
    type: "spring",
    stiffness: 400,
    damping: 25,
  };

  const MotionComponent = motion.button;
  const MotionLink = motion(Link);

  const tapEffect = !disabled && { scale: 0.98 };
  const hoverEffect = !disabled && { scale: 1.02, y: -2 };

  if (href) {
    return (
      <MotionLink 
        href={href} 
        className={classes}
        whileHover={hoverEffect || undefined}
        whileTap={tapEffect || undefined}
        transition={{ duration: 0.2, ease: "easeOut" }} >
        {Content}
      </MotionLink>
    );
  }

  return (
    <MotionComponent
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={hoverEffect || undefined}
      whileTap={tapEffect || undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {Content}
    </MotionComponent>
  );
}
