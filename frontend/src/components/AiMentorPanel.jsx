// src/components/AiMentorPanel.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../utils/api';
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

// --- RenderRichMessage Component (No changes needed, it's great) ---
const RenderRichMessage = ({ text = '' }) => {
    // ... your existing code for RenderRichMessage ...
    const segments = String(text).split(/```/g);
    const renderInline = (str) => {
        const parts = String(str).split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
        return parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
        if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="px-1 py-0.5 bg-gray-800 rounded text-xs text-gray-200">{p.slice(1, -1)}</code>;
        return <span key={i}>{p}</span>;
        });
    };
    const renderPlainBlock = (block, keyBase) => {
        const lines = String(block).split(/\r?\n/);
        const elements = [];
        let listBuffer = [];
        let listType = null;
        const flushList = () => {
        if (listBuffer.length === 0) return;
        if (listType === 'ol') {
            elements.push(<ol key={`ol-${keyBase}-${elements.length}`} className="list-decimal pl-5 space-y-1">{listBuffer.map((item, idx) => <li key={idx} className="text-sm leading-7">{renderInline(item)}</li>)}</ol>);
        } else if (listType === 'ul') {
            elements.push(<ul key={`ul-${keyBase}-${elements.length}`} className="list-disc pl-5 space-y-1">{listBuffer.map((item, idx) => <li key={idx} className="text-sm leading-7">{renderInline(item)}</li>)}</ul>);
        }
        listBuffer = []; listType = null;
        };
        for (const line of lines) {
        const olMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
        const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
        const headingMatch = line.match(/^\s*#{1,6}\s+(.*)$/);
        if (olMatch) { if (listType && listType !== 'ol') flushList(); listType = 'ol'; listBuffer.push(olMatch[2]); continue; }
        if (ulMatch) { if (listType && listType !== 'ul') flushList(); listType = 'ul'; listBuffer.push(ulMatch[1]); continue; }
        if (listType) flushList();
        if (headingMatch) { elements.push(<p key={`h-${keyBase}-${elements.length}`} className="text-sm leading-7 font-bold text-white mt-2">{renderInline(headingMatch[1])}</p>); continue; }
        const trimmed = line.trim();
        if (trimmed.length === 0) { elements.push(<div key={`sp-${keyBase}-${elements.length}`} className="h-2" />); }
        else { elements.push(<p key={`p-${keyBase}-${elements.length}`} className="text-sm leading-7">{renderInline(line)}</p>); }
        }
        if (listType) flushList(); return elements;
    };
    return (
        <div className="space-y-3">
        {segments.map((seg, idx) => {
            if (idx % 2 === 0) {
            return seg ? <div key={`t-${idx}`} className="space-y-2">{renderPlainBlock(seg, idx)}</div> : null;
            }
            const firstLineBreak = seg.indexOf('\n');
            const lang = firstLineBreak !== -1 ? seg.slice(0, firstLineBreak).trim() : '';
            const code = firstLineBreak !== -1 ? seg.slice(firstLineBreak + 1) : seg;
            const handleCopy = async () => { try { await navigator.clipboard.writeText(code); } catch (_) {} };
            return (
            <div key={`c-${idx}`} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs bg-gray-800 border-b border-gray-700">
                <span className="uppercase tracking-wider text-gray-300">{lang || 'code'}</span>
                <button onClick={handleCopy} className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-100">Copy</button>
                </div>
                <pre className="p-3 overflow-auto text-xs whitespace-pre-wrap"><code>{code}</code></pre>
            </div>
            );
        })}
        </div>
    );
};


// --- MilestoneList (NOW SIMPLIFIED - a "dumb" component) ---
const MilestoneList = ({ milestones = [], checkedItems = {}, onCheck }) => {
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
              {milestones.map((milestone, index) => {
                const milestoneId = milestone.id || `milestone-${index + 1}`;
                const isChecked = !!checkedItems[milestoneId];
                return (
                  <div key={milestoneId} className={`flex items-start gap-4 p-4 rounded-xl border ${isChecked ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'}`}>
                    {/* // CHANGE: Added type="button" to prevent any form submission behavior */}
                    <button
                      type="button" 
                      onClick={(e) => onCheck(milestoneId, e)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-gray-600 border-gray-500 hover:border-purple-500'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-bold ${isChecked ? 'text-green-400 line-through' : 'text-white'}`}>{milestone.title}</h4>
                      <p className="text-sm text-gray-300 mt-2">{milestone.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-3 py-1 text-xs rounded-full border ${milestone.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' : milestone.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>{milestone.priority} priority</span>
                        <span className="text-xs text-gray-400">{milestone.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
};


// --- Other child components (MentorChat, BlueprintView, etc. can remain mostly the same) ---
// ... (your existing code for MentorChat, BlueprintView, AnalysisComponent, BlueprintFlow) ...
const MentorChat = ({ projectId, messages = [], onSendMessageRemote }) => {
  // ... (your existing MentorChat code)
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
        <div className="p-4 border-b border-gray-700"><h3 className="text-lg font-bold text-white">AI Mentor Chat</h3><p className="text-sm text-gray-400">Get personalized guidance and support</p></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
          {messages.length === 0 ? <div className="text-gray-400 text-center py-12"><div className="text-5xl mb-4">💬</div><p className="text-lg">No messages yet</p><p className="text-gray-500 mt-2">Start a conversation with your AI mentor!</p></div> : messages.map(m => (<div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-xs lg:max-w-2xl px-5 py-3 rounded-2xl ${m.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'} whitespace-pre-wrap`}>
            {m.sender === 'bot' ? <RenderRichMessage text={m.content} /> : <p className="text-sm">{m.content}</p>}<p className="text-xs mt-2 opacity-70">{m.timestamp}</p></div></div>))}
          {isTypingLocal && <div className="flex justify-start"><div className="bg-gray-700 text-gray-100 px-5 py-3 rounded-2xl rounded-bl-none"><div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div></div>}
        </div>
        <div className="p-4 border-t border-gray-700"><div className="flex gap-3"><textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask your mentor anything..." className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 resize-none" rows="2" /><button onClick={handleSendMessage} disabled={!newMessage.trim()} className={`px-5 py-3 rounded-xl ${!newMessage.trim() ? 'bg-gray-600 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'}`}>Send</button></div></div>
      </div>
    );
};
const BlueprintView = ({ project, onRequestGenerate }) => { /* ... existing code ... */ return( <div>Blueprint View</div> )};
const BlueprintFlow = ({ edges = [] }) => { /* ... existing code ... */ return( <div className="h-full">React Flow Blueprint</div>)};
const AnalysisComponent = ({ analyticsData = null }) => { /* ... existing code ... */ return( <div>Analysis Component</div> )};

// --- Main AiMentorPanel (THE FIX IS HERE) ---
const AiMentorPanel = ({ project = {}, onProjectUpdate = () => {}, requestAIGeneration = null, activeFile = null }) => {
  const [activeTab, setActiveTab] = useState('ai-monitor');
  const [aiMonitorSubTab, setAiMonitorSubTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [generating, setGenerating] = useState(false);

  // --- CHANGE 1: We will manage the 'checked' state and progress here in the parent ---
  const [checkedItems, setCheckedItems] = useState({});
  const [progress, setProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const projectId = project?._id || project?.id;

  // --- CHANGE 2: Effect to initialize checked state and progress from the project prop ---
  useEffect(() => {
    const milestones = project?.milestones || [];
    const initialChecked = {};
    let initialCompleted = 0;
    milestones.forEach((m, index) => {
      const milestoneId = m.id || `milestone-${index + 1}`;
      if (m.completed) {
        initialChecked[milestoneId] = true;
        initialCompleted++;
      } else {
        initialChecked[milestoneId] = false;
      }
    });
    setCheckedItems(initialChecked);
    setCompletedCount(initialCompleted);
    setProgress(milestones.length > 0 ? Math.round((initialCompleted / milestones.length) * 100) : 0);
  }, [project?.milestones]);


  const fetchChatHistory = async () => { /* ... existing code ... */ };
  useEffect(() => { if (projectId) fetchChatHistory(); }, [projectId]);
  const handleSendMessage = async (message) => { /* ... existing code ... */ };
  const handleGenerate = async (action) => { /* ... existing code ... */ };
  const fetchAnalytics = async () => { /* ... existing code ... */ };
  useEffect(() => { if (aiMonitorSubTab === 'analytics') fetchAnalytics(); }, [aiMonitorSubTab, projectId]);


  // --- CHANGE 3: Centralized handler for milestone updates ---
  // This is now the ONLY place that handles both UI and backend updates.
  const updateTimeoutRef = useRef(null);

  const handleMilestoneCheck = (milestoneId, event) => {
    // Prevent default browser behavior that can cause a reload
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Step 1: Optimistic UI Update (Instant feedback)
    const newCheckedState = { ...checkedItems, [milestoneId]: !checkedItems[milestoneId] };
    setCheckedItems(newCheckedState);

    const milestones = project?.milestones || [];
    const total = milestones.length;
    const newCompletedCount = Object.values(newCheckedState).filter(Boolean).length;
    const newProgress = total > 0 ? Math.round((newCompletedCount / total) * 100) : 0;
    
    setProgress(newProgress);
    setCompletedCount(newCompletedCount);

    // Step 2: Debounced Backend Update (To save changes)
    if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(async () => {
        if (!projectId) return;

        const updatedMilestones = milestones.map(m => ({
            ...m,
            completed: !!newCheckedState[m.id || `milestone-${milestones.indexOf(m)+1}`]
        }));
        
        try {
            console.log("Saving progress to backend...");
            // Now we call the *grandparent* `onProjectUpdate` AFTER saving, or let the server response handle it.
            // A robust pattern would be to get the updated project from the API response.
            await api.patch(`/projects/${projectId}`, {
              milestones: updatedMilestones,
              completedMilestones: newCompletedCount,
              progress: newProgress
            });
            console.log("Progress saved successfully!");
            // Optional: You could even trigger a re-fetch from the parent here to ensure data consistency.
        } catch (err) {
            console.error('Failed to save milestones:', err);
            // Revert optimistic UI on failure
            setCheckedItems(checkedItems); 
            setProgress(progress);
            setCompletedCount(completedCount);
        }
    }, 500); // Wait 500ms after the last click to save
  };

  const tabs = [
    { id: 'ai-monitor', label: 'AI Monitor' },
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'milestone-tracker', label: 'Milestones' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="border-b border-gray-700 p-4"><h3 className="text-lg font-bold text-white flex items-center"><img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-6 h-6 mr-2" />AI Mentor</h3></div>
        <div className="flex border-b border-gray-700">
            {tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-4 py-3 text-sm ${activeTab === tab.id ? 'bg-gray-700 text-white border-b-2 border-blue-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-750'}`}>{tab.label}</button>))}
        </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'ai-monitor' && ( /* ... existing JSX for this tab ... */ <div>AI Monitor Content</div> )}
        {activeTab === 'blueprint' && ( /* ... existing JSX for this tab ... */ <div>Blueprint Content</div> )}

        {/* --- CHANGE 4: The Milestone Tracker tab now uses the centralized logic --- */}
        {activeTab === 'milestone-tracker' && (
          <div className="space-y-4 p-4">
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-2">Progress</h4>
              <div className="w-full bg-gray-600 rounded-full h-2.5"><div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
              <div className="text-sm text-gray-300 mt-2">{progress}% complete ({completedCount}/{project?.milestones?.length || 0} milestones)</div>
            </div>
            <MilestoneList 
              milestones={project?.milestones || []} 
              checkedItems={checkedItems} // Pass state down
              onCheck={handleMilestoneCheck} // Pass the handler down
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMentorPanel;