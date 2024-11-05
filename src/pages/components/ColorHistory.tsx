import { useState, useEffect } from 'react';

interface ColorStateLog {
  _id: string;
  colors: string[];
  highlightIndex: number;
  timestamp: string;
}

export default function ColorHistory() {
  const [colorHistory, setColorHistory] = useState<ColorStateLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const isDarkMode = typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    const fetchColorHistory = async () => {
      try {
        const response = await fetch(`/api/colors?page=${currentPage}&pageSize=${pageSize}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch color history');
        }

        const { colorStates, totalCount } = await response.json();
        
        setColorHistory(colorStates);
        setTotalPages(Math.ceil(totalCount / pageSize)); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching color history:', error);
        setError('Failed to load color history. Please try again later.');
        setLoading(false);
      }
    };

    fetchColorHistory();
  }, [currentPage, pageSize]); 

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className="text-center">Loading color history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`mt-8 responsive-history w-full overflow-auto ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <th className="border p-2 text-left">Timestamp</th>
            <th className="border p-2 text-left">Colors</th>
            <th className="border p-2 text-left">Highlighted Color</th>
          </tr>
        </thead>
        <tbody>
          {colorHistory.map((log) => (
            <tr key={log._id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <td className="border p-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="border p-2">
                <div className="flex space-x-2">
                  {log.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 border ${index === log.highlightIndex ? 'border-yellow-400' : 'border-gray-300'} rounded-md`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </td>
              <td className="border p-2">
                {log.colors[log.highlightIndex] && (
                  <div
                    className="w-8 h-8 border border-yellow-400 rounded-md"
                    style={{ backgroundColor: log.colors[log.highlightIndex] }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}