import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const LaunchAdvisor = () => {
  const { projectId } = useParams();
  const [deploymentOptions, setDeploymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock project data - in a real app this would come from an API
  const projectData = {
    name: "E-commerce Platform",
    techStack: [
      { name: "React", icon: "⚛️" },
      { name: "Node.js", icon: "🟢" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Docker", icon: "🐳" }
    ]
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock deployment options data
    const mockData = [
      {
        platform: "Vercel",
        logo: "▲",
        cost: "Free tier available, $20/month for teams",
        pros: ["Excellent for React apps", "Global CDN", "Automatic HTTPS"],
        cons: ["Limited serverless functions", "Not ideal for databases"],
        isRecommended: true
      },
      {
        platform: "Netlify",
        logo: "◈",
        cost: "Free tier available, $19/month for teams",
        pros: ["Great CI/CD integration", "Easy setup", "Form handling"],
        cons: ["Function execution time limits", "Less flexible than alternatives"],
        isRecommended: false
      }
    ];
    
    setDeploymentOptions(mockData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">AI Launch Advisor</h1>
          <p className="text-gray-400 text-sm mt-1">Optimal deployment solutions for your project</p>
        </div>

        {/* Project Summary */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 mb-6 border border-gray-700 animate-fade-in transition-all duration-300 hover:border-gray-600">
          <h2 className="text-lg font-semibold mb-3 text-white transition-colors duration-300 hover:text-blue-400">Project: {projectData.name}</h2>
          <div className="flex flex-wrap gap-2">
            {projectData.techStack.map((tech, index) => (
              <div key={index} className="flex items-center bg-gray-700/50 px-3 py-1.5 rounded-full text-sm border border-gray-600 transition-all duration-300 hover:bg-gray-600/50 hover:border-gray-500 hover:scale-105">
                <span className="mr-2 transition-transform duration-300 hover:scale-110">{tech.icon}</span>
                <span className="transition-colors duration-300 hover:text-white">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Generating...' : 'Get Recommendations'}
          </button>
        </div>

        {/* Recommendations Table */}
        {deploymentOptions.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-white font-medium text-sm">Platform</th>
                    <th className="py-3 px-4 text-left text-white font-medium text-sm">Cost</th>
                    <th className="py-3 px-4 text-left text-white font-medium text-sm">Pros</th>
                    <th className="py-3 px-4 text-left text-white font-medium text-sm">Cons</th>
                  </tr>
                </thead>
                <tbody>
                  {deploymentOptions.map((option, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'} border-b border-gray-700 last:border-b-0 transition-all duration-300 hover:bg-gray-700/50`}
                    >
                      <td className="py-3 px-4 transition-all duration-300 hover:text-blue-400">
                        <div className="flex items-center">
                          <span className="text-xl mr-2 transition-transform duration-300 hover:scale-110">{option.logo}</span>
                          <span className="font-medium transition-colors duration-300 hover:text-blue-400">{option.platform}</span>
                          {option.isRecommended && (
                            <span className="ml-2 bg-green-600 text-xs px-2 py-0.5 rounded-full text-white transition-all duration-300 hover:bg-green-500">
                              Recommended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm transition-colors duration-300 hover:text-gray-200">{option.cost}</td>
                      <td className="py-3 px-4">
                        <ul className="space-y-1">
                          {option.pros.slice(0, 2).map((pro, i) => (
                            <li key={i} className="flex items-start text-sm transition-all duration-300 hover:text-green-400">
                              <span className="text-green-400 mr-1.5 transition-colors duration-300 hover:text-green-300">✓</span>
                              <span className="text-gray-300 transition-colors duration-300 hover:text-gray-200">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-4">
                        <ul className="space-y-1">
                          {option.cons.slice(0, 2).map((con, i) => (
                            <li key={i} className="flex items-start text-sm transition-all duration-300 hover:text-red-400">
                              <span className="text-red-400 mr-1.5 transition-colors duration-300 hover:text-red-300">✗</span>
                              <span className="text-gray-300 transition-colors duration-300 hover:text-gray-200">{con}</span>
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

export default LaunchAdvisor;