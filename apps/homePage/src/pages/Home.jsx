import React, { useEffect, useState, useRef, useCallback } from 'react';
import TemplateCard from '../components/Template';
import Pagination from '../components/Pagination';

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const isMounted = useRef(false);
  const infiniteScrollObserver = useRef(); // Moved useRef here to persist observer instance

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Clean up observer when component unmounts
      if (infiniteScrollObserver.current) {
        infiniteScrollObserver.current.disconnect();
      }
    };
  }, []);

  const fetchTemplates = useCallback(async (pageToFetch, append = false) => {
    // Prevent fetching if already fetching
    if (isFetching) return;

    // A critical check: if we are trying to append, but we explicitly know there's no more data
    if (append && !hasMore) {
        setIsFetching(false); // Ensure isFetching is false if this early exit occurs
        return;
    }
    // Prevent fetching if trying to fetch beyond total pages for non-appending calls
    if (!append && pageToFetch > totalPages && totalPages > 0) {
        setIsFetching(false);
        return;
    }

    if (!isMounted.current) return;

    setIsFetching(true);
    setError(null);

    if (pageToFetch === 1 || !append) {
      setLoading(true); // Only show full loading spinner for initial load or full page changes
    }

    try {
      const limit = 12;
      const response = await fetch(`/api/templates?page=${pageToFetch}&limit=${limit}`);

      if (!isMounted.current) return;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!isMounted.current) return;

      setTemplates(prevTemplates => {
        if (append) {
          const newTemplates = data.templates.filter(
            (newTemp) => !prevTemplates.some((existingTemp) => existingTemp.id === newTemp.id)
          );
          return [...prevTemplates, ...newTemplates];
        } else {
          return data.templates;
        }
      });

      setTotalPages(data.totalPages);
      setHasMore(data.hasMore);
      setCurrentPage(data.currentPage);
    } catch (err) {
      if (!isMounted.current) return;
      console.error("Failed to load templates:", err);
      setError("Failed to load templates. Please try again later.");
      setHasMore(false);
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
        setLoading(false);
      }
    }
  }, [isFetching, hasMore, totalPages, isMounted]);


  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage || isFetching) {
      return;
    }
    // IMPORTANT: Disconnect observer when page changes via pagination
    if (infiniteScrollObserver.current) {
      infiniteScrollObserver.current.disconnect();
    }
    setCurrentPage(pageNumber); // This will trigger a re-render
    fetchTemplates(pageNumber, false); // Fetch the specific page, do not append
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, totalPages, isFetching, fetchTemplates]);

  // This ref callback manages the IntersectionObserver
  const lastTemplateCardRef = useCallback(node => {
    // Disconnect existing observer if it exists
    if (infiniteScrollObserver.current) {
      infiniteScrollObserver.current.disconnect();
    }

    // Only attach observer if we are on the last page and there's more data
    // and if a node is provided (the last template card)
    if (node && hasMore && currentPage === totalPages && !isFetching) {
      infiniteScrollObserver.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching && currentPage === totalPages) {
          fetchTemplates(currentPage + 1, true);
        }
      }, { threshold: 0.5 });
      infiniteScrollObserver.current.observe(node);
    }
  }, [isFetching, hasMore, currentPage, totalPages, fetchTemplates]); // Dependencies are critical

  // Initial fetch on component mount or after retry
  useEffect(() => {
    // Only fetch if templates are empty AND we're on the first page AND not currently fetching
    if (templates.length === 0 && currentPage === 1 && !isFetching && !error) {
      fetchTemplates(1, false);
    }
  }, [fetchTemplates, templates.length, currentPage, isFetching, error]);

  if (loading && templates.length === 0) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 dark:bg-red-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center border border-red-200 dark:border-red-700">
          <h2 className="text-3xl font-extrabold text-red-700 dark:text-red-300 mb-4">Oops! Error Loading Templates</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-3">{error}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Please ensure your backend server is running and accessible and returns valid data.
          </p>
          <button
            onClick={() => {
              setTemplates([]);
              setCurrentPage(1);
              setHasMore(true);
              setError(null);
              setLoading(true);
              setTotalPages(1);
              setIsFetching(false);
              fetchTemplates(1, false);
            }}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen sm:mx-10 md:mx-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-16 tracking-tight leading-tight">
          Discover Our Curated <span className="text-blue-600 dark:text-blue-400">Templates</span>
        </h1>
        {templates.length === 0 && !isFetching && !loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-xl p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="mb-4">No templates found.</p>
            <p>It seems there are no templates to display at the moment. Please check your server configuration or the 'apps' directory for available templates.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
              {templates.map((template, index) => {
                // Determine if this is the last item on the last page AND infinite scroll is enabled
                const isLastItemForInfiniteScroll = hasMore && currentPage === totalPages && (templates.length - 1 === index);
                return (
                  <TemplateCard
                    ref={isLastItemForInfiniteScroll ? lastTemplateCardRef : null}
                    key={template.id || template.url}
                    template={template}
                  />
                );
              })}
            </div>
            {isFetching && hasMore && currentPage === totalPages && ( // Only show loading more when appending
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500"></div>
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-150"></div>
                  <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-300"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-md font-medium ml-3">Loading more templates...</p>
                </div>
              </div>
            )}
            {!hasMore && templates.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-md">
                <p>You've reached the end of the template list!</p>
              </div>
            )}
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