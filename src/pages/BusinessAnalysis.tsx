import { Link } from 'react-router-dom';

export function BusinessAnalysis() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Business Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Performance Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Revenue Analysis</h3>
                <p className="mt-2 text-gray-600">View your business revenue trends and patterns</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Cost Analysis</h3>
                <p className="mt-2 text-gray-600">Track and analyze your business expenses</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Growth Metrics</h3>
                <p className="mt-2 text-gray-600">Monitor your business growth indicators</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$0.00</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Monthly Growth</p>
                  <p className="text-2xl font-bold text-gray-900">0%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 