import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor';

// MilestoneList Component - now expects real data
const MilestoneList = ({ milestones = [] }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-purple-300">Project Milestones</h3>
      {milestones.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No milestones available for this project
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id || index}
              className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <input
                type="checkbox"
                checked={checkedItems[milestone.id] || false}
                onChange={() => handleCheck(milestone.id)}
                className="mt-1 w-4 h-4 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <h4 className="font-medium text-white">{milestone.title}</h4>
                <p className="text-sm text-gray-300 mt-1">{milestone.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    milestone.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {milestone.priority} priority
                  </span>
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

// MentorChat Component - now expects real data
const MentorChat = ({ messages = [], onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
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
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-purple-300">AI Mentor Chat</h3>
        <p className="text-sm text-gray-400">Get personalized guidance and support</p>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No messages yet. Start a conversation with your AI mentor!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your mentor anything..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// BlueprintView Component - now expects real data
const BlueprintView = ({ techStack = [], objectives = [], projectGoals = [] }) => {
  const defaultTechStack = techStack;
  const defaultObjectives = objectives;
  const goals = projectGoals;

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-purple-300">Project Blueprint</h3>
      
      {/* Tech Stack Section */}
      <div>
        <h4 className="text-md font-medium text-white mb-3">Technology Stack</h4>
        {defaultTechStack.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No technology stack defined yet
          </div>
        ) : (
          <div className="grid gap-3">
            {defaultTechStack.map((tech, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{tech.name}</h5>
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                    {tech.category}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{tech.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Learning Objectives Section */}
      <div>
        <h4 className="text-md font-medium text-white mb-3">Learning Objectives</h4>
        {defaultObjectives.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No learning objectives defined yet
          </div>
        ) : (
          <div className="grid gap-3">
            {defaultObjectives.map((objective, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{objective.skill}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    objective.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                    objective.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {objective.level}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{objective.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Project Goals - Made dynamic */}
      <div>
        <h4 className="text-md font-medium text-white mb-3">Project Goals</h4>
        <div className="bg-gray-700 rounded-lg p-4">
          {goals && goals.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {goal}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-center py-4">
              No project goals defined yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analysis Component - now expects real data
const AnalysisComponent = ({ analyticsData = null }) => {
  if (!analyticsData) {
    return (
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        <div className="text-gray-400 text-center py-8">
          No analytics data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <div className="bg-monaco-bg rounded-lg p-3 border border-monaco-border">
        <h4 className="font-medium text-monaco-text mb-3">Code Quality Metrics</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-monaco-text-secondary">Maintainability</span>
              <span className="text-green-400">{analyticsData.maintainability || 'N/A'}</span>
            </div>
            <div className="w-full bg-monaco-border rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analyticsData.maintainability || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-monaco-text-secondary">Performance</span>
              <span className="text-yellow-400">{analyticsData.performance || 'N/A'}</span>
            </div>
            <div className="w-full bg-monaco-border rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analyticsData.performance || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-monaco-text-secondary">Test Coverage</span>
              <span className="text-red-400">{analyticsData.testCoverage || 'N/A'}</span>
            </div>
            <div className="w-full bg-monaco-border rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${analyticsData.testCoverage || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-monaco-bg rounded-lg p-3 border border-monaco-border">
        <h4 className="font-medium text-monaco-text mb-2">Dependencies</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Total packages</span>
            <span className="text-monaco-text">{analyticsData.totalPackages || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Outdated</span>
            <span className="text-yellow-400">{analyticsData.outdatedPackages || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Vulnerabilities</span>
            <span className="text-red-400">{analyticsData.vulnerabilities || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-monaco-bg rounded-lg p-3 border border-monaco-border">
        <h4 className="font-medium text-monaco-text mb-2">Bundle Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Bundle size</span>
            <span className="text-monaco-text">{analyticsData.bundleSize || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Gzipped</span>
            <span className="text-green-400">{analyticsData.gzippedSize || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-monaco-text-secondary">Load time</span>
            <span className="text-monaco-text">{analyticsData.loadTime || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// AiMentorPanel Component - now expects real data
const AiMentorPanel = ({ project, currentFile }) => {
  const [activeTab, setActiveTab] = useState('ai-monitor');
  const [aiMonitorSubTab, setAiMonitorSubTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Function to handle sending messages to the backend
  const handleSendMessage = async (message) => {
    // This will be implemented when you connect your backend
    console.log('Sending message to backend:', message);
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate API call - replace with actual backend call
    // const response = await yourBackendAPI.sendMessage(message);
    // setChatMessages(prev => [...prev, response]);
    // setIsTyping(false);
  };

  // Function to fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    // This will be implemented when you connect your backend
    console.log('Fetching analytics data from backend');
    
    // Simulate API call - replace with actual backend call
    // const data = await yourBackendAPI.getAnalytics();
    // setAnalyticsData(data);
  };

  return (
    <div className="h-full flex flex-col bg-monaco-sidebar">
      {/* AI Mentor Header */}
      <div className="border-b border-monaco-border p-4">
        <h3 className="text-lg font-semibold text-monaco-text flex items-center">
          <span className="mr-2">🤖</span>
          AI Mentor
        </h3>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-monaco-border">
        {[
          { id: 'ai-monitor', label: '🤖 AI Monitor', icon: '🤖' },
          { id: 'blueprint', label: '📋 Blueprint', icon: '📋' },
          { id: 'milestone-tracker', label: '🎯 Milestone Tracker', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-monaco-bg text-monaco-text border-b-2 border-blue-400'
                : 'text-monaco-text-secondary hover:text-monaco-text hover:bg-monaco-hover'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ai-monitor' && (
          <div className="h-full flex flex-col">
            {/* AI Monitor Sub-tabs */}
            <div className="flex border-b border-monaco-border">
              {[
                { id: 'chat', label: '💬 Chat', icon: '💬' },
                { id: 'analytics', label: '📊 Analytics', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAiMonitorSubTab(tab.id)}
                  className={`flex-1 px-3 py-2 text-sm transition-colors ${
                    aiMonitorSubTab === tab.id
                      ? 'bg-monaco-bg text-monaco-text border-b-2 border-blue-400'
                      : 'text-monaco-text-secondary hover:text-monaco-text hover:bg-monaco-hover'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* AI Monitor Sub-tab Content */}
            <div className="flex-1 overflow-hidden">
              {aiMonitorSubTab === 'chat' && (
                <MentorChat 
                  messages={chatMessages} 
                  onSendMessage={handleSendMessage} 
                />
              )}
              {aiMonitorSubTab === 'analytics' && (
                <AnalysisComponent analyticsData={analyticsData} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView 
            techStack={project?.techStack || []} 
            objectives={project?.objectives || []}
            projectGoals={project?.goals || []}
          />
        )}

        {activeTab === 'milestone-tracker' && (
          <MilestoneList milestones={project?.milestones || []} />
        )}
      </div>
    </div>
  );
};

const Workspace = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to fetch project data from backend
  const fetchProjectData = async (id) => {
    try {
      setLoading(true);
      // Replace this with your actual API call
      // const response = await yourBackendAPI.getProject(id);
      // setProject(response.data);
      
      // For now, we'll set project to null to indicate no data
      setProject(null);
    } catch (err) {
      setError('Failed to load project data');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

  if (loading) {
    return (
      <div className="h-screen bg-monaco-bg text-monaco-text flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="text-lg">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-monaco-bg text-monaco-text flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Workspace</h1>
          <p className="text-monaco-text-secondary mb-4">{error}</p>
          <button
            onClick={() => fetchProjectData(projectId)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-monaco-bg text-monaco-text flex flex-col">
      {/* Top Bar - Made responsive */}
      <div className="h-14 bg-monaco-sidebar border-b border-monaco-border flex items-center justify-between px-4 flex-wrap">
        <div className="flex items-center space-x-4 flex-wrap">
          <h1 className="text-lg font-semibold text-monaco-text">
            {project?.name || 'Workspace'}
          </h1>
          <div className="flex items-center space-x-2 flex-wrap">
            {project?.techStack?.map((tech, index) => (
              <span
                key={index}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-monaco-text-secondary">
            Progress: {project?.progress || 0}%
          </span>
          <div className="w-24 bg-monaco-bg rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Workspace - Made responsive */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Center Panel - Code Editor (responsive width) */}
        <div className="flex-1 bg-monaco-bg flex flex-col min-h-0">
          <CodeEditor />
        </div>

        {/* Right Panel - AI Mentor (responsive width) */}
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-monaco-border flex flex-col min-h-0">
          <AiMentorPanel project={project} currentFile={selectedFile} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;