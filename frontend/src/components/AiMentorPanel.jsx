// src/components/AiMentorPanel.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../utils/api';
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import logo from '../assets/logo.png'; // Explicitly import the logo

// Lightweight renderer for Markdown-ish with lists, bold, and fenced code blocks + copy
const RenderRichMessage = ({ text = '' }) => {
  const segments = String(text).split(/```/g);

  const renderInline = (str) => {
    // Support **bold** and inline `code`
    const parts = String(str).split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
      }
      if (p.startsWith('`') && p.endsWith('`')) {
        return <code key={i} className="px-1 py-0.5 bg-gray-800 rounded text-xs text-gray-200">{p.slice(1, -1)}</code>;
      }
      return <span key={i}>{p}</span>;
    });
  };

  const renderPlainBlock = (block, keyBase) => {
    const lines = String(block).split(/\r?\n/);
    const elements = [];
    let listBuffer = [];
    let listType = null; // 'ol' | 'ul'

    const flushList = () => {
      if (listBuffer.length === 0) return;
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${keyBase}-${elements.length}`} className="list-decimal pl-5 space-y-1">
            {listBuffer.map((item, idx) => <li key={idx} className="text-sm leading-7">{renderInline(item)}</li>)}
          </ol>
        );
      } else if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${keyBase}-${elements.length}`} className="list-disc pl-5 space-y-1">
            {listBuffer.map((item, idx) => <li key={idx} className="text-sm leading-7">{renderInline(item)}</li>)}
          </ul>
        );
      }
      listBuffer = [];
      listType = null;
    };

    for (const line of lines) {
      const olMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
      const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
      const headingMatch = line.match(/^\s*#{1,6}\s+(.*)$/);

      if (olMatch) {
        const content = olMatch[2];
        if (listType && listType !== 'ol') flushList();
        listType = 'ol';
        listBuffer.push(content);
        continue;
      }
      if (ulMatch) {
        const content = ulMatch[1];
        if (listType && listType !== 'ul') flushList();
        listType = 'ul';
        listBuffer.push(content);
        continue;
      }

      // End any list when hitting a non-list line
      if (listType) flushList();

      if (headingMatch) {
        elements.push(
          <p key={`h-${keyBase}-${elements.length}`} className="text-sm leading-7 font-bold text-white mt-2">
            {renderInline(headingMatch[1])}
          </p>
        );
        continue;
      }

      const trimmed = line.trim();
      if (trimmed.length === 0) {
        elements.push(<div key={`sp-${keyBase}-${elements.length}`} className="h-2" />);
      } else {
        elements.push(
          <p key={`p-${keyBase}-${elements.length}`} className="text-sm leading-7">
            {renderInline(line)}
          </p>
        );
      }
    }

    if (listType) flushList();
    return elements;
  };

  return (
    <div className="space-y-3">
      {segments.map((seg, idx) => {
        if (idx % 2 === 0) {
          return seg ? (
            <div key={`t-${idx}`} className="space-y-2">
              {renderPlainBlock(seg, idx)}
            </div>
          ) : null;
        }
        const firstLineBreak = seg.indexOf('\n');
        const lang = firstLineBreak !== -1 ? seg.slice(0, firstLineBreak).trim() : '';
        const code = firstLineBreak !== -1 ? seg.slice(firstLineBreak + 1) : seg;
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(code);
          } catch (_) {}
        };
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

// --- MilestoneList (optimized to prevent reloads) ---
const MilestoneList = ({ milestones = [], onMilestoneUpdate, onProgressChange }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const updateTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const initialChecked = {};
    milestones.forEach((m, index) => {
      // Ensure milestone has an ID
      const milestoneId = m.id || `milestone-${index + 1}`;
      initialChecked[milestoneId] = m.completed || false;
    });
    setCheckedItems(initialChecked);
    
    // Calculate initial progress and notify parent
    const total = milestones.length;
    const completed = Object.values(initialChecked).filter(Boolean).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (onProgressChange) onProgressChange(progress, completed);
  }, [milestones, onProgressChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const debouncedUpdate = useCallback((progress, newChecked) => {
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Shorter debounce for better responsiveness
    updateTimeoutRef.current = setTimeout(() => {
      const now = Date.now();
      // Reduced minimum interval for more responsive updates
      if (now - lastUpdateRef.current > 100) {
        lastUpdateRef.current = now;
        console.log('Debounced milestone update:', progress, newChecked);
        if (onMilestoneUpdate) {
          onMilestoneUpdate(progress, newChecked);
        }
      }
    }, 100);
  }, [onMilestoneUpdate]);

  const handleCheck = useCallback((id, event) => {
    // Prevent any default behavior that might cause page reload
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);

    const total = milestones.length;
    const completed = Object.values(newChecked).filter(Boolean).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update progress immediately for responsive UI
    if (onProgressChange) onProgressChange(progress, completed);

    // Use debounced update for backend persistence
    debouncedUpdate(progress, newChecked);
  }, [checkedItems, milestones.length, debouncedUpdate, onProgressChange]);

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
            // Ensure milestone has an ID
            const milestoneId = milestone.id || `milestone-${index + 1}`;
            return (
              <div key={milestoneId} className={`flex items-start gap-4 p-4 rounded-xl border ${checkedItems[milestoneId] ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCheck(milestoneId, e);
                  }}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    checkedItems[milestoneId] 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'bg-gray-600 border-gray-500 hover:border-purple-500'
                  }`}
                >
                  {checkedItems[milestoneId] && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <h4 className={`font-bold ${checkedItems[milestoneId] ? 'text-green-400 line-through' : 'text-white'}`}>{milestone.title}</h4>
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
              <div className={`max-w-xs lg:max-w-2xl px-5 py-3 rounded-2xl ${m.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-100 rounded-bl-none'} whitespace-pre-wrap`}>
                {m.sender === 'bot' ? (
                  <RenderRichMessage text={m.content} />
                ) : (
                  <p className="text-sm">{m.content}</p>
                )}
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
  const milestones = Array.isArray(project?.milestones) ? project.milestones : [];

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
          <div className="h-[36rem] bg-gray-800/60 rounded-xl border border-gray-700">
            <BlueprintFlow edges={blueprint} />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Project Goals</h4>
        {milestones.length === 0 ? (
          <div className="text-gray-400 text-center py-6">No milestones yet.</div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-200 text-sm leading-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              {(() => {
                const titles = milestones.map(m => m?.title).filter(Boolean);
                if (titles.length === 1) return `Goal: ${titles[0]}.`;
                if (titles.length === 2) return `Goals: ${titles[0]} and ${titles[1]}.`;
                const head = titles.slice(0, -1).join(', ');
                const last = titles[titles.length - 1];
                return `Goals: ${head}, and ${last}.`;
              })()}
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
              {milestones.map((m, idx) => (
                <li key={m.id || idx}>
                  <span className="font-medium text-white">{m.title}</span>
                  {m.description ? <span className="text-gray-400"> — {m.description}</span> : null}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

// --- BlueprintFlow: renders edges as a graph using React Flow ---
const BlueprintFlow = ({ edges = [] }) => {
  // Build layered layout: try to infer levels by simple BFS over edge graph
  const { nodes, rfEdges } = useMemo(() => {
    // Defensive normalization & cap sizes to avoid layout blowups
    const normalized = Array.isArray(edges)
      ? edges
          .map((e) => ({ from: String(e?.from ?? '').trim(), to: String(e?.to ?? '').trim() }))
          .filter((e) => e.from && e.to && e.from !== e.to)
      : [];
    const limited = normalized.slice(0, 40); // hard cap edges

    const adjacency = new Map();
    const inDegree = new Map();
    const allNodes = new Set();
    limited.forEach(e => {
      const from = e.from;
      const to = e.to;
      allNodes.add(from); allNodes.add(to);
      if (!adjacency.has(from)) adjacency.set(from, new Set());
      adjacency.get(from).add(to);
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
      if (!inDegree.has(from)) inDegree.set(from, inDegree.get(from) || 0);
    });
    // Sources are nodes with inDegree 0
    const queue = Array.from(allNodes).filter(n => (inDegree.get(n) || 0) === 0);
    const levelOf = new Map();
    queue.forEach(n => levelOf.set(n, 0));
    // BFS assign levels (cycle-safe: only visit once)
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      const level = levelOf.get(node) || 0;
      const nexts = Array.from(adjacency.get(node) || []);
      nexts.forEach(nxt => {
        if (!levelOf.has(nxt)) {
          levelOf.set(nxt, level + 1);
          queue.push(nxt);
        }
      });
    }
    // Group by level and assign vertical positions (top-down layout)
    const groups = new Map();
    Array.from(allNodes).forEach(n => {
      const lvl = levelOf.has(n) ? levelOf.get(n) : 0;
      if (!groups.has(lvl)) groups.set(lvl, []);
      groups.get(lvl).push(n);
    });
    // Sort levels and spread nodes
    const sortedLevels = Array.from(groups.keys()).sort((a, b) => a - b);
    const nodeObjs = [];
    const nodeWidth = 240;
    const nodeHeight = 64;
    const xGap = 160; // narrower width requires smaller horizontal spacing
    const yGap = 140; // generous vertical spacing
    // Cap node count to keep UI responsive
    let count = 0;
    sortedLevels.forEach((lvl, rowIndex) => {
      const row = groups.get(lvl);
      row.forEach((name, colIndex) => {
        if (count >= 60) return; // hard cap nodes
        nodeObjs.push({
          id: name,
          data: { label: name },
          position: { x: 40 + colIndex * xGap, y: 20 + rowIndex * yGap },
          style: {
            width: nodeWidth,
            height: nodeHeight,
            borderRadius: 12,
            background: '#1f2937',
            color: '#e5e7eb',
            border: '1px solid #4b5563',
            fontWeight: 600
          }
        });
        count++;
      });
    });

    const flowEdges = (Array.from(adjacency.keys()).length === 0 ? limited : Array.from(adjacency.entries()).flatMap(([f, set]) => Array.from(set).map(t => ({ from: f, to: t }))))
      .map((e, idx) => ({
      id: `e-${idx}`,
      source: String(e.from),
      target: String(e.to),
      animated: true,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#93c5fd' },
      style: { stroke: '#60a5fa', strokeWidth: 2 }
    }));

    return { nodes: nodeObjs, rfEdges: flowEdges };
  }, [edges]);

  return (
    <ReactFlow nodes={nodes} edges={rfEdges} fitView minZoom={0.6} defaultZoom={1.1}>
      <MiniMap nodeColor={() => '#374151'} maskColor="rgba(0,0,0,0.2)" />
      <Controls position="bottom-right" />
      <Background variant="dots" gap={20} color="#475569" />
    </ReactFlow>
  );
};

// --- AnalysisComponent (unchanged but fetchable) ---
const AnalysisComponent = ({ analyticsData = null }) => {
  if (!analyticsData) { // TODO: remove this after analytics is implemented

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
      {analyticsData?.user && (
        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <h4 className="font-bold text-white mb-2">Personalized Context</h4>
          <div className="text-sm text-gray-300 flex flex-wrap gap-4">
            <span><span className="text-gray-400">User:</span> <span className="text-white font-medium">{analyticsData.user.username}</span></span>
            <span><span className="text-gray-400">Role:</span> <span className="text-white font-medium capitalize">{analyticsData.user.role}</span></span>
            <span><span className="text-gray-400">Projects:</span> <span className="text-white font-medium">{analyticsData.user.projects}</span></span>
          </div>
        </div>
      )}
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
const AiMentorPanel = ({ project = {}, onProjectUpdate = () => {}, requestAIGeneration = null, activeFile = null }) => {
  const [activeTab, setActiveTab] = useState('ai-monitor');
  const [aiMonitorSubTab, setAiMonitorSubTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [localCompleted, setLocalCompleted] = useState(0);

  const projectId = project?._id || project?.id;

  // Initialize local progress from project (only when project changes)
  useEffect(() => {
    if (project) {
      setLocalProgress(project.progress || 0);
      setLocalCompleted(project.completedMilestones || 0);
    }
  }, [project?._id, project?.progress, project?.completedMilestones]);

  // Handle immediate progress updates from milestone changes (UI only)
  const handleProgressChange = useCallback((progress, completed) => {
    setLocalProgress(progress);
    setLocalCompleted(completed);
    
    // DO NOT call onProjectUpdate here - let handleMilestoneUpdate handle it
    // This prevents double updates that cause reloads
  }, []);

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
      const res = await api.post(`/ai-mentor/${projectId}/chat`, {
        message,
        openFile: activeFile || null,
      });
      // Expect backend to return { aiMessage }
      if (res?.data?.aiMessage) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          content: res.data.aiMessage,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatMessages(prev => [...prev, botMessage]);
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

  // Milestone update -> persist to backend (single source of truth)
  const handleMilestoneUpdate = useCallback(async (progress, checkedItems) => {
    console.log('handleMilestoneUpdate called:', progress, checkedItems);
    if (!projectId) {
      console.log('No projectId, skipping milestone update');
      return;
    }
    
    // Build updated milestones array from project.milestones using checkedItems
    const updatedMilestones = (project.milestones || []).map((m, index) => {
      // Ensure milestone has a stable ID
      const milestoneId = m.id || `milestone-${index + 1}`;
      return {
        ...m,
        id: milestoneId,
        completed: !!checkedItems[milestoneId]
      };
    });
    const completedCount = Object.values(checkedItems).filter(Boolean).length;

    // Only update if there's a meaningful change
    const currentProgress = project.progress || 0;
    const currentCompleted = project.completedMilestones || 0;
    
    if (Math.abs(progress - currentProgress) < 0.1 && completedCount === currentCompleted) {
      console.log('No significant change, skipping update');
      return;
    }

    console.log('Updating project state immediately');
    // IMMEDIATELY update project state for responsive UI
    const updatedProject = {
      ...project,
      milestones: updatedMilestones,
      completedMilestones: completedCount,
      progress: progress
    };
    onProjectUpdate(updatedProject);

    // Then save to server for persistence (fire and forget)
    try {
      console.log('Saving to backend...');
      await api.patch(`/projects/${projectId}`, {
        milestones: updatedMilestones,
        completedMilestones: completedCount,
        progress
      });
      console.log('Backend save successful');
    } catch (err) {
      console.error('Failed to save milestones:', err);
      // Could implement retry logic or show error notification here
    }
  }, [projectId, project, onProjectUpdate]);

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
          <img src={logo} alt="CodeXA Logo" className="w-6 h-6 mr-2" />
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
          <div className="space-y-6 p-4">
            {project?.description && (
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{project.description}</p>
              </div>
            )}
            <BlueprintView project={project} onRequestGenerate={async (action) => handleGenerate(action)} />
          </div>
        )}

        {activeTab === 'milestone-tracker' && (
          <div className="space-y-4 p-4">
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-2">Progress</h4>
              <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${localProgress}%` }} />
              </div>
              <div className="text-sm text-gray-300 mt-2">{localProgress}% complete ({localCompleted}/{project?.milestones?.length || 0} milestones)</div>
            </div>
            <MilestoneList 
              milestones={project?.milestones || []} 
              onMilestoneUpdate={handleMilestoneUpdate}
              onProgressChange={handleProgressChange}
            />
          </div>
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
