// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api'; // Import the api utility

// // Auth context - you would replace this with your actual auth context
// const AuthContext = React.createContext({ user: null });

// // ProjectCard component
// const ProjectCard = ({ project }) => {
//   // Tech stack color mapping
//   const techColors = {
//     'React': 'bg-blue-500',
//     'Vue.js': 'bg-green-500',
//     'Node.js': 'bg-green-600',
//     'Next.js': 'bg-gray-800',
//     'Express': 'bg-gray-600',
//     'MongoDB': 'bg-green-700',
//     'PostgreSQL': 'bg-blue-700',
//     'MySQL': 'bg-orange-500',
//     'Tailwind': 'bg-cyan-500',
//     'API': 'bg-purple-500',
//     'Socket.io': 'bg-gray-700',
//     'Redis': 'bg-red-500',
//     'Prisma': 'bg-indigo-600',
//     'Gatsby': 'bg-purple-600',
//     'GraphQL': 'bg-pink-500',
//     'Netlify': 'bg-teal-500'
//   };

//   return (
//     <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in transform hover:scale-[1.02]">
//       <div className="flex items-start justify-between mb-3">
//         <h3 className="text-lg font-semibold text-white truncate pr-2 transition-colors duration-300 hover:text-blue-400">
//           {project.name}
//         </h3>
//         <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full transition-all duration-300 hover:bg-gray-600">
//           {project.progress || 0}%
//         </span>
//       </div>
      
//       {/* Tech Stack */}
//       <div className="flex flex-wrap gap-1 mb-4">
//         {project.techStack?.map((tech, index) => (
//           <span
//             key={index}
//             className={`text-xs px-2 py-1 rounded-full text-white transition-all duration-300 hover:scale-105 ${
//               techColors[tech] || 'bg-gray-600'
//             }`}
//           >
//             {tech}
//           </span>
//         ))}
//       </div>
      
//       {/* Progress Bar */}
//       <div className="w-full">
//         <div className="flex justify-between text-xs text-gray-400 mb-1">
//           <span>Progress</span>
//           <span>{project.progress || 0}%</span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-1.5">
//           <div
//             className={`h-1.5 rounded-full transition-all duration-300 ${
//               project.progress === 100
//                 ? 'bg-green-500'
//                 : project.progress >= 70
//                 ? 'bg-blue-500'
//                 : project.progress >= 40
//                 ? 'bg-yellow-500'
//                 : 'bg-orange-500'
//             }`}
//             style={{ width: `${project.progress || 0}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [promptText, setPromptText] = useState('');
//   const [projects, setProjects] = useState([
//     {
//       id: '1',
//       name: 'E-commerce Platform',
//       techStack: ['React', 'Node.js', 'MongoDB'],
//       progress: 75
//     },
//     {
//       id: '2',
//       name: 'Task Management App',
//       techStack: ['Vue.js', 'Express', 'PostgreSQL'],
//       progress: 40
//     },
//     {
//       id: '3',
//       name: 'Portfolio Website',
//       techStack: ['Next.js', 'Tailwind CSS'],
//       progress: 90
//     }
//   ]);
//   const [recentActivity, setRecentActivity] = useState([
//     { action: 'Updated', project: 'E-commerce Platform', time: '2 hours ago' },
//     { action: 'Created', project: 'Task Management App', time: '1 day ago' },
//     { action: 'Completed', project: 'Portfolio Website', time: '3 days ago' }
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null); // State to store user data
//   const [error, setError] = useState(''); // State to handle errors
  
//   // Get user from auth context (you would replace this with your actual auth context)
//   const authContext = useContext(AuthContext);
//   // Use API data if available, otherwise fallback to context
//   const username = user?.username || authContext?.user?.name || 'Developer';

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/auth/profile');
//         setUser(response.data.user);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching user profile:', err);
//         setError('Failed to load user profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleGenerateProject = () => {
//     if (promptText.trim()) {
//       // Navigate to projects page to create new project
//       navigate('/projects');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleGenerateProject();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       {/* Main Container */}
//       <div className="p-6 max-w-7xl mx-auto">
//         {/* Main Heading */}
//         <div className="mb-8 animate-fade-in">
//           <h1 className="text-2xl font-bold">
//             Welcome back, <span className="text-blue-400">{username}</span>
//           </h1>
//           <p className="text-gray-400 text-sm mt-1">Here's what's happening with your projects today</p>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 animate-slide-up">
//             <div className="flex items-center">
//               <div className="p-3 rounded-lg bg-blue-500/10 mr-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-gray-400 text-sm">Total Projects</p>
//                 <p className="text-2xl font-bold">12</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 animate-slide-up">
//             <div className="flex items-center">
//               <div className="p-3 rounded-lg bg-green-500/10 mr-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-gray-400 text-sm">Completed</p>
//                 <p className="text-2xl font-bold">5</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 animate-slide-up">
//             <div className="flex items-center">
//               <div className="p-3 rounded-lg bg-yellow-500/10 mr-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-gray-400 text-sm">In Progress</p>
//                 <p className="text-2xl font-bold">7</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Zone */}
//         <div className="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 animate-slide-up">
//           <h2 className="text-lg font-semibold mb-4 text-white">
//             Start a new project
//           </h2>
          
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 value={promptText}
//                 onChange={(e) => setPromptText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Describe the project you want to build..."
//                 className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-200 text-sm"
//               />
//             </div>
            
//             <button
//               onClick={handleGenerateProject}
//               disabled={!promptText.trim()}
//               className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
//                 !promptText.trim()
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg hover:shadow-xl"
//               }`}
//             >
//               Generate Project
//             </button>
//           </div>
//         </div>

//         {/* Project Grid */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
//             <button 
//               onClick={() => navigate('/projects')}
//               className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors"
//             >
//               View All
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {projects.map((project) => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="animate-slide-up">
//           <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
//           <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700">
//             <div className="space-y-3">
//               {recentActivity.map((activity, index) => (
//                 <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </div>
//                     <div>
//                       <span className="text-white text-sm">{activity.action}</span>
//                       <span className="text-blue-400 text-sm font-medium ml-1">{activity.project}</span>
//                     </div>
//                   </div>
//                   <span className="text-xs text-gray-400">{activity.time}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Auth context placeholder
const AuthContext = React.createContext({ user: null });

// Project Card
const ProjectCard = ({ project, onClick }) => {
  const techColors = {
    React: 'bg-blue-500',
    'Node.js': 'bg-green-600',
    MongoDB: 'bg-green-700',
    Vue: 'bg-green-500',
    Next: 'bg-gray-800',
    Express: 'bg-gray-600',
    PostgreSQL: 'bg-blue-700',
    Tailwind: 'bg-cyan-500',
    API: 'bg-purple-500',
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg cursor-pointer"
      onClick={() => onClick(project._id)}
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-white font-semibold truncate">{project.title}</h3>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {project.progress || 0}%
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {project.techStack?.map((tech, idx) => (
          <span
            key={idx}
            className={`text-xs px-2 py-1 rounded-full text-white ${
              techColors[tech] || 'bg-gray-600'
            }`}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?._id;
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!description.trim() || !techStackInput.trim()) return;

    const techArray = techStackInput.split(',').map(t => t.trim()).filter(t => t);

    const newProject = {
      title: description.substring(0, 20), // short title
      description,
      techStack: techArray,
      createdBy: userId,
      milestones: [],
      blueprint: [],
      currentMilestone: '',
      isCompleted: false,
    };

    setLoading(true);
    try {
      const res = await api.post('/projects', newProject);
      setProjects(prev => [...prev, res.data.project]);
      setDescription('');
      setTechStackInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Project Creation */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 mb-8">
        <h2 className="text-lg font-semibold mb-4">Start a new project</h2>

        <textarea
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-3 text-white"
          rows={3}
          placeholder="Describe your project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-3 text-white"
          placeholder="Enter tech stack (comma-separated, e.g. React, Node.js, MongoDB)"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
        />

        <button
          onClick={handleCreateProject}
          disabled={loading || !description.trim() || !techStackInput.trim()}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onClick={handleProjectClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
