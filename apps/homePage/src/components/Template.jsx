import React, { memo, forwardRef } from 'react';
import { ExternalLink, FolderOpen, Download } from 'lucide-react'; // Make sure you have lucide-react installed

// TemplateCard is wrapped with React.memo for performance optimization
// and forwardRef to allow the parent component (Home) to attach a ref to its DOM element
const TemplateCard = memo(forwardRef(({ template }, ref) => {
  // Defensive check: ensure template object exists
  if (!template) {
    return null; // Or render a placeholder/error message
  }

  return (
    <div
      ref={ref} // Attach the ref passed from the parent component (used for infinite scroll)
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col h-full"
    >
      {/* Template Preview Section */}
      <div className="relative flex-grow-0 flex-shrink-0 h-60 sm:h-72 border-b border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Iframe for live preview */}
        <iframe
          src={template.url}
          title={`${template.name} preview`}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          loading="lazy" // Lazy load the iframe
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Essential for security and functionality
        />
        {/* Overlay with template name on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-12 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <h3 className="text-xl font-semibold text-white truncate text-shadow-lg">
            {template.name}
          </h3>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="p-5 flex flex-wrap justify-between items-center bg-gray-50 dark:bg-gray-900 flex-grow gap-3"> {/* Added gap-3 for spacing between buttons */}
        {/* Live Demo Button */}
        {template.url && ( // Only render if template.url exists
          <a
            href={template.url}
            target="_blank" // Open in new tab
            rel="noreferrer noopener" // Security best practice for target="_blank"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 dark:bg-blue-500 dark:hover:bg-blue-600"
            title="Open Live Demo"
          >
            <ExternalLink size={16} className="mr-2" />
            Live Demo
          </a>
        )}

        {/* Code Button (Link to GitHub Repository) */}
        {template.githubRepoUrl && ( // Only render if template.githubRepoUrl exists
          <a
            href={template.githubRepoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            title="Explore Project Files on GitHub"
          >
            <FolderOpen size={16} className="mr-2" />
            Code
          </a>
        )}

        {/* Download Button (Link to DownGit for folder download) */}
        {template.downloadLink && ( // Only render if template.downloadLink exists
          <a
            href={template.downloadLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 dark:bg-green-500 dark:hover:bg-green-600"
            title="Download Template (ZIP)"
          >
            <Download size={16} className="mr-2" />
            Download
          </a>
        )}
      </div>
    </div>
  );
}));

export default TemplateCard;