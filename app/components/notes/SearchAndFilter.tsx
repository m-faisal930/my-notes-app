'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface SearchAndFilterProps {
  initialSearch?: string;
  initialTag?: string;
}

export default function SearchAndFilter({ initialSearch = '', initialTag = '' }: SearchAndFilterProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tag) params.set('tag', tag);
    
    router.push(`/notes?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setTag('');
    router.push('/notes');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Notes
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Tag
          </label>
          <Input
            id="tag"
            type="text"
            placeholder="Enter a tag..."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex items-end space-x-2">
          <Button onClick={handleSearch} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}