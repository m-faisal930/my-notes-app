'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NoteFormData } from '@/lib/types';
import NoteForm from '../../components/notes/NoteForm';
import Card from '../../components/ui/Card';

export default function CreateNotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: NoteFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/notes');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create note');
      }
    } catch {
      alert('Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
        <p className="text-gray-600 mt-2">Capture your thoughts and ideas</p>
      </div>

      <Card className="p-8">
        <NoteForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}