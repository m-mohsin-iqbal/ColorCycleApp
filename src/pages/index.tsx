import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ColorCycle from './components/ColorCycle';
import '../styles/globals.css';
export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen  flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className="absolute top-4 right-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Log out
      </button>
      <div className="max-w-md w-full space-y-8">
        <ColorCycle />
      </div>
    </div>
  );
}