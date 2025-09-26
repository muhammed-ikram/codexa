import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages_css/Home.css";
import logo from '../assets/logo.png'; // Explicitly import the logo

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <img src={logo} alt="CodeXA Logo" className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CodeXA
            </span>
          </div>
          <div className="text-sm font-medium text-gray-400 italic whitespace-nowrap">for the engineers, by the engineers</div>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Code Smarter,
          </span>
          <br />
          <span className="text-white">Not Harder</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
          AI-powered coding assistant that helps you build, learn, and deploy projects faster than ever before.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Start Building
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 animate-slide-up">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">AI Mentor</h3>
              <p className="text-gray-400">
                Get personalized guidance and support throughout your development journey.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 animate-slide-up">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Smart Deployment</h3>
              <p className="text-gray-400">
                AI-powered deployment recommendations tailored to your project stack.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 animate-slide-up">
              <div className="text-3xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-3">Career Hub</h3>
              <p className="text-gray-400">
                Find jobs and prepare for interviews with our career development tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-12 border border-gray-700 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Coding Journey?</h2>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are already building better projects faster with CodeXA.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-3 border-t border-gray-800 transition-all duration-300 hover:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center">
              <img src={logo} alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
              <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-300 hover:to-purple-400">
                CodeXA
              </span>
            </div>
            <div className="text-xs font-medium text-gray-500 ml-2 italic transition-colors duration-300 hover:text-gray-300">for the engineers, by the engineers</div>
          </div>
          <p className="text-gray-500 text-xs mt-1 transition-colors duration-300 hover:text-gray-300">
            © 2025 CodeXA. All rights reserved.
          </p>
          <div className="flex justify-center space-x-3 mt-1">
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-xs transition-all duration-300 hover:scale-105">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-xs transition-all duration-300 hover:scale-105">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-xs transition-all duration-300 hover:scale-105">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;