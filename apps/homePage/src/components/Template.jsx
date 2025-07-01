import React, { memo } from 'react'; 
import { ExternalLink, FolderOpen } from 'lucide-react'; 

const TemplateCard = memo(({ template }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <div className="relative overflow-hidden flex-grow-0 flex-shrink-0 h-[300px] sm:h-[350px] lg:h-[400px] border-b border-gray-100">
        <iframe
          src={template.url}
          title={`${template.name} preview`}
          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent pt-12 pb-4 px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <h3 className="text-xl font-semibold text-white truncate text-shadow-md">
            {template.name}
          </h3>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center bg-gray-50 flex-grow"> 
        <a
          href={template.url}
          target="_blank"
          rel="noreferrer noopener" 
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          title="Open Live Demo"
        >
          <ExternalLink size={16} className="mr-2" />
          Live Demo
        </a>
      
        {template.repoUrl && ( 
          <a
            href={template.repoUrl || '#'} 
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
            title="Explore Project Files"
          >
            <FolderOpen size={16} className="mr-2" />
            Code/Files
          </a>
        )}
       
      </div>
    </div>
  );
});

export default TemplateCard;