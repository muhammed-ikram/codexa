import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock projects data
  const mockProjects = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      techStack: ['React', 'Node.js', 'MongoDB'],
      progress: 75,
      lastUpdated: '2023-05-15'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Productivity app for team collaboration',
      techStack: ['Vue.js', 'Express', 'PostgreSQL'],
      progress: 40,
      lastUpdated: '2023-05-10'
    },
    {
      id: '3',
      name: 'Portfolio Website',
      description: 'Personal portfolio with blog functionality',
      techStack: ['Next.js', 'Tailwind CSS'],
      progress: 90,
      lastUpdated: '2023-05-18'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/workspace/${projectId}`);
  };

  const handleCreateNewProject = () => {
    // Generate a new project ID
    const newProjectId = `${projects.length + 1}`;
    navigate(`/workspace/${newProjectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-400 mt-2">Manage and access all your coding projects</p>
          </div>
          <button
            onClick={handleCreateNewProject}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-dashed border-gray-700 animate-fade-in">
            <div className="text-5xl mb-6">📁</div>
            <h3 className="text-2xl font-semibold mb-3">No projects yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your first project to get started on your development journey</p>
            <button
              onClick={handleCreateNewProject}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white transition-colors duration-300 hover:text-blue-400">{project.name}</h3>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full transition-all duration-300 hover:bg-gray-600">
                    {project.progress}%
                  </span>
                </div>
                
                <p className="text-gray-400 mb-5 transition-colors duration-300 hover:text-gray-300">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded transition-all duration-300 hover:bg-gray-600 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 transition-colors duration-300 hover:text-gray-400">Last updated: {project.lastUpdated}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-4 text-center text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">
        <div className="flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
          <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
        </div>
        <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ProjectsPage;