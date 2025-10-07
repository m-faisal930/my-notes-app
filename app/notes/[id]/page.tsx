import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Note } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

async function getNote(id: string): Promise<{ data: Note }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch note');
  }
  
  return res.json();
}

interface NotePageProps {
  params: {
    id: string;
  };
}

export default async function NotePage({ params }: NotePageProps) {
  let note: Note;
  
  try {
    const response = await getNote(params.id);
    note = response.data;
  } catch  {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
          <p className="text-gray-600 mt-2">
            Last updated {formatDate(note.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/notes/${note._id}/edit`}>
            <Button variant="outline">
              Edit
            </Button>
          </Link>
          <Link href="/notes">
            <Button variant="secondary">
              Back to Notes
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-8">
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {note.body}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          Created {formatDate(note.createdAt)}
        </div>
      </Card>
    </div>
  );
}