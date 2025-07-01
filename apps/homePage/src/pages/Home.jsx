import React, { useEffect, useState, memo } from 'react';
import TemplateCard from '../components/Template'; // Corrected import name

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Ensure this URL is correct based on your server setup
        // If your React app is served by the same Node.js server,
        // a relative path like '/api/templates' is usually fine.
        // If running React dev server (e.g., 3000) and Node.js server (e.g., 3001) separately,
        // you'll need the full URL: 'http://localhost:3001/api/templates'
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load templates. Please try again later."); // User-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-xl font-medium">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Templates</h2>
          <p className="text-gray-700">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Please ensure the backend server is running and accessible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-20"> {/* Increased max-width for more spacious layout */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 tracking-tight">
          Explore Our Creative Templates
        </h1>

        {templates.length === 0 ? (
          <div className="text-center text-gray-600 text-xl p-8 bg-white rounded-lg shadow-md">
            <p>No templates found. Check your server configuration or the 'apps' directory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-15"> {/* Adjusted grid for more columns on larger screens */}
            {templates.map((template) => (
              // Using template.url or a unique ID from your server as key is better than index
              <TemplateCard key={template.url} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;