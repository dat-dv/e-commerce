import React from 'react';

import { cn } from '@/utils/cn';

interface AppContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  center?: boolean;
}

const sizeClasses = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

const AppContainer = ({
  children,
  className,
  size = '2xl',
  center = true,
  ...props
}: AppContainerProps) => {
  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        center && 'mx-auto',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AppContainer;
