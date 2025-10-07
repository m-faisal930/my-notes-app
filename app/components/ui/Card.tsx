import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    />
  );
}