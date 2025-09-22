
// import React, { useState, useRef, useEffect } from 'react';
// import logo from '../assets/logo.png';
// import api from '../utils/api';

// const CodexaAssistance = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: 'bot',
//       content: "Hello! I'm your Codexa Assistant. How can I help you today?",
//       timestamp: new Date().toLocaleTimeString(),
//     },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === '') return;

//     const userMessage = {
//       id: Date.now(),
//       sender: 'user',
//       content: newMessage,
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     try {
//       // Send message to backend
//       const { data } = await api.post('/chat', { message: userMessage.content });

//       const botMessage = {
//         id: Date.now() + 1,
//         sender: 'bot',
//         content: data.aiResponse || "Sorry, I couldn't generate a response.",
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Chat error:', error);

//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: 'bot',
//         content: "⚠️ Oops! Something went wrong. Please try again later.",
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-gray-900 p-3 rounded-full">
//                 <img className="h-8 w-8" src={logo} alt="My Logo" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Codexa Assistance</h1>
//                 <p className="text-blue-100">Your AI-powered project mentor</p>
//               </div>
//             </div>
//           </div>

//           {/* Chat Container */}
//           <div className="flex flex-col h-[calc(100vh-200px)]">
//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${
//                     message.sender === 'user' ? 'justify-end' : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl break-words ${
//                       message.sender === 'user'
//                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
//                         : 'bg-gray-700 text-gray-100 rounded-bl-none'
//                     }`}
//                   >
//                     <p className="text-sm">{message.content}</p>
//                     <p className="text-xs mt-2 opacity-70">{message.timestamp}</p>
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-700 text-gray-100 px-5 py-4 rounded-2xl rounded-bl-none">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: '0.1s' }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: '0.2s' }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef}></div>
//             </div>

//             {/* Input Area */}
//             <div className="p-6 border-t border-gray-700">
//               <div className="flex gap-3">
//                 <textarea
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Ask me anything about coding, CodeXA, or your projects..."
//                   className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   rows="2"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                   className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
//                     !newMessage.trim()
//                       ? 'bg-gray-600 cursor-not-allowed text-gray-400'
//                       : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl'
//                   }`}
//                 >
//                   Send
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-3 text-center">
//                 Codexa Assistance can guide you in coding, project building, and practical development.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodexaAssistance;


import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import api from '../utils/api';

const CodexaAssistance = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: "Hello! I'm your Codexa Assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chat', { message: userMessage.content });

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        content: data.aiResponse || "Sorry, I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        content: "⚠️ Oops! Something went wrong. Please try again later.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to render structured content from Markdown-like syntax
  const renderBotContent = (content) => {
    const lines = content.split('\n');
    return (
      <div className="text-gray-100">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={index} className="mb-2"></div>;

          // Headings
          if (trimmed.startsWith('# ')) return <h1 key={index} className="text-lg font-bold mb-2">{trimmed.slice(2)}</h1>;
          if (trimmed.startsWith('## ')) return <h2 key={index} className="text-base font-semibold mb-2">{trimmed.slice(3)}</h2>;
          if (trimmed.startsWith('### ')) return <h3 key={index} className="font-semibold mb-1">{trimmed.slice(4)}</h3>;

          // Bullet points
          if (trimmed.startsWith('- ')) return <li key={index} className="ml-5 list-disc mb-1">{parseInlineMarkdown(trimmed.slice(2))}</li>;

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            return <li key={index} className="ml-5 list-decimal mb-1">{parseInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}</li>;
          }

          // Paragraph
          return <p key={index} className="mb-2">{parseInlineMarkdown(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Parse inline Markdown like **bold**
  const parseInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gray-900 p-3 rounded-full">
                <img className="h-8 w-8" src={logo} alt="My Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Codexa Assistance</h1>
                <p className="text-blue-100">Your AI-powered project mentor</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl break-words ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {message.sender === 'bot' ? renderBotContent(message.content) : <p className="text-sm">{message.content}</p>}
                    <p className="text-xs mt-2 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 px-5 py-4 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about coding, CodeXA, or your projects..."
                  className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="2"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    !newMessage.trim()
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Codexa Assistance can guide you in coding, project building, and practical development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodexaAssistance;
