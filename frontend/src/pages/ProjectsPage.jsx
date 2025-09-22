// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProjectsPage = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Mock projects data
//   const mockProjects = [
//     {
//       id: '1',
//       name: 'E-commerce Platform',
//       description: 'Full-stack e-commerce solution with React and Node.js',
//       techStack: ['React', 'Node.js', 'MongoDB'],
//       progress: 75,
//       lastUpdated: '2023-05-15'
//     },
//     {
//       id: '2',
//       name: 'Task Management App',
//       description: 'Productivity app for team collaboration',
//       techStack: ['Vue.js', 'Express', 'PostgreSQL'],
//       progress: 40,
//       lastUpdated: '2023-05-10'
//     },
//     {
//       id: '3',
//       name: 'Portfolio Website',
//       description: 'Personal portfolio with blog functionality',
//       techStack: ['Next.js', 'Tailwind CSS'],
//       progress: 90,
//       lastUpdated: '2023-05-18'
//     }
//   ];

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setProjects(mockProjects);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const handleProjectClick = (projectId) => {
//     navigate(`/workspace/${projectId}`);
//   };

//   const handleCreateNewProject = () => {
//     // Generate a new project ID
//     const newProjectId = `${projects.length + 1}`;
//     navigate(`/workspace/${newProjectId}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
//         <div className="text-center animate-fade-in">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-300">Loading projects...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-10 animate-fade-in">
//           <div>
//             <h1 className="text-3xl font-bold">Projects</h1>
//             <p className="text-gray-400 mt-2">Manage and access all your coding projects</p>
//           </div>
//           <button
//             onClick={handleCreateNewProject}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             New Project
//           </button>
//         </div>

//         {projects.length === 0 ? (
//           <div className="text-center py-20 rounded-xl border-2 border-dashed border-gray-700 animate-fade-in">
//             <div className="text-5xl mb-6">📁</div>
//             <h3 className="text-2xl font-semibold mb-3">No projects yet</h3>
//             <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your first project to get started on your development journey</p>
//             <button
//               onClick={handleCreateNewProject}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//             >
//               Create Your First Project
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {projects.map((project) => (
//               <div
//                 key={project.id}
//                 onClick={() => handleProjectClick(project.id)}
//                 className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in transform hover:scale-[1.02]"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold text-white transition-colors duration-300 hover:text-blue-400">{project.name}</h3>
//                   <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full transition-all duration-300 hover:bg-gray-600">
//                     {project.progress}%
//                   </span>
//                 </div>
                
//                 <p className="text-gray-400 mb-5 transition-colors duration-300 hover:text-gray-300">{project.description}</p>
                
//                 <div className="flex flex-wrap gap-2 mb-5">
//                   {project.techStack.map((tech, index) => (
//                     <span
//                       key={index}
//                       className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded transition-all duration-300 hover:bg-gray-600 hover:scale-105"
//                     >
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-500 transition-colors duration-300 hover:text-gray-400">Last updated: {project.lastUpdated}</span>
//                   <div className="w-24 bg-gray-700 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
//                       style={{ width: `${project.progress}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* Footer */}
//       {/* <div className="mt-4 text-center text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">
//         <div className="flex items-center justify-center">
//           <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
//           <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
//         </div>
//         <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
//       </div> */}
//     </div>
//   );
// };

// export default ProjectsPage;


// src/pages/ProjectsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import axios from "axios";

// Colored tech badge consistent with dashboard mapping
const TechBadge = ({ tech }) => {
  const colors = {
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
  const cls = colors[tech] || "bg-gray-600";
  return (
    <span className={`text-xs px-2 py-1 rounded-full text-white ${cls}`}>{tech}</span>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper to get cookie value (used if token stored in cookie named 'token')
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      setLoading(true);

      // 1) Try your api wrapper first (preferred)
      try {
        const res = await api.get("/projects"); // assumes api is configured with baseURL & withCredentials if needed
        if (mounted && res?.data?.projects) {
          setProjects(res.data.projects);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("api.get('/projects') failed:", err?.response?.status || err.message);
      }

      // 2) Try absolute backend URL with credentials (cookie auth)
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          withCredentials: true,
        });
        if (mounted && res?.data?.projects) {
          setProjects(res.data.projects);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("axios GET http://localhost:5000/api/projects (withCredentials) failed:", err?.response?.status || err.message);
      }

      // 3) Try relative /api/projects with credentials (if you proxy /api -> backend)
      try {
        const res = await axios.get("/api/projects", { withCredentials: true });
        if (mounted && res?.data?.projects) {
          setProjects(res.data.projects);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("axios GET /api/projects (withCredentials) failed:", err?.response?.status || err.message);
      }

      // 4) Try Bearer token from localStorage or cookie
      try {
        const token = localStorage.getItem("token") || getCookie("token");
        if (token) {
          const res = await axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (mounted && res?.data?.projects) {
            setProjects(res.data.projects);
            setLoading(false);
            return;
          }
        } else {
          console.warn("No token in localStorage or cookies to try Bearer auth.");
        }
      } catch (err) {
        console.warn("Bearer auth fetch failed:", err?.response?.status || err.message);
      }

      // All attempts failed — show empty + console error
      if (mounted) {
        setProjects([]);
        setLoading(false);
        console.error("All project fetch attempts failed. Check CORS, auth method, and backend logs.");
      }
    };

    fetchProjects();
    return () => {
      mounted = false;
    };
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/workspace/${projectId}`);
  };

  const handleCreateNewProject = () => {
    navigate("/dashboard");
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
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in transform hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white transition-colors duration-300 hover:text-blue-400">
                    {project.title || project.name || "Untitled"}
                  </h3>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full transition-all duration-300 hover:bg-gray-600">
                    {project.progress ?? project.progress === 0 ? `${project.progress}%` : project.isCompleted ? "Completed" : "N/A"}
                  </span>
                </div>

                <p className="text-gray-400 mb-5 transition-colors duration-300 hover:text-gray-300">
                  {project.description || "No description provided."}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack?.map((tech, index) => (
                    <TechBadge key={index} tech={tech} />
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 transition-colors duration-300 hover:text-gray-400">
                    Last updated:{" "}
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${project.progress ?? 50}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
