import { Suspense } from 'react';
import Link from 'next/link';
import { NotesResponse } from '@/lib/types';
import NotesGrid from '../components/notes/NotesGrid';
import SearchAndFilter from '../components/notes/SearchAndFilter';
import Button from '../components/ui/Button';

async function getNotes(searchParams: { [key: string]: string | undefined }): Promise<NotesResponse> {
  const params = new URLSearchParams();
  

  if (searchParams.search && typeof searchParams.search === 'string') {
    params.set('search', searchParams.search);
  }
  if (searchParams.tag && typeof searchParams.tag === 'string') {
    params.set('tag', searchParams.tag);
  }
  if (searchParams.page && typeof searchParams.page === 'string') {
    params.set('page', searchParams.page);
  }
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes?${params.toString()}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch notes');
  }
  
  return res.json();
}


interface NotesPageProps {
  [key: string]: string | undefined;
  search?: string;
  tag?: string;
  page?: string;
}





export default async function NotesPage({ 
  searchParams 
}: { 
  searchParams: Promise<NotesPageProps> 
}) {

  const resolvedSearchParams = await searchParams;
  let notesData: NotesResponse | null = null;
  
  try {
    notesData = await getNotes(resolvedSearchParams);
  } catch  {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load notes</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { notes, pagination } = notesData.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Notes</h1>
          <p className="text-gray-600 mt-2">
            {pagination.total} note{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link href="/notes/create">
          <Button>
            + New Note
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading search...</div>}>
        <SearchAndFilter 
          initialSearch={resolvedSearchParams.search || ''}
          initialTag={resolvedSearchParams.tag || ''}
        />
      </Suspense>

      <NotesGrid notes={notes} />

      {/* Pagination would go here */}
    </div>
  );
}