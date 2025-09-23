
// src/components/Workspace.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import AiMentorPanel from './AiMentorPanel';
import api from '../utils/api'; // your axios instance configured for auth/baseURL

const Workspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeEditorWidth, setCodeEditorWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1200 ? '70%' : '65%';
    }
    return '70%';
  });
  const [mentorPanelWidth, setMentorPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1200 ? 350 : 320;
    }
    return 320;
  });
  const [isResizing, setIsResizing] = useState(null);
  const [showMentorPanel, setShowMentorPanel] = useState(false);
  const workspaceRef = useRef(null);

  // Fetch project data by id
  const fetchProjectData = async (id) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/projects/${id}`);
      if (res?.data?.project) {
        setProject(res.data.project);
      } else {
        setProject(null);
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err?.response?.data?.message || 'Failed to load project data');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  // Update project locally and optionally persist to backend
  // fieldsToUpdate: an object with fields to merge & persist
  const updateProject = async (fieldsToUpdate = {}, persist = true) => {
    // optimistic local update
    setProject((prev) => ({ ...(prev || {}), ...(fieldsToUpdate || {}) }));

    if (!persist || !projectId) return;

    try {
      const res = await api.patch(`/projects/${projectId}`, fieldsToUpdate);
      if (res?.data?.project) {
        setProject(res.data.project);
      }
    } catch (err) {
      console.error('Failed to persist project update:', err);
      // optional: re-fetch to ensure consistency
      fetchProjectData(projectId);
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectData(projectId);
  }, [projectId]);

  // Resizing logic (same as your original but wired to dynamic layout)
  const handleResizeStart = (e, panelType) => {
    e.preventDefault();
    setIsResizing(panelType);
    document.body.classList.add('select-none');
    document.body.style.cursor = 'col-resize';
  };

  const handleResize = (e) => {
    if (!isResizing || !workspaceRef.current) return;
    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    if (isResizing === 'code') {
      const newPercent = ((e.clientX - workspaceRect.left) / workspaceRect.width) * 100;
      const clampedPercent = Math.max(10, Math.min(85, newPercent));
      setCodeEditorWidth(`${clampedPercent}%`);
      // Adjust mentor width to fill remaining space accounting for handles
      const handleTotalPx = 8; // approximate combined handles width
      const remainingPx = Math.max(0, (100 - clampedPercent) * workspaceRect.width / 100 - handleTotalPx);
      const minWidth = 240;
      const maxWidth = Math.max(minWidth, Math.min(workspaceRect.width * 0.85, workspaceRect.width - 300));
      const clampedMentor = Math.max(minWidth, Math.min(maxWidth, remainingPx));
      setMentorPanelWidth(clampedMentor);
    } else if (isResizing === 'mentor') {
      const newWidth = workspaceRect.right - e.clientX;
      const minWidth = 240;
      const maxWidth = Math.max(minWidth, Math.min(workspaceRect.width * 0.8, workspaceRect.width - 300));
      const clamped = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setMentorPanelWidth(clamped);
      // Keep total layout stable by adjusting editor width to remaining space
      const handleTotalPx = 8; // two wider handles ~4px each
      const remainingPx = Math.max(0, workspaceRect.width - clamped - handleTotalPx);
      const editorPercent = Math.max(10, Math.min(85, (remainingPx / workspaceRect.width) * 100));
      setCodeEditorWidth(`${editorPercent}%`);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    document.body.classList.remove('select-none');
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    const handleMove = (e) => {
      e.preventDefault();
      handleResize(e);
    };
    const handleUp = () => handleResizeEnd();
    if (isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.body.style.cursor = 'col-resize';
      document.body.classList.add('select-none');
    }
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = 'default';
      document.body.classList.remove('select-none');
    };
  }, [isResizing]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex items-center justify-center">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="text-lg">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-xl">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Workspace</h1>
          <p className="text-monaco-text-secondary mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchProjectData(projectId)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-3">🧭</div>
          <p className="text-gray-300">Project not found</p>
          <button onClick={() => navigate('/projects')} className="mt-4 bg-blue-600 px-4 py-2 rounded">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={workspaceRef} className="min-h-screen h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">{project.title || project.name || 'Workspace'}</h1>
          <div className="flex items-center space-x-2">
            {(project.techStack || []).map((tech, index) => (
              <span key={index} className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded">
                {typeof tech === 'string' ? tech : tech.name || tech.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="md:hidden bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
            onClick={() => setShowMentorPanel((s) => !s)}
            aria-label="Toggle mentor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => navigate(`/launch-advisor/${projectId}`)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Launch Advisor
          </button>

          <span className="text-sm text-gray-400">{project.progress ?? 0}%</span>
          <div className="w-20 bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${project.progress ?? 0}%` }} />
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden" style={{ minWidth: 0, width: '100%', height: 'calc(100vh - 56px)', marginBottom: 0, paddingBottom: 0 }}>
        {/* Code Editor */}
        <div className="flex flex-col min-h-0" style={{ width: codeEditorWidth, minWidth: 0, flexBasis: codeEditorWidth, flexGrow: 1 }}>
          <CodeEditor project={project} onProjectChange={(p) => updateProject(p)} />
        </div>

        {/* Resize handle for code editor */}
        <div className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize relative z-10 flex-shrink-0" onMouseDown={(e) => handleResizeStart(e, 'code')}>
          <div className="absolute top-1/2 left-0 w-2 h-10 bg-gray-500/60 rounded" />
        </div>

        {/* Mentor panel */}
        <div className="hidden md:block border-l border-gray-700 flex flex-col min-h-0 flex-shrink-0" style={{ width: `${mentorPanelWidth}px`, minWidth: 250 }}>
          <AiMentorPanel
            project={project}
            onProjectUpdate={(updated) => updateProject(updated, true)}
            requestAIGeneration={async (action) => {
              // wrapper - call backend to generate content and refresh project
              try {
                const res = await api.post(`/projects/${projectId}/generate`, { action });
                if (res?.data?.project) {
                  setProject(res.data.project);
                  return res.data.project;
                }
                return null;
              } catch (err) {
                console.error('Generation failed', err);
                throw err;
              }
            }}
          />
        </div>

        {/* Resize handle for mentor panel */}
        <div className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize relative z-10 flex-shrink-0" onMouseDown={(e) => handleResizeStart(e, 'mentor')}>
          <div className="absolute top-1/2 left-0 w-2 h-10 bg-gray-500/60 rounded" />
        </div>

        {/* Mobile mentor bottom panel */}
        {showMentorPanel && (
          <div className="md:hidden border-t border-gray-700 flex flex-col min-h-0 absolute bottom-0 left-0 right-0 z-20" style={{ height: '40%' }}>
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
              <span className="font-medium">AI Mentor</span>
              <button onClick={() => setShowMentorPanel(false)} className="text-gray-400 hover:text-white">Close</button>
            </div>
            <AiMentorPanel
              project={project}
              onProjectUpdate={(updated) => updateProject(updated, true)}
              requestAIGeneration={async (action) => {
                const res = await api.post(`/projects/${projectId}/generate`, { action });
                if (res?.data?.project) {
                  setProject(res.data.project);
                  return res.data.project;
                }
                return null;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
