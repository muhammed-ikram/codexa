import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { previewContent } = location.state || {};
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Press 'Esc' to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      // Press 'F11' to toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get the preview content from localStorage if not passed in state
  const getPreviewContent = () => {
    if (previewContent) {
      return previewContent;
    }
    
    try {
      const savedContent = localStorage.getItem('ide_preview_content');
      return savedContent || '';
    } catch (e) {
      return '';
    }
  };

  const content = getPreviewContent();

  return (
    <div className={`h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Bar */}
      <div className="h-14 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">Preview</h1>
          <span className="text-sm text-gray-400">Standalone Preview</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleFullscreen}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Back to Editor
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-white">
        {content ? (
          <iframe
            title="standalone-preview"
            srcDoc={content}
            className="w-full h-full border-0"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-scripts allow-same-origin"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">No Preview Content</h2>
              <p className="text-gray-500 mb-4">No preview content was provided.</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Back to Editor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="py-3 text-center text-gray-500 text-xs border-t border-gray-800">
        <p className="mb-1">
          <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
        </p>
        <p>© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PreviewPage;