// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import CodeEditor from './CodeEditor';
// import AiMentorPanel from './AiMentorPanel';

// const Workspace = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState({
//     name: "E-commerce Platform",
//     techStack: ["React", "Node.js", "MongoDB"],
//     progress: 75,
//     milestones: [
//       {
//         id: '1',
//         title: 'Project Setup',
//         description: 'Initialize the project structure and install dependencies',
//         priority: 'high',
//         estimatedTime: '2 hours',
//         completed: false
//       },
//       {
//         id: '2',
//         title: 'Database Design',
//         description: 'Design the database schema and create models',
//         priority: 'high',
//         estimatedTime: '4 hours',
//         completed: false
//       },
//       {
//         id: '3',
//         title: 'Authentication System',
//         description: 'Implement user registration and login functionality',
//         priority: 'medium',
//         estimatedTime: '6 hours',
//         completed: true
//       },
//       {
//         id: '4',
//         title: 'Product Management',
//         description: 'Create CRUD operations for products',
//         priority: 'medium',
//         estimatedTime: '8 hours',
//         completed: false
//       },
//       {
//         id: '5',
//         title: 'Shopping Cart',
//         description: 'Implement shopping cart functionality',
//         priority: 'high',
//         estimatedTime: '5 hours',
//         completed: false
//       },
//       {
//         id: '6',
//         title: 'Payment Integration',
//         description: 'Integrate payment gateway for transactions',
//         priority: 'high',
//         estimatedTime: '7 hours',
//         completed: false
//       },
//       {
//         id: '7',
//         title: 'Testing',
//         description: 'Write unit tests and perform integration testing',
//         priority: 'medium',
//         estimatedTime: '10 hours',
//         completed: false
//       },
//       {
//         id: '8',
//         title: 'Deployment',
//         description: 'Deploy the application to production environment',
//         priority: 'high',
//         estimatedTime: '3 hours',
//         completed: false
//       }
//     ]
//   });
//   const [loading, setLoading] = useState(false); // Changed default to false
//   const [error, setError] = useState('');
//   const [codeEditorWidth, setCodeEditorWidth] = useState(() => {
//     // Default to 70% but adjust based on screen size
//     if (typeof window !== 'undefined') {
//       return window.innerWidth > 1200 ? '70%' : '65%';
//     }
//     return '70%';
//   });
//   const [mentorPanelWidth, setMentorPanelWidth] = useState(() => {
//     // Default to 320px but adjust based on screen size
//     if (typeof window !== 'undefined') {
//       return window.innerWidth > 1200 ? 350 : 320;
//     }
//     return 320;
//   });
//   const [isResizing, setIsResizing] = useState(null);
//   const [showMentorPanel, setShowMentorPanel] = useState(false); // For mobile toggle
//   const workspaceRef = useRef(null);

//   // Function to fetch project data from backend
//   const fetchProjectData = async (id) => {
//     try {
//       setLoading(true);
//       // Replace this with your actual API call
//       // const response = await yourBackendAPI.getProject(id);
//       // setProject(response.data);
      
//       // For now, we'll keep the sample project data
//       // In a real implementation, you would fetch the actual project data
//       // setProject(null);
//     } catch (err) {
//       setError('Failed to load project data');
//       console.error('Error fetching project:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to update project data
//   const updateProject = (updatedProject) => {
//     setProject(prevProject => ({
//       ...prevProject,
//       ...updatedProject
//     }));
//   };

//   useEffect(() => {
//     if (projectId) {
//       fetchProjectData(projectId);
//     }
//   }, [projectId]);

//   const handleResizeStart = (e, panelType) => {
//     e.preventDefault();
//     setIsResizing(panelType);
//     document.body.classList.add('select-none');
//   };

//   const handleResize = (e) => {
//     if (!isResizing || !workspaceRef.current) return;
    
//     const workspaceRect = workspaceRef.current.getBoundingClientRect();
    
//     if (isResizing === 'code') {
//       // Resizing code editor
//       const newWidth = ((e.clientX - workspaceRect.left) / workspaceRect.width) * 100;
//       // Set minimum and maximum widths (30% to 80%)
//       if (newWidth >= 30 && newWidth <= 80) {
//         setCodeEditorWidth(`${newWidth}%`);
//       }
//     } else if (isResizing === 'mentor') {
//       // Resizing mentor panel
//       const newWidth = workspaceRect.right - e.clientX;
//       // Set minimum and maximum widths (250px to 600px)
//       if (newWidth >= 250 && newWidth <= 600) {
//         setMentorPanelWidth(newWidth);
//       }
//     }
//   };

//   const handleResizeEnd = () => {
//     setIsResizing(null);
//     document.body.classList.remove('select-none');
//   };

//   useEffect(() => {
//     const handleResizeMove = (e) => {
//       handleResize(e);
//     };

//     const handleResizeStop = () => {
//       handleResizeEnd();
//     };

//     if (isResizing) {
//       document.addEventListener('mousemove', handleResizeMove);
//       document.addEventListener('mouseup', handleResizeStop);
//       document.body.style.cursor = isResizing === 'code' ? 'col-resize' : 'col-resize';
//       document.body.classList.add('select-none');
//     }
    
//     return () => {
//       document.removeEventListener('mousemove', handleResizeMove);
//       document.removeEventListener('mouseup', handleResizeStop);
//       document.body.style.cursor = 'default';
//       document.body.classList.remove('select-none');
//     };
//   }, [isResizing]);
  
//   // Set initial panel width based on screen size
//   useEffect(() => {
//     const updatePanelWidth = () => {
//       if (window.innerWidth > 1400 && mentorPanelWidth < 350) {
//         setMentorPanelWidth(350);
//       } else if (window.innerWidth <= 1400 && window.innerWidth > 1200 && mentorPanelWidth !== 320) {
//         setMentorPanelWidth(320);
//       } else if (window.innerWidth <= 1200 && mentorPanelWidth > 300) {
//         setMentorPanelWidth(300);
//       }
//     };
    
//     updatePanelWidth();
//     window.addEventListener('resize', updatePanelWidth);
    
//     return () => window.removeEventListener('resize', updatePanelWidth);
//   }, [mentorPanelWidth]); // Added dependency

//   if (loading) {
//     return (
//       <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex items-center justify-center">
//         <div className="flex items-center space-x-3 animate-fade-in">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
//           <span className="text-lg">Loading workspace...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex items-center justify-center">
//         <div className="text-center animate-fade-in">
//           <div className="text-red-400 text-6xl mb-4">⚠️</div>
//           <h1 className="text-2xl font-bold mb-2">Error Loading Workspace</h1>
//           <p className="text-monaco-text-secondary mb-4">{error}</p>
//           <button
//             onClick={() => fetchProjectData(projectId)}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div ref={workspaceRef} className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
//       {/* Top Bar */}
//       <div className="h-14 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 flex items-center justify-between px-4">
//         <div className="flex items-center space-x-3">
//           <h1 className="text-lg font-semibold">
//             {project?.name || 'Workspace'}
//           </h1>
//           <div className="flex items-center space-x-2">
//             {project?.techStack?.map((tech, index) => (
//               <span
//                 key={index}
//                 className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 rounded"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>
      
//         <div className="flex items-center space-x-3">
//           {/* Mobile Mentor Toggle Button */}
//           <button 
//             className="md:hidden bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-colors"
//             onClick={() => setShowMentorPanel(!showMentorPanel)}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h2v2H9V9z" clipRule="evenodd" />
//             </svg>
//           </button>
          
//           <button
//             onClick={() => navigate(`/launch-advisor/${projectId}`)}
//             className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-3 py-1.5 rounded text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//           >
//             Launch Advisor
//           </button>
//           <span className="text-sm text-gray-400">
//             {project?.progress || 0}%
//           </span>
//           <div className="w-20 bg-gray-700 rounded-full h-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full"
//               style={{ width: `${project?.progress || 0}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Main Workspace */}
//       <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
//         {/* Left Panel - Code Editor */}
//         <div 
//           className="flex flex-col min-h-0"
//           style={{ width: codeEditorWidth }}
//         >
//           <CodeEditor />
//         </div>

//         {/* Resize Handle - Code Editor */}
//         <div 
//           className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative z-10"
//           onMouseDown={(e) => handleResizeStart(e, 'code')}
//         >
//           <div className="absolute top-1/2 left-0.5 w-1 h-8 bg-gray-500 rounded"></div>
//         </div>

//         {/* Right Panel - AI Mentor */}
//         <div 
//           className="hidden md:block border-l border-gray-700 flex flex-col min-h-0"
//           style={{ width: `${mentorPanelWidth}px` }}
//         >
//           <AiMentorPanel 
//             project={project} 
//             onProjectUpdate={updateProject}
//           />
//         </div>
        
//         {/* Resize Handle - Mentor Panel */}
//         <div 
//           className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative z-10"
//           onMouseDown={(e) => handleResizeStart(e, 'mentor')}
//         >
//           <div className="absolute top-1/2 left-0.5 w-1 h-8 bg-gray-500 rounded"></div>
//         </div>
        
//         {/* Bottom Panel - AI Mentor (mobile) - toggleable */}
//         {showMentorPanel && (
//           <div className="md:hidden border-t border-gray-700 flex flex-col min-h-0 absolute bottom-0 left-0 right-0 z-20" style={{ height: '40%' }}>
//             <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
//               <span className="font-medium">AI Mentor</span>
//               <button 
//                 onClick={() => setShowMentorPanel(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//             <AiMentorPanel 
//               project={project} 
//               onProjectUpdate={updateProject}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Workspace;






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
  };

  const handleResize = (e) => {
    if (!isResizing || !workspaceRef.current) return;
    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    if (isResizing === 'code') {
      const newWidth = ((e.clientX - workspaceRect.left) / workspaceRect.width) * 100;
      if (newWidth >= 30 && newWidth <= 80) {
        setCodeEditorWidth(`${newWidth}%`);
      }
    } else if (isResizing === 'mentor') {
      const newWidth = workspaceRect.right - e.clientX;
      if (newWidth >= 250 && newWidth <= 600) {
        setMentorPanelWidth(newWidth);
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(null);
    document.body.classList.remove('select-none');
  };

  useEffect(() => {
    const handleMove = (e) => handleResize(e);
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
    <div ref={workspaceRef} className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="flex flex-col min-h-0" style={{ width: codeEditorWidth }}>
          <CodeEditor project={project} onProjectChange={(p) => updateProject(p)} />
        </div>

        {/* Resize handle for code editor */}
        <div className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize relative z-10" onMouseDown={(e) => handleResizeStart(e, 'code')}>
          <div className="absolute top-1/2 left-0.5 w-1 h-8 bg-gray-500 rounded" />
        </div>

        {/* Mentor panel */}
        <div className="hidden md:block border-l border-gray-700 flex flex-col min-h-0" style={{ width: `${mentorPanelWidth}px` }}>
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
        <div className="hidden md:block w-2 bg-gray-700 hover:bg-blue-500 cursor-col-resize relative z-10" onMouseDown={(e) => handleResizeStart(e, 'mentor')}>
          <div className="absolute top-1/2 left-0.5 w-1 h-8 bg-gray-500 rounded" />
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
