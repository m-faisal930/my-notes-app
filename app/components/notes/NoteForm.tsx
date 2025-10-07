'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note, NoteFormData } from '@/lib/types';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

interface NoteFormProps {
  note?: Note;
  onSubmit: (data: NoteFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function NoteForm({ note, onSubmit, isSubmitting = false }: NoteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<NoteFormData>({
    title: note?.title || '',
    body: note?.body || '',
    tags: note?.tags || [],
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter note title..."
          required
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
          placeholder="Write your note content..."
          required
          rows={8}
          maxLength={5000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.body.length}/5000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            maxLength={20}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formData.tags.length}/10 tags
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}