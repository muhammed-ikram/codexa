import React, { useState, useEffect } from 'react';

// MilestoneList Component
const MilestoneList = ({ milestones = [] }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-purple-300">Project Milestones</h3>
      {milestones.length === 0 ? (
        <div className="text-gray-400 text-center py-8 rounded-xl border-2 border-dashed border-gray-700">
          Yes milestones available for this project
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id || index}
              className="flex items-start gap-3 p-3 bg-gray-700/50 backdrop-blur-lg rounded-lg hover:bg-gray-600 transition-all duration-200 border border-gray-600"
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
                  <span className={`px-2 py-1 text-xs rounded-full border ${
                    milestone.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
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
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-purple-300">AI Mentor Chat</h3>
        <p className="text-sm text-gray-400">Get personalized guidance and support</p>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8 rounded-xl border-2 border-dashed border-gray-700">
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
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
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
            className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              !newMessage.trim()
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl"
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
const BlueprintView = ({ techStack = [], objectives = [], goals = [] }) => {
  const defaultTechStack = techStack;
  const defaultObjectives = objectives;
  const projectGoals = goals;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-purple-300">Project Blueprint</h3>
      
      {/* Tech Stack Section */}
      <div>
        <h4 className="text-md font-medium text-white mb-3">Technology Stack</h4>
        {defaultTechStack.length === 0 ? (
          <div className="text-gray-400 text-center py-4 rounded-xl border-2 border-dashed border-gray-700">
            No technology stack defined yet
          </div>
        ) : (
          <div className="grid gap-3">
            {defaultTechStack.map((tech, index) => (
              <div key={index} className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{tech.name}</h5>
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 rounded-full border border-purple-500/30">
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
          <div className="text-gray-400 text-center py-4 rounded-xl border-2 border-dashed border-gray-700">
            No learning objectives defined yet
          </div>
        ) : (
          <div className="grid gap-3">
            {defaultObjectives.map((objective, index) => (
              <div key={index} className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-3 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">{objective.skill}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full border ${
                    objective.level === 'Beginner' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    objective.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
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
        <h4 className="text-md font-medium text-white mb-3">Project Goals</h4>
        <div className="bg-gray-700/50 backdrop-blur-lg rounded-lg p-4 border border-gray-600">
          {projectGoals && projectGoals.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-300">
              {projectGoals.map((goal, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                  {goal}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-center py-4 rounded-xl border-2 border-dashed border-gray-700">
              No project goals defined yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main AiMentorPanel Component
const AiMentorPanel = ({ project = {} }) => {
  const [activeTab, setActiveTab] = useState('Milestones');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

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

  const tabs = [
    { id: 'Milestones', label: 'Milestones', icon: '🎯' },
    { id: 'Mentor Chat', label: 'Mentor Chat', icon: '💬' },
    { id: 'Blueprint', label: 'Blueprint', icon: '📋' }
  ];

  const progress = project.progress || 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold mb-2">{project.title || 'Current Project'}</h2>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-400">{project.description || 'AI-guided development workspace'}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-blue-500 bg-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Milestones' && (
          <MilestoneList milestones={project.milestones || []} />
        )}
        {activeTab === 'Mentor Chat' && (
          <MentorChat 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
          />
        )}
        {activeTab === 'Blueprint' && (
          <BlueprintView 
            techStack={project.techStack || []} 
            objectives={project.objectives || []} 
            goals={project.goals || []}
          />
        )}
      </div>
    </div>
  );
};

export default AiMentorPanel;