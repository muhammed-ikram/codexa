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





import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

// Auth context placeholder
const AuthContext = React.createContext({ user: null });

// Tech suggestions
const techSuggestions = [
  // Frontend
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SolidJS",
  // Backend (JS/TS)
  "Node.js", "Express", "NestJS", "Fastify", "Koa",
  // Python
  "Python", "Flask", "Django", "FastAPI",
  // Java / JVM
  "Java", "Spring Boot", "Kotlin", "Micronaut",
  // PHP / Ruby / .NET / Go
  "Laravel", "Symfony", "Ruby on Rails", ".NET", "ASP.NET Core", "Go", "Gin", "Fiber",
  // Databases
  "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch",
  // Messaging / Streaming
  "Kafka", "RabbitMQ",
  // Infra & DevOps
  "Docker", "Kubernetes", "Nginx", "AWS", "GCP", "Azure",
  // Data layer / ORMs / APIs
  "GraphQL", "REST", "Prisma", "TypeORM", "Hibernate", "Sequelize",
  // Languages & Tooling
  "TypeScript", "JavaScript", "Bun",
  // Auth / Realtime
  "Auth0", "JWT", "Socket.io",
  // UI / CSS
  "Tailwind", "Bootstrap", "Chakra UI", "Material UI"
];

// ProjectCard component
const ProjectCard = ({ project, onOpen }) => {
  const techColors = {
    // Frontend
    React: "bg-blue-500",
    "Next.js": "bg-gray-800",
    "Vue.js": "bg-green-500",
    "Nuxt.js": "bg-emerald-600",
    Angular: "bg-red-600",
    Svelte: "bg-orange-600",
    SolidJS: "bg-cyan-600",
    // Backend (JS/TS)
    "Node.js": "bg-green-600",
    Express: "bg-gray-600",
    NestJS: "bg-rose-600",
    Fastify: "bg-lime-600",
    Koa: "bg-teal-600",
    // Python
    Python: "bg-yellow-500",
    Flask: "bg-indigo-500",
    Django: "bg-green-700",
    FastAPI: "bg-emerald-500",
    // Java / JVM
    Java: "bg-orange-700",
    "Spring Boot": "bg-green-800",
    Kotlin: "bg-purple-700",
    Micronaut: "bg-violet-700",
    // PHP / Ruby / .NET / Go
    Laravel: "bg-red-700",
    Symfony: "bg-slate-600",
    "Ruby on Rails": "bg-rose-700",
    ".NET": "bg-purple-800",
    "ASP.NET Core": "bg-fuchsia-700",
    Go: "bg-cyan-700",
    Gin: "bg-sky-600",
    Fiber: "bg-sky-700",
    // Databases
    PostgreSQL: "bg-blue-700",
    MySQL: "bg-orange-500",
    SQLite: "bg-slate-500",
    MongoDB: "bg-green-700",
    Redis: "bg-red-500",
    Elasticsearch: "bg-amber-700",
    // Messaging / Streaming
    Kafka: "bg-amber-600",
    RabbitMQ: "bg-orange-600",
    // Infra & DevOps
    Docker: "bg-sky-500",
    Kubernetes: "bg-blue-600",
    Nginx: "bg-emerald-700",
    AWS: "bg-yellow-600",
    GCP: "bg-red-500",
    Azure: "bg-blue-700",
    // Data layer / ORMs / APIs
    GraphQL: "bg-pink-500",
    REST: "bg-purple-500",
    Prisma: "bg-indigo-600",
    TypeORM: "bg-indigo-700",
    Hibernate: "bg-amber-800",
    Sequelize: "bg-teal-700",
    // Languages & Tooling
    TypeScript: "bg-blue-600",
    JavaScript: "bg-yellow-500",
    Bun: "bg-gray-700",
    // Auth / Realtime
    Auth0: "bg-orange-700",
    JWT: "bg-purple-700",
    "Socket.io": "bg-gray-700",
    // UI / CSS
    Tailwind: "bg-cyan-500",
    Bootstrap: "bg-purple-700",
    "Chakra UI": "bg-emerald-600",
    "Material UI": "bg-blue-700",
    // Hosting / Misc
    Netlify: "bg-teal-500",
    Vercel: "bg-gray-700",
  };

  return (
    <div onClick={onOpen} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in transform hover:scale-[1.02] cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white truncate pr-2 transition-colors duration-300 hover:text-blue-400">
          {project.title}
        </h3>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          {project.isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.techStack?.map((tech, index) => (
          <span
            key={index}
            className={`text-xs px-2 py-1 rounded-full text-white ${
              techColors[tech] || "bg-gray-600"
            }`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Progress Bar (Dynamic) */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{project.progress ?? 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              (project.progress ?? 0) === 100
                ? 'bg-green-500'
                : (project.progress ?? 0) >= 70
                ? 'bg-blue-500'
                : (project.progress ?? 0) >= 40
                ? 'bg-yellow-500'
                : 'bg-orange-500'
            }`}
            style={{ width: `${project.progress ?? 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [techInput, setTechInput] = useState("");
  const [showTechInput, setShowTechInput] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moteIndex, setMoteIndex] = useState(0);

  const authContext = useContext(AuthContext);
  const username = user?.username || authContext?.user?.name || "Developer";

  // Fetch user projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile + projects
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    };
    fetchUser();
    fetchProjects();
  }, []);

  // Rotating motivation statements (changes every 20–30 seconds)
  const motivations = [
    "Small steps today build big systems tomorrow.",
    "Ship something. Iteration beats perfection.",
    "Focus on one bug, one feature—right now.",
    "Progress over perfection. Keep moving.",
    "Readability first. Future you will thank you.",
    "Tests save time. Add one as you go.",
    "Delete dead code. Clarity is speed.",
    "You’re one commit closer to done.",
    "Hard problems shrink when written down.",
    "Stay curious. Ask why twice."
  ];

  useEffect(() => {
    let isMounted = true;
    let timerId;
    const scheduleNext = () => {
      const delay = 20000 + Math.floor(Math.random() * 10000); // 20–30s
      timerId = setTimeout(() => {
        if (!isMounted) return;
        setMoteIndex((prev) => (prev + 1) % motivations.length);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // Handle project submission
  const handleGenerateProject = async () => {
    if (!promptText.trim() || !techInput.trim()) return;

    const techStackArray = techInput.split(",").map((t) => t.trim());

    try {
      await api.post("/projects", {
        title: promptText,
        description: promptText, // using same as desc for now
        techStack: techStackArray,
      });

      setPromptText("");
      setTechInput("");
      setShowTechInput(false);

      fetchProjects(); // reload projects
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.isCompleted).length;
  const inProgressProjects = totalProjects - completedProjects;
  const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects) : 0;

  // Series for sparkline: progress ordered by recency
  const progressSeries = [...projects]
    .sort((a, b) => new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0))
    .map(p => Math.max(0, Math.min(100, p.progress || 0)));

  // Tech frequency map
  const techCounts = projects.reduce((map, p) => {
    (p.techStack || []).forEach(t => {
      const key = typeof t === 'string' ? t : (t?.name || t?.label || 'Tech');
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, {});
  const topTech = Object.entries(techCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">
            Welcome back, <span className="text-blue-400">{username}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your projects today
          </p>
          <div className="mt-4 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-700/40 text-indigo-300 rounded-lg px-4 py-3">
            <span className="text-sm">{motivations[moteIndex]}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Projects" value={totalProjects} color="blue" />
          <StatCard label="Completed" value={completedProjects} color="green" />
          <StatCard label="In Progress" value={inProgressProjects} color="yellow" />
        </div>

        {/* Progress Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Donut - Completion Ratio */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-4">Completion Ratio</h3>
            <div className="flex items-center">
              <Donut percent={totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0} />
              <div className="ml-5">
                <div className="text-3xl font-bold text-green-400">{totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%</div>
                <div className="text-gray-400 text-sm">{completedProjects} of {totalProjects} projects</div>
              </div>
            </div>
          </div>

          {/* Sparkline - Recent Progress */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-4">Recent Progress</h3>
            <Sparkline data={progressSeries} />
            <div className="mt-3 text-sm text-gray-400">Average progress: <span className="text-blue-400 font-medium">{averageProgress}%</span></div>
          </div>

          {/* Top Tech - Usage */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-4">Top Technologies</h3>
            {topTech.length === 0 ? (
              <div className="text-gray-500 text-sm">No tech data yet.</div>
            ) : (
              <div className="space-y-2">
                {topTech.map(([tech, count]) => {
                  const maxCount = topTech[0][1] || 1;
                  const width = Math.round((count / maxCount) * 100);
                  return (
                    <div key={tech} className="">
                      <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                        <span>{tech}</span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${width}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Project Creation */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 animate-slide-up">
          <h2 className="text-lg font-semibold mb-4 text-white">Start a new project</h2>

          {!showTechInput ? (
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Type your project title — we’ll handle the rest."
                className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
              <button
                onClick={() => setShowTechInput(true)}
                disabled={!promptText.trim()}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Next
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-gray-400">Suggested Tech Stacks:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {techSuggestions.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-700 text-sm rounded-full cursor-pointer hover:bg-blue-500 hover:text-white"
                    onClick={() => setTechInput((prev) => (prev ? prev + ", " + tech : tech))}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Click a suggestion above or type your stack, comma‑separated."
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
              />
              <button
                onClick={handleGenerateProject}
                className="mt-3 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Create Project
              </button>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {([...projects]
              .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
              .slice(0, 3)
            ).map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpen={() => navigate(`/workspace/${project._id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard
const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 border border-gray-700 animate-slide-up">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-500/10 mr-4`}>
        <div className={`h-6 w-6 text-${color}-400`}>●</div>
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// Donut chart using pure CSS (circle with stroke-dasharray)
const Donut = ({ percent = 0, size = 96, stroke = 10 }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;
  const rest = c - dash;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#374151" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="#10b981" strokeWidth={stroke} fill="none" strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} strokeDasharray={`${dash} ${rest}`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-green-400 text-sm" style={{ fontSize: 12, fontWeight: 700 }}>{clamped}%</text>
    </svg>
  );
};

// Minimal sparkline component
const Sparkline = ({ data = [], width = 280, height = 80 }) => {
  if (!data || data.length === 0) {
    return <div className="w-full h-[80px] bg-gray-700 rounded" />;
  }
  const max = Math.max(100, ...data);
  const min = 0;
  const points = data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} />
      {data.map((v, i) => {
        const x = (i / Math.max(1, data.length - 1)) * width;
        const y = height - ((v - min) / (max - min)) * height;
        return <circle key={i} cx={x} cy={y} r="2" fill="#93c5fd" />;
      })}
    </svg>
  );
};

export default Dashboard;
