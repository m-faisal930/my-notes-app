'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Note, NoteFormData } from '@/lib/types';
import NoteForm from '../../../components/notes/NoteForm';
import Card from '../../../components/ui/Card';

interface EditNotePageProps {
  params: {
    id: string;
  };
}

export default function EditNotePage({ params }: EditNotePageProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setNote(data.data);
        } else {
          router.push('/notes');
        }
      } catch  {
        router.push('/notes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [params.id, router]);

  const handleSubmit = async (formData: NoteFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/notes/${params.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update note');
      }
    } catch  {
      alert('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
        <p className="text-gray-600 mt-2">Update your thoughts and ideas</p>
      </div>

      <Card className="p-8">
        <NoteForm 
          note={note}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}