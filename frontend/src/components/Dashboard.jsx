import React, { useState, useContext, useEffect } from 'react';

// Auth context - you would replace this with your actual auth context
const AuthContext = React.createContext({ user: null });

// ProjectCard component
const ProjectCard = ({ project }) => {
  // Tech stack color mapping
  const techColors = {
    'React': 'bg-blue-500',
    'Vue.js': 'bg-green-500',
    'Node.js': 'bg-green-600',
    'Next.js': 'bg-gray-800',
    'Express': 'bg-gray-600',
    'MongoDB': 'bg-green-700',
    'PostgreSQL': 'bg-blue-700',
    'MySQL': 'bg-orange-500',
    'Tailwind': 'bg-cyan-500',
    'API': 'bg-purple-500',
    'Socket.io': 'bg-gray-700',
    'Redis': 'bg-red-500',
    'Prisma': 'bg-indigo-600',
    'Gatsby': 'bg-purple-600',
    'GraphQL': 'bg-pink-500',
    'Netlify': 'bg-teal-500'
  };

  return (
    <div className="bg-monaco-sidebar border border-monaco-border rounded-lg p-6 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-monaco-text truncate pr-2">
          {project.name}
        </h3>
        <span className="text-xs text-monaco-text-secondary bg-monaco-bg px-2 py-1 rounded">
          {project.progress || 0}%
        </span>
      </div>
      
      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack?.map((tech, index) => (
          <span
            key={index}
            className={`text-xs px-2 py-1 rounded-full text-white ${
              techColors[tech] || 'bg-gray-500'
            }`}
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-monaco-text-secondary mb-1">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="w-full bg-monaco-bg rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              project.progress === 100
                ? 'bg-green-500'
                : project.progress >= 70
                ? 'bg-blue-500'
                : project.progress >= 40
                ? 'bg-yellow-500'
                : 'bg-orange-500'
            }`}
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 text-xs bg-monaco-bg hover:bg-monaco-hover text-monaco-text border border-monaco-border rounded px-3 py-2 transition-colors">
          Open
        </button>
        <button className="flex-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2 transition-colors">
          Continue
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [promptText, setPromptText] = useState('');
  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user from auth context (you would replace this with your actual auth context)
  const authContext = useContext(AuthContext);
  const username = authContext?.user?.name || 'Developer';

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Replace this with your actual API call
      // const response = await yourBackendAPI.getProjects();
      // setProjects(response.data);
      
      // For now, we'll set projects to empty array to indicate no data
      setProjects([]);
      setRecentActivity([]);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleGenerateProject = () => {
    console.log('Generating project with prompt:', promptText);
    // Here you would implement the actual project generation logic
    if (promptText.trim()) {
      console.log(`User wants to build: ${promptText}`);
      // You could navigate to a project setup page or open a modal
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerateProject();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-monaco-bg text-monaco-text flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-monaco-bg text-monaco-text flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
          <p className="text-monaco-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-monaco-bg text-monaco-text">
      {/* Main Container */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to Codex, {username}!
        </h1>

        {/* Action Zone */}
        <div className="mb-12 bg-monaco-sidebar rounded-2xl p-8 border border-monaco-border">
          <h2 className="text-2xl font-semibold mb-6 text-center text-monaco-text">
            What would you like to build today?
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the project you want to build..."
                className="w-full p-4 bg-monaco-bg border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-monaco-text placeholder-monaco-text-secondary transition-all duration-200 text-lg"
              />
            </div>
            
            <button
              onClick={handleGenerateProject}
              disabled={!promptText.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <span>🚀</span>
                Generate Project
              </span>
            </button>
          </div>
          
          {/* Quick Suggestions - Made dynamic */}
          <div className="mt-6">
            <p className="text-sm text-monaco-text-secondary mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {[] /* Empty array to remove static suggestions */}
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-monaco-text">My Projects</h2>
            <button className="text-sm bg-monaco-sidebar hover:bg-monaco-hover text-monaco-text border border-monaco-border rounded-lg px-4 py-2 transition-colors">
              View All
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-monaco-text-secondary mb-6">Create your first project to get started</p>
              <button
                onClick={() => document.querySelector('input[type="text"]').focus()}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-monaco-sidebar border border-monaco-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {projects.length}
            </div>
            <div className="text-monaco-text-secondary">Total Projects</div>
          </div>
          
          <div className="bg-monaco-sidebar border border-monaco-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {projects.filter(p => p.progress === 100).length}
            </div>
            <div className="text-monaco-text-secondary">Completed</div>
          </div>
          
          <div className="bg-monaco-sidebar border border-monaco-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {projects.filter(p => p.progress > 0 && p.progress < 100).length}
            </div>
            <div className="text-monaco-text-secondary">In Progress</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-monaco-text mb-4">Recent Activity</h3>
          <div className="bg-monaco-sidebar border border-monaco-border rounded-lg p-6">
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-monaco-border last:border-b-0">
                    <div>
                      <span className="text-monaco-text">{activity.action}</span>
                      <span className="text-blue-400 ml-2">{activity.project}</span>
                    </div>
                    <span className="text-xs text-monaco-text-secondary">{activity.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-monaco-text-secondary">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;