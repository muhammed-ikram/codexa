import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// SkillReport Component
const SkillReport = ({ skillsData }) => {
  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center border border-gray-700 animate-fade-in transition-all duration-300 hover:border-gray-600">
        <div className="text-3xl mb-3 transition-transform duration-300 hover:scale-110">📊</div>
        <p className="text-gray-400 text-sm transition-colors duration-300 hover:text-gray-300">No skill data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 animate-fade-in transition-all duration-300 hover:border-gray-600">
      <h3 className="text-lg font-semibold mb-4 text-white transition-colors duration-300 hover:text-blue-400">Skill Proficiency</h3>
      <div className="space-y-4">
        {skillsData.map((skill, index) => (
          <div key={index} className="transition-all duration-300 hover:bg-gray-700/50 p-2 rounded">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-white transition-colors duration-300 hover:text-blue-400">{skill.name}</span>
              <span className="text-sm text-blue-400 transition-colors duration-300 hover:text-blue-300">{skill.proficiency}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
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
const MockInterviewChat = ({ onGenerateQuestion, onEvaluateAnswer, currentQuestion }) => {
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

  const handleSend = async () => {
    if (userInput.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const answerText = userInput;
    setUserInput('');

    // If we have a current question, evaluate answer
    if (onEvaluateAnswer && currentQuestion && currentQuestion.question) {
      try {
        const result = await onEvaluateAnswer(answerText);
        if (result) {
          const aiEval = {
            id: (messages.length + 2),
            sender: 'ai',
            content: result,
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, aiEval]);
        }
      } catch (_) {}
    }
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
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 flex flex-col h-96 border border-gray-700 animate-fade-in transition-all duration-300 hover:border-gray-600">
      <h3 className="text-lg font-semibold mb-4 text-white transition-colors duration-300 hover:text-blue-400">Mock Interview</h3>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white transform hover:scale-[1.02]'
                  : 'bg-gray-700 text-gray-100 transition-colors duration-300 hover:bg-gray-600'
              }`}
            >
              <p className="transition-colors duration-300 hover:text-white">{message.content}</p>
              <p className="text-xs mt-1 opacity-70 transition-opacity duration-300 hover:opacity-100">{message.timestamp}</p>
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
          className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-500"
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
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 mb-4 border border-gray-700 animate-fade-in transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transform hover:scale-[1.01]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white transition-colors duration-300 hover:text-blue-400">{job.title}</h3>
          <p className="text-gray-400 text-sm mt-1 transition-colors duration-300 hover:text-gray-300">{job.company} • {job.location}</p>
        </div>
        <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full transition-all duration-300 hover:bg-blue-800">
          {job.type}
        </span>
      </div>
      
      <p className="my-3 text-gray-400 text-sm transition-colors duration-300 hover:text-gray-300">{job.description}</p>
      
      <div className="flex flex-wrap gap-1 mt-3">
        {(job.skills || job.tags || []).map((skill, index) => (
          <span
            key={index}
            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded transition-all duration-300 hover:bg-gray-600 hover:scale-105"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500 transition-colors duration-300 hover:text-gray-400">{job.posted}</span>
        <a href={job.url || '#'} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs rounded transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
          View
        </a>
      </div>
    </div>
  );
};

// Main CareerHub Component
const CareerHub = () => {
  const [activeTab, setActiveTab] = useState('interview-prep');
  const [skillsData, setSkillsData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState('');

  // Generate question via backend
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const generateInterviewQuestion = async () => {
    try {
      const res = await api.get('/ai-mentor/interview/question');
      const data = res?.data;
      if (data && data.question) {
        setCurrentQuestion(data);
        return data.question;
      }
      return 'Unable to generate a question right now.';
    } catch (err) {
      return 'Unable to generate a question right now.';
    }
  };

  const evaluateAnswer = async (answerText) => {
    try {
      const payload = {
        topic: currentQuestion?.topic || 'General',
        question: currentQuestion?.question || '',
        answer: answerText || ''
      };
      const res = await api.post('/ai-mentor/interview/evaluate', payload);
      const data = res?.data;
      if (typeof data?.correct === 'boolean') {
        if (data.correct) {
          return `✅ Correct. ${data.feedback || ''}`.trim();
        }
        return `❌ Incorrect. ${data.feedback || ''}${data.correctAnswer ? `\nCorrect answer: ${data.correctAnswer}` : ''}`.trim();
      }
      return 'Unable to evaluate the answer.';
    } catch (err) {
      return 'Evaluation failed. Please try again.';
    }
  };

  // Fetch jobs dynamically based on top skills using Remotive API (no key required)
  useEffect(() => {
    const controller = new AbortController();
    const fetchJobs = async () => {
      if (!skillsData || skillsData.length === 0) {
        setJobListings([]);
        return;
      }
      setJobLoading(true);
      setJobError('');
      try {
        // Use top 3 skills for concise results
        const top = skillsData.slice(0, 3).map(s => s.name);
        const queries = top.map(q => encodeURIComponent(q));
        const urls = queries.map(q => `https://remotive.com/api/remote-jobs?search=${q}`);
        const responses = await Promise.all(urls.map(u => fetch(u, { signal: controller.signal }).then(r => r.json()).catch(() => ({ jobs: [] }))));
        const merged = [];
        const seen = new Set();
        responses.forEach(resp => {
          (resp?.jobs || []).slice(0, 10).forEach(j => {
            const id = j.id || j.url;
            if (!id || seen.has(id)) return;
            seen.add(id);
            merged.push({
              id,
              title: j.title,
              company: j.company_name || j.company || 'Company',
              location: j.candidate_required_location || j.location || 'Remote',
              type: j.job_type || 'Job',
              description: (j.description || '').replace(/<[^>]+>/g, '').slice(0, 180) + '…',
              skills: top, // highlight user skills
              tags: j.tags || [],
              posted: j.publication_date ? new Date(j.publication_date).toLocaleDateString() : '',
              url: j.url || j.job_url
            });
          });
        });
        // Prioritize India jobs on top
        const prioritized = merged.sort((a, b) => {
          const ai = /india/i.test(a.location || '') || (a.tags || []).some(t => /india/i.test(t));
          const bi = /india/i.test(b.location || '') || (b.tags || []).some(t => /india/i.test(t));
          if (ai === bi) return 0;
          return ai ? -1 : 1;
        });
        setJobListings(prioritized.slice(0, 25));
      } catch (err) {
        setJobError('Failed to load job feed');
        setJobListings([]);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJobs();
    return () => controller.abort();
  }, [skillsData]);

  // Fetch user projects and compute dynamic skill proficiencies
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const list = res?.data?.projects || [];
        setProjects(list);
      } catch (err) {
        // On failure, keep empty projects
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      setSkillsData([]);
      return;
    }
    // Aggregate progress per technology across all projects
    const techTotals = new Map(); // tech -> { sumProgress, count }
    projects.forEach((p) => {
      const progress = Math.max(0, Math.min(100, p?.progress ?? (p?.isCompleted ? 100 : 0)));
      (p?.techStack || []).forEach((t) => {
        const name = typeof t === 'string' ? t : (t?.name || t?.label || 'Tech');
        const rec = techTotals.get(name) || { sum: 0, count: 0 };
        rec.sum += progress;
        rec.count += 1;
        techTotals.set(name, rec);
      });
    });
    const computed = Array.from(techTotals.entries()).map(([name, rec]) => ({
      name,
      proficiency: Math.round(rec.sum / Math.max(1, rec.count))
    }));
    // Sort by proficiency desc, take top 12 for readability
    computed.sort((a, b) => b.proficiency - a.proficiency);
    setSkillsData(computed.slice(0, 12));
  }, [projects]);

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
              <MockInterviewChat onGenerateQuestion={generateInterviewQuestion} onEvaluateAnswer={evaluateAnswer} currentQuestion={currentQuestion} />
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
              {jobLoading && (
                <div className="text-gray-400 text-sm">Loading jobs…</div>
              )}
              {(!jobLoading && jobError) && (
                <div className="text-red-400 text-sm">{jobError}</div>
              )}
              {!jobLoading && !jobError && jobListings.length === 0 && (
                <div className="text-gray-400 text-sm">No jobs found for your top skills yet.</div>
              )}
              {jobListings.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      {/* <div className="mt-4 text-center text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">
        <div className="flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
          <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
        </div>
        <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
      </div> */}
    </div>
  );
};

export default CareerHub;