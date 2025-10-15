import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical min-h-[100px]',
        className
      )}
      {...props}
    />
  );
}