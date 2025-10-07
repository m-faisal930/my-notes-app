import { Note } from '@/lib/types';
import NoteCard from './NoteCard';

interface NotesGridProps {
  notes: Note[];
}

export default function NotesGrid({ notes }: NotesGridProps) {

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
        <p className="text-gray-600">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => {

        if (!note || !note._id) {
          console.warn('Invalid note found:', note);
          return null;
        }
        
        return <NoteCard key={note._id} note={note} />;
      })}
    </div>
  );
}