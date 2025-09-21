import React, { useState, useEffect } from 'react';

// SkillReport Component
const SkillReport = ({ skillsData }) => {
  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700 animate-fade-in">
        <div className="text-3xl mb-3">📊</div>
        <p className="text-gray-400 text-sm">No skill data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-white">Skill Proficiency</h3>
      <div className="space-y-4">
        {skillsData.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-white">{skill.name}</span>
              <span className="text-sm text-blue-400">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// MockInterviewChat Component
const MockInterviewChat = ({ onGenerateQuestion }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: "Hi! I'm your interview assistant. Ready to start?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = () => {
    if (userInput.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
  };

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    if (onGenerateQuestion) {
      const newQuestion = await onGenerateQuestion();
      if (newQuestion) {
        const aiMessage = {
          id: messages.length + 1,
          sender: 'ai',
          content: newQuestion,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 flex flex-col h-96 border border-gray-700 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-white">Mock Interview</h3>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={isGenerating}
        />
        <button
          onClick={handleSend}
          disabled={isGenerating || !userInput.trim()}
          className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-[1.02] ${
            isGenerating || !userInput.trim()
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          Send
        </button>
      </div>
      
      {/* Generate question button */}
      <button
        onClick={handleGenerateQuestion}
        disabled={isGenerating}
        className={`mt-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-[1.02] ${
          isGenerating
            ? "bg-gray-600 cursor-not-allowed text-gray-400"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isGenerating ? 'Generating...' : 'New Question'}
      </button>
    </div>
  );
};

// JobCard Component
const JobCard = ({ job }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 mb-4 border border-gray-700 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">{job.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{job.company} • {job.location}</p>
        </div>
        <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full">
          {job.type}
        </span>
      </div>
      
      <p className="my-3 text-gray-400 text-sm">{job.description}</p>
      
      <div className="flex flex-wrap gap-1 mt-3">
        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">{job.posted}</span>
        <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs rounded transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
          Apply
        </button>
      </div>
    </div>
  );
};

// Main CareerHub Component
const CareerHub = () => {
  const [activeTab, setActiveTab] = useState('interview-prep');
  const [skillsData, setSkillsData] = useState([
    { name: 'React', proficiency: 85 },
    { name: 'JavaScript', proficiency: 90 },
    { name: 'Node.js', proficiency: 75 },
    { name: 'CSS', proficiency: 80 }
  ]);
  const [jobListings, setJobListings] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Build user interfaces using React and modern web technologies.',
      skills: ['React', 'JavaScript', 'CSS'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartUp Inc',
      location: 'Remote',
      type: 'Contract',
      description: 'Build scalable web applications with React and Node.js.',
      skills: ['React', 'Node.js', 'MongoDB'],
      posted: '1 week ago'
    }
  ]);

  // Mock function to generate interview questions
  const generateInterviewQuestion = async () => {
    const questions = [
      "Explain the difference between state and props in React.",
      "How would you optimize a React application?",
      "Describe a challenging bug you fixed.",
      "What are the advantages of React hooks?"
    ];
    
    return questions[Math.floor(Math.random() * questions.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold">Career Hub</h1>
          <p className="text-gray-400 text-sm mt-1">Find jobs and prepare for interviews</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('interview-prep')}
            className={`px-4 py-2 font-medium text-sm relative transition-all duration-200 ${
              activeTab === 'interview-prep'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Interview Prep
            {activeTab === 'interview-prep' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('job-feed')}
            className={`px-4 py-2 font-medium text-sm relative transition-all duration-200 ${
              activeTab === 'job-feed'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Job Feed
            {activeTab === 'job-feed' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>
        
        {/* Conditional Content Area */}
        {activeTab === 'interview-prep' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Gap Analyzer */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-white">Skill Analysis</h2>
              <SkillReport skillsData={skillsData} />
            </div>
            
            {/* Mock Interview */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-white">Interview Prep</h2>
              <MockInterviewChat onGenerateQuestion={generateInterviewQuestion} />
            </div>
          </div>
        )}
        
        {activeTab === 'job-feed' && (
          <div className="animate-fade-in">
            {/* Filters */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-white">Job Opportunities</h2>
              <div className="flex flex-wrap gap-2">
                {skillsData.map((skill, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-full text-sm hover:bg-gray-700 border border-gray-700 transition-all duration-200"
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Job List */}
            <div className="h-96 overflow-y-auto pr-2">
              {jobListings.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerHub;