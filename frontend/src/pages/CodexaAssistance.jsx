// import React, { useState } from 'react';
// import logo from '../assets/logo.png';

// const CodexaAssistance = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: 'bot',
//       content: 'Hello! I\'m your Codexa Assistant. How can I help you today?',
//       timestamp: new Date().toLocaleTimeString()
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSendMessage = () => {
//     if (newMessage.trim() === '') return;

//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       sender: 'user',
//       content: newMessage,
//       timestamp: new Date().toLocaleTimeString()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     // Simulate bot response after a delay
//     setTimeout(() => {
//       const botResponses = [
//         "I understand your question. Let me help you with that.",
//         "That's a great question! Here's what I know about that topic.",
//         "Based on my knowledge, here's the information you're looking for.",
//         "I've found some information that might be helpful to you.",
//         "Let me provide you with a detailed explanation."
//       ];
      
//       const botMessage = {
//         id: Date.now() + 1,
//         sender: 'bot',
//         content: botResponses[Math.floor(Math.random() * botResponses.length)],
//         timestamp: new Date().toLocaleTimeString()
//       };

//       setMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1000);
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
//                 {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//                 </svg> */}
//                 <img className="h-8 w-8" src={logo} alt="My Logo" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Codexa Assistance</h1>
//                 <p className="text-blue-100">Your AI-powered coding assistant</p>
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
//                   className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl ${
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
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
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
//                 Codexa Assistance can help with general coding questions, platform navigation, and project guidance
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       {/* <div className="mt-4 text-center text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">
//         <div className="flex items-center justify-center">
//           <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
//           <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
//         </div>
//         <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
//       </div> */}
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
      // Send message to backend
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
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl break-words ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 px-5 py-4 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
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
