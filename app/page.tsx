import Link from 'next/link';
import Button from './components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Organize Your Thoughts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A beautiful, intuitive notes application to capture your ideas, thoughts, and inspiration. 
            Simple, fast, and always there when you need it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/notes/create">
            <Button size="lg">
              Start Writing
            </Button>
          </Link>
          <Link href="/notes">
            <Button variant="outline" size="lg">
              Browse Notes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Quick access and instant search across all your notes.</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🏷️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Tags</h3>
            <p className="text-gray-600">Organize with tags and find what you need in seconds.</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Always Available</h3>
            <p className="text-gray-600">Access your notes anywhere, anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}