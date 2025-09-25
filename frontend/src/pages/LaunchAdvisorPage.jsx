import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LaunchAdvisorPage = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState('');
  const [deploymentOptions, setDeploymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  // Load user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError('');
        const res = await api.get('/projects');
        const list = Array.isArray(res?.data?.projects) ? res.data.projects : [];
        setProjects(list);
      } catch (err) {
        console.error('Failed to load projects', err);
        setError('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  const handleGetRecommendations = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    setDeploymentOptions([]);
    try {
      const res = await api.post('/ai-mentor/launch/recommend', { projectId: selectedProject });
      const recs = Array.isArray(res?.data?.recommendations) ? res.data.recommendations : [];
      setDeploymentOptions(recs);
    } catch (err) {
      console.error('Recommendation generation failed', err);
      setError('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setDeploymentOptions([]); // Clear previous results
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Launch Advisor
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Analyze your project and find the optimal, cost-effective deployment solution.
          </p>
        </div>

        {/* Project Selection */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 my-10 border border-gray-700 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6 text-white">Select a Project</h2>
          {error && (
            <div className="mb-4 text-sm text-red-400">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleProjectSelect(project._id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                  selectedProject === project._id
                    ? 'bg-blue-900/30 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'
                }`}
              >
                <h3 className="font-medium text-white">{project.title || project.name}</h3>
                {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 6).map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-300">
                        {typeof t === 'string' ? t : (t?.name || t?.label || 'Tech')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGetRecommendations}
              disabled={loading || !selectedProject}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                loading || !selectedProject
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  Generating Recommendations...
                </span>
              ) : (
                'Generate Deployment Recommendations'
              )}
            </button>
          </div>
        </div>

        {/* Recommendations Table */}
        {deploymentOptions.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden my-12 border border-gray-700 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-5 px-6 text-left text-white font-semibold">Platform</th>
                    <th className="py-5 px-6 text-left text-white font-semibold">Estimated Cost (Free Tier)</th>
                    <th className="py-5 px-6 text-left text-white font-semibold">Pros</th>
                    <th className="py-5 px-6 text-left text-white font-semibold">Cons</th>
                  </tr>
                </thead>
                <tbody>
                  {deploymentOptions.map((option, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'} border-b border-gray-700 last:border-b-0`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <span className="text-3xl mr-4">{option.logo}</span>
                          <span className="font-bold text-lg">{option.platform}</span>
                          {option.isRecommended && (
                            <span className="ml-3 bg-green-600 text-xs px-3 py-1 rounded-full text-white">
                              Recommended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-300">{option.cost}</td>
                      <td className="py-5 px-6">
                        <ul className="space-y-2">
                          {option.pros.map((pro, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              <span className="text-gray-300">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-5 px-6">
                        <ul className="space-y-2">
                          {option.cons.map((con, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-red-400 mr-2">✗</span>
                              <span className="text-gray-300">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchAdvisorPage;