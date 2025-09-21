import React, { useState, useEffect } from 'react';

// MilestoneList Component - Enhanced version with progress tracking
const MilestoneList = ({ milestones = [], onMilestoneUpdate }) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    // Initialize checked items from milestones
    const initialChecked = {};
    milestones.forEach(milestone => {
      initialChecked[milestone.id] = milestone.completed || false;
    });
    setCheckedItems(initialChecked);
  }, [milestones]);

  const handleCheck = (id) => {
    const newCheckedItems = {
      ...checkedItems,
      [id]: !checkedItems[id]
    };
    setCheckedItems(newCheckedItems);
    
    // Calculate progress
    const totalMilestones = milestones.length;
    const completedMilestones = Object.values(newCheckedItems).filter(Boolean).length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    
    // Notify parent component about the update
    if (onMilestoneUpdate) {
      onMilestoneUpdate(progress, newCheckedItems);
    }
  };

  return (
    <div className="p-5 space-y-5 bg-gradient-to-b from-gray-800/50 to-gray-900/50 animate-fade-in">
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
            <div
              key={milestone.id || index}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                checkedItems[milestone.id] 
                  ? 'bg-green-900/20 border-green-500/50' 
                  : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'
              }`}
            >
              <input
                type="checkbox"
                checked={checkedItems[milestone.id] || false}
                onChange={() => handleCheck(milestone.id)}
                className="mt-1 w-5 h-5 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <h4 className={`font-bold ${checkedItems[milestone.id] ? 'text-green-400 line-through' : 'text-white'}`}>
                  {milestone.title}
                </h4>
                <p className="text-sm text-gray-300 mt-2">{milestone.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 text-xs rounded-full border ${
                    milestone.priority === 'high' 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    milestone.priority === 'medium' 
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border-green-500/30'
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

// MentorChat Component
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
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">AI Mentor Chat</h3>
        <p className="text-sm text-gray-400">Get personalized guidance and support</p>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-gray-500 mt-2">Start a conversation with your AI mentor!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-5 py-3 rounded-2xl rounded-bl-none">
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
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your mentor anything..."
            className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
              !newMessage.trim()
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// BlueprintView Component
const BlueprintView = ({ techStack = [], objectives = [], projectGoals = [] }) => {
  const defaultTechStack = techStack;
  const defaultObjectives = objectives;
  const goals = projectGoals;

  return (
    <div className="p-5 space-y-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 animate-fade-in">
      <h3 className="text-xl font-bold text-white">Project Blueprint</h3>
      
      {/* Tech Stack Section */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Technology Stack</h4>
        {defaultTechStack.length === 0 ? (
          <div className="text-gray-400 text-center py-6 rounded-xl border-2 border-dashed border-gray-700">
            <p>No technology stack defined yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {defaultTechStack.map((tech, index) => (
              <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-blue-500/50 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white">{tech.name}</h5>
                  <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 rounded-full border border-purple-500/30">
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
        <h4 className="text-lg font-semibold text-white mb-4">Learning Objectives</h4>
        {defaultObjectives.length === 0 ? (
          <div className="text-gray-400 text-center py-6 rounded-xl border-2 border-dashed border-gray-700">
            <p>No learning objectives defined yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {defaultObjectives.map((objective, index) => (
              <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-yellow-500/50 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white">{objective.skill}</h5>
                  <span className={`px-3 py-1 text-xs rounded-full border ${
                    objective.level === 'Beginner' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    objective.level === 'Intermediate' 
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border-red-500/30'
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
        <h4 className="text-lg font-semibold text-white mb-4">Project Goals</h4>
        <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600">
          {goals && goals.length > 0 ? (
            <ul className="space-y-3 text-gray-300">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-center py-6">
              <p>No project goals defined yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analysis Component
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
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Maintainability</span>
              <span className="text-green-400 font-medium">{analyticsData.maintainability || 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full" style={{ width: `${analyticsData.maintainability || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Performance</span>
              <span className="text-yellow-400 font-medium">{analyticsData.performance || 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2.5 rounded-full" style={{ width: `${analyticsData.performance || 0}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Test Coverage</span>
              <span className="text-red-400 font-medium">{analyticsData.testCoverage || 'N/A'}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 h-2.5 rounded-full" style={{ width: `${analyticsData.testCoverage || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <h4 className="font-bold text-white mb-3">Dependencies</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Total packages</span>
            <span className="text-white font-medium">{analyticsData.totalPackages || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Outdated</span>
            <span className="text-yellow-400 font-medium">{analyticsData.outdatedPackages || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Vulnerabilities</span>
            <span className="text-red-400 font-medium">{analyticsData.vulnerabilities || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
        <h4 className="font-bold text-white mb-3">Bundle Analysis</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Bundle size</span>
            <span className="text-white font-medium">{analyticsData.bundleSize || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Gzipped</span>
            <span className="text-green-400 font-medium">{analyticsData.gzippedSize || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Load time</span>
            <span className="text-white font-medium">{analyticsData.loadTime || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AiMentorPanel Component
const AiMentorPanel = ({ project = {}, onProjectUpdate }) => {
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

  // Function to handle milestone updates
  const handleMilestoneUpdate = (progress, checkedItems) => {
    // Update the project with new progress
    const updatedProject = { 
      ...project, 
      progress: progress,
      // Update milestone completion status
      milestones: project.milestones.map(milestone => ({
        ...milestone,
        completed: checkedItems[milestone.id] || false
      }))
    };
    
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
  };

  const tabs = [
    { id: 'ai-monitor', label: '🤖 AI Monitor', icon: '🤖' },
    { id: 'blueprint', label: '📋 Blueprint', icon: '📋' },
    { id: 'milestone-tracker', label: '🎯 Milestone Tracker', icon: '🎯' }
  ];

  const progress = project.progress || 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-900">
      {/* AI Mentor Header */}
      <div className="border-b border-gray-700 p-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-6 h-6 mr-2" />
          AI Mentor
        </h3>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-750'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ai-monitor' && (
          <div className="h-full flex flex-col">
            {/* AI Monitor Sub-tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'chat', label: '💬 Chat', icon: '💬' },
                { id: 'analytics', label: '📊 Analytics', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAiMonitorSubTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm transition-all duration-200 ${
                    aiMonitorSubTab === tab.id
                      ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-gray-750'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label.split(' ')[1]}
                </button>
              ))}
            </div>

            {/* AI Monitor Sub-tab Content */}
            <div className="flex-1 overflow-y-auto">
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
          <MilestoneList 
            milestones={project?.milestones || []} 
            onMilestoneUpdate={handleMilestoneUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default AiMentorPanel;