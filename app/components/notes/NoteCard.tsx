import Link from 'next/link';
import { Note } from '@/lib/types';
import { formatDate, truncateText } from '@/lib/utils';
import Card from '../../components/ui/Card';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    console.log("Rendering NoteCard for note:", note);
  return (
    <Card className="p-6 h-full flex flex-col fade-in">
      <div className="flex-1">
        <Link href={`/notes/${note._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {note.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(note.body, 120)}
        </p>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatDate(note.updatedAt)}
        </span>
        <Link
          href={`/notes/${note._id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View →
        </Link>
      </div>
    </Card>
  );
}