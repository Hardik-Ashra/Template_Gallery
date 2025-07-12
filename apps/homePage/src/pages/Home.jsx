import React, { useState, useEffect, useCallback } from 'react';
import TemplateCard from '../components/Template';
import Pagination from '../components/Pagination';

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [displayedTemplates, setDisplayedTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 12; // change to 12 if you want

  useEffect(() => {
    fetch('./templates.json')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setFilteredTemplates(data);
        paginateTemplates(data, 1);
      })
      .catch((err) => {
        console.error("Error loading templates.json:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const paginateTemplates = useCallback((data, page) => {
    const start = (page - 1) * limit;
    const end = page * limit;
    const sliced = data.slice(start, end);
    setDisplayedTemplates(sliced);
    setTotalPages(Math.ceil(data.length / limit));
    setCurrentPage(page);
  }, [limit]);

  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
    paginateTemplates(filteredTemplates, pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredTemplates, totalPages, currentPage, paginateTemplates]);

  const handleSearch = useCallback((e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = templates.filter(t => t.name.toLowerCase().includes(query));
    setFilteredTemplates(filtered);
    paginateTemplates(filtered, 1);
  }, [templates, paginateTemplates]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 delay-150"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 delay-300"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium ml-3">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen sm:mx-10 md:mx-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-12 tracking-tight leading-tight">
          Discover Our Curated <span className="text-blue-600 dark:text-blue-400">Templates</span>
        </h1>

        <div className="mb-12 flex justify-center">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full max-w-lg px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        {displayedTemplates.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-xl p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="mb-4">No templates found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10  lg:gap-20">
              {displayedTemplates.map(template => (
                <TemplateCard
                  key={template.id || template.url}
                  template={template}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
