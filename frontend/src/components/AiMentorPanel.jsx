// src/components/AiMentorPanel.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// --- MilestoneList (unchanged behavior but uses onMilestoneUpdate to persist) ---
const MilestoneList = ({ milestones = [], onMilestoneUpdate }) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const initialChecked = {};
    milestones.forEach(m => {
      initialChecked[m.id] = m.completed || false;
    });
    setCheckedItems(initialChecked);
  }, [milestones]);

  const handleCheck = (id) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);

    const total = milestones.length;
    const completed = Object.values(newChecked).filter(Boolean).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (onMilestoneUpdate) onMilestoneUpdate(progress, newChecked);
  };

  return (
    <div className="p-5 space-y-5 bg-gradient-to-b from-gray-800/50 to-gray-900/50 animate-fade-in h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-4">Project Milestones</h3>
      {milestones.length === 0 ? (
        <div className="text-gray-400 text-center py-12 rounded-xl border-2 border-dashed border-gray-700">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-lg">No milestones available</p>
          <p className="text-gray-500 mt-2">Create milestones to track your progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id || index} className={`flex items-start gap-4 p-4 rounded-xl border ${checkedItems[milestone.id] ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'}`}>
              <input type="checkbox" checked={checkedItems[milestone.id] || false} onChange={() => handleCheck(milestone.id)} className="mt-1 w-5 h-5 text-purple-500 bg-gray-600 border-gray-500 rounded" />
              <div className="flex-1">
                <h4 className={`font-bold ${checkedItems[milestone.id] ? 'text-green-400 line-through' : 'text-white'}`}>{milestone.title}</h4>
                <p className="text-sm text-gray-300 mt-2">{milestone.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 text-xs rounded-full border ${milestone.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' : milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>{milestone.priority} priority</span>
                  <span className="text-xs text-gray-400">{milestone.estimatedTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MentorChat (connected to backend chat endpoints) ---
const MentorChat = ({ projectId, messages = [], onSendMessageRemote }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTypingLocal, setIsTypingLocal] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const payload = newMessage.trim();
    setNewMessage('');
    setIsTypingLocal(true);

    try {
      if (onSendMessageRemote) {
        await onSendMessageRemote(payload);
      }
    } catch (err) {
      console.error('Chat send failed', err);
    } finally {
      setIsTypingLocal(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">AI Mentor Chat</h3>
        <p className="text-sm text-gray-400">Get personalized guidance and support</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-gray-500 mt-2">Start a conversation with your AI mentor!</p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl ${m.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}>
                <p className="text-sm">{m.content}</p>
                <p className="text-xs mt-2 opacity-70">{m.timestamp}</p>
              </div>
            </div>
          ))
        )}

        {isTypingLocal && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-5 py-3 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask your mentor anything..." className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 resize-none" rows="2" />
          <button onClick={handleSendMessage} disabled={!newMessage.trim()} className={`px-5 py-3 rounded-xl ${!newMessage.trim() ? 'bg-gray-600 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'}`}>Send</button>
        </div>
      </div>
    </div>
  );
};

// --- BlueprintView (renders blueprint & goals, triggers generation if missing) ---
const BlueprintView = ({ project, onRequestGenerate }) => {
  const techStack = project?.techStack || [];
  const blueprint = project?.blueprint || [];
  const objectives = project?.objectives || [];
  const goals = project?.goals || [];

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!onRequestGenerate) return;
    setIsGenerating(true);
    setError('');
    try {
      await onRequestGenerate('blueprint');
    } catch (err) {
      console.error('Generate blueprint failed', err);
      setError(err?.message || 'Failed to generate blueprint');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-5 space-y-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 animate-fade-in h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-white">Project Blueprint</h3>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Technology Stack</h4>
        {techStack.length === 0 ? (
          <div className="text-gray-400 text-center py-6 rounded-xl border-2 border-dashed border-gray-700">
            <p>No technology stack defined yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white">{typeof tech === 'string' ? tech : tech.name}</h5>
                  <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 rounded-full border border-purple-500/30">stack</span>
                </div>
                <p className="text-sm text-gray-300">{typeof tech === 'string' ? `Use ${tech} for this layer` : tech.description || ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Blueprint</h4>
        {(!blueprint || blueprint.length === 0) ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Blueprint not generated yet.</p>
            <button onClick={handleGenerate} disabled={isGenerating} className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded">
              {isGenerating ? 'Generating...' : 'Generate Blueprint (AI)'}
            </button>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {blueprint.map((item, idx) => (
              <div key={idx} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <p className="text-sm text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Project Goals</h4>
        {(!goals || goals.length === 0) ? (
          <div className="text-gray-400 text-center py-6">No project goals yet.</div>
        ) : (
          <ul className="space-y-3 text-gray-300">
            {goals.map((g, i) => <li key={i} className="flex items-start gap-3"><div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2 flex-shrink-0"></div><span>{g}</span></li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- AnalysisComponent (unchanged but fetchable) ---
const AnalysisComponent = ({ analyticsData = null }) => {
  if (!analyticsData) {
    return (
      <div className="p-5 space-y-5 h-full overflow-y-auto bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="text-gray-400 text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg">No analytics data available</p>
          <p className="text-gray-500 mt-2">Run an analysis to see performance metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 h-full overflow-y-auto bg-gradient-to-b from-gray-800/50 to-gray-900/50">
      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <h4 className="font-bold text-white mb-4">Code Quality Metrics</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Maintainability</span><span className="text-green-400 font-medium">{analyticsData.maintainability || 'N/A'}</span></div>
            <div className="w-full bg-gray-600 rounded-full h-2.5"><div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full" style={{ width: `${analyticsData.maintainability || 0}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Performance</span><span className="text-yellow-400 font-medium">{analyticsData.performance || 'N/A'}</span></div>
            <div className="w-full bg-gray-600 rounded-full h-2.5"><div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2.5 rounded-full" style={{ width: `${analyticsData.performance || 0}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Test Coverage</span><span className="text-red-400 font-medium">{analyticsData.testCoverage || 'N/A'}</span></div>
            <div className="w-full bg-gray-600 rounded-full h-2.5"><div className="bg-gradient-to-r from-red-500 to-rose-500 h-2.5 rounded-full" style={{ width: `${analyticsData.testCoverage || 0}%` }} /></div>
          </div>
        </div>
      </div>
      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <h4 className="font-bold text-white mb-3">Dependencies</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-300">Total packages</span><span className="text-white font-medium">{analyticsData.totalPackages || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-300">Outdated</span><span className="text-yellow-400 font-medium">{analyticsData.outdatedPackages || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-300">Vulnerabilities</span><span className="text-red-400 font-medium">{analyticsData.vulnerabilities || 'N/A'}</span></div>
        </div>
      </div>
    </div>
  );
};

// --- Main AiMentorPanel ---
const AiMentorPanel = ({ project = {}, onProjectUpdate = () => {}, requestAIGeneration = null }) => {
  const [activeTab, setActiveTab] = useState('ai-monitor');
  const [aiMonitorSubTab, setAiMonitorSubTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [generating, setGenerating] = useState(false);

  const projectId = project?._id || project?.id;

  // Load chat history when project changes
  useEffect(() => {
    if (!projectId) return;
    fetchChatHistory();
  }, [projectId]);

  const fetchChatHistory = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/chat`);
      if (res?.data?.messages) setChatMessages(res.data.messages);
    } catch (err) {
      // ignore silently for now
      console.warn('Failed to fetch chat history', err);
    }
  };

  // Send message -> backend -> AI reply appended
  const handleSendMessage = async (message) => {
    if (!projectId) return;
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    try {
      const res = await api.post(`/projects/${projectId}/chat`, { message });
      // Expect backend to return { aiMessage, savedMessage? } or appended message
      if (res?.data?.aiMessage) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          content: res.data.aiMessage,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatMessages(prev => [...prev, botMessage]);
      } else if (res?.data?.message) {
        // fallback: if backend returns full message object
        setChatMessages(prev => [...prev, res.data.message]);
      }
    } catch (err) {
      console.error('Chat error', err);
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'bot',
        content: "⚠️ Chat failed. Try again later.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Request AI generation: blueprint / milestones / description
  const handleGenerate = async (action) => {
    if (!projectId) return;
    setGenerating(true);
    try {
      if (requestAIGeneration) {
        const updated = await requestAIGeneration(action);
        // requestAIGeneration is expected to return the updated project
        if (updated) {
          onProjectUpdate(updated);
        }
      } else {
        // fallback direct call (if parent didn't provide wrapper)
        const res = await api.post(`/projects/${projectId}/generate`, { action });
        if (res?.data?.project) onProjectUpdate(res.data.project);
      }
    } catch (err) {
      console.error('Generation error', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Milestone update -> persist to backend
  const handleMilestoneUpdate = async (progress, checkedItems) => {
    if (!projectId) return;
    // Build updated milestones array from project.milestones using checkedItems
    const updatedMilestones = (project.milestones || []).map(m => ({
      ...m,
      completed: !!checkedItems[m.id]
    }));
    const completedCount = Object.values(checkedItems).filter(Boolean).length;

    // Local update + persist
    const updatedProject = {
      ...project,
      milestones: updatedMilestones,
      completedMilestones: completedCount,
      progress // optional (the project model calculates too)
    };
    // Save to server
    try {
      const res = await api.patch(`/projects/${projectId}`, {
        milestones: updatedMilestones,
        completedMilestones: completedCount,
        progress
      });
      if (res?.data?.project) {
        onProjectUpdate(res.data.project);
      } else {
        onProjectUpdate(updatedProject, true);
      }
    } catch (err) {
      console.error('Failed to save milestones', err);
      // fallback local update
      onProjectUpdate(updatedProject, false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/projects/${projectId}/analytics`);
      if (res?.data) setAnalyticsData(res.data);
    } catch (err) {
      console.warn('Analytics fetch failed', err);
    }
  };

  useEffect(() => {
    if (aiMonitorSubTab === 'analytics') fetchAnalytics();
  }, [aiMonitorSubTab, projectId]);

  const tabs = [
    { id: 'ai-monitor', label: 'AI Monitor' },
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'milestone-tracker', label: 'Milestones' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="border-b border-gray-700 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-6 h-6 mr-2" />
          AI Mentor
        </h3>
      </div>

      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-4 py-3 text-sm ${activeTab === tab.id ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-750'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ai-monitor' && (
          <div className="h-full flex flex-col">
            <div className="flex border-b border-gray-700">
              <button onClick={() => setAiMonitorSubTab('chat')} className={`flex-1 px-4 py-3 text-sm ${aiMonitorSubTab === 'chat' ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-750'}`}>Chat</button>
              <button onClick={() => setAiMonitorSubTab('analytics')} className={`flex-1 px-4 py-3 text-sm ${aiMonitorSubTab === 'analytics' ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-750'}`}>Analytics</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {aiMonitorSubTab === 'chat' && (
                <MentorChat projectId={projectId} messages={chatMessages} onSendMessageRemote={handleSendMessage} />
              )}
              {aiMonitorSubTab === 'analytics' && (
                <AnalysisComponent analyticsData={analyticsData} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView project={project} onRequestGenerate={async (action) => handleGenerate(action)} />
        )}

        {activeTab === 'milestone-tracker' && (
          <MilestoneList milestones={project?.milestones || []} onMilestoneUpdate={handleMilestoneUpdate} />
        )}
      </div>
    </div>
  );
};

export default AiMentorPanel;









// import React, { useState, useEffect } from "react";
// import api from "../utils/api";
// import ReactFlow, { MiniMap, Controls } from "reactflow";
// import "reactflow/dist/style.css";

// const AIMentorPanel = ({ projectId }) => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchProject = async () => {
//     const { data } = await api.get(`/projects/${projectId}`);
//     setProject(data.project);
//   };

//   useEffect(() => {
//     fetchProject();
//   }, [projectId]);

//   const handleGenerate = async () => {
//     setLoading(true);
//     await api.post(`/projects/${projectId}/generate`);
//     await fetchProject();
//     setLoading(false);
//   };

//   const toggleMilestone = async (index) => {
//     await api.put(`/projects/${projectId}/milestone`, {
//       milestoneIndex: index,
//       completed: true,
//     });
//     await fetchProject();
//   };

//   if (!project) return <p>Loading...</p>;

//   const nodes = project.blueprint?.map((step, idx) => ({
//     id: `n${idx}`,
//     data: { label: step.from },
//     position: { x: 100, y: idx * 100 },
//   }));

//   const edges = project.blueprint?.map((step, idx) => ({
//     id: `e${idx}`,
//     source: `n${idx}`,
//     target: `n${idx + 1}`,
//     label: step.to,
//   }));

//   const progress =
//     project.milestones?.length > 0
//       ? Math.round(
//           (project.milestones.indexOf(project.currentMilestone) + 1) /
//             project.milestones.length *
//             100
//         )
//       : 0;

//   return (
//     <div className="p-6 bg-gray-900 text-white rounded-xl">
//       <h2 className="text-2xl font-bold mb-4">AI Mentor Panel</h2>

//       <button
//         onClick={handleGenerate}
//         disabled={loading}
//         className="px-4 py-2 bg-blue-600 rounded mb-4"
//       >
//         {loading ? "Generating..." : "Generate Blueprint"}
//       </button>

//       <h3 className="text-xl font-semibold">Description</h3>
//       <p className="mb-6 text-gray-300">{project.description || "Not generated yet"}</p>

//       <h3 className="text-xl font-semibold mb-2">Blueprint</h3>
//       <div className="h-64 bg-gray-800 rounded-lg">
//         {project.blueprint?.length > 0 ? (
//           <ReactFlow nodes={nodes} edges={edges}>
//             <MiniMap />
//             <Controls />
//           </ReactFlow>
//         ) : (
//           <p className="p-4 text-gray-400">No blueprint generated</p>
//         )}
//       </div>

//       <h3 className="text-xl font-semibold mt-6 mb-2">Milestones</h3>
//       <ul className="space-y-2">
//         {project.milestones?.map((m, idx) => (
//           <li key={idx} className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={idx <= project.milestones.indexOf(project.currentMilestone)}
//               onChange={() => toggleMilestone(idx)}
//               className="w-5 h-5"
//             />
//             <span>{m}</span>
//           </li>
//         ))}
//       </ul>

//       <div className="mt-4">
//         <p>Progress: {progress}%</p>
//         <div className="w-full bg-gray-700 h-3 rounded">
//           <div
//             className="bg-green-500 h-3 rounded"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIMentorPanel;
