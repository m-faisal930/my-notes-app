// app/components/ui/Input.tsx
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
        className
      )}
      {...props}
    />
  );
}