import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          Hello Admin
        </h1>
        <p className="text-gray-400 text-xl mb-12">Welcome to the admin dashboard</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-[1.02]">
            <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">📊</div>
            <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-400">Users</h3>
            <p className="text-3xl font-bold text-blue-400 transition-colors duration-300 hover:text-blue-300">124</p>
            <p className="text-gray-400 mt-2 transition-colors duration-300 hover:text-gray-300">Total registered users</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up transition-all duration-300 hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/20 transform hover:scale-[1.02]">
            <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">📦</div>
            <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-green-400">Projects</h3>
            <p className="text-3xl font-bold text-green-400 transition-colors duration-300 hover:text-green-300">86</p>
            <p className="text-gray-400 mt-2 transition-colors duration-300 hover:text-gray-300">Active projects</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-xl animate-slide-up transition-all duration-300 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20 transform hover:scale-[1.02]">
            <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">⚙️</div>
            <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-yellow-400">System</h3>
            <p className="text-3xl font-bold text-yellow-400 transition-colors duration-300 hover:text-yellow-300">98%</p>
            <p className="text-gray-400 mt-2 transition-colors duration-300 hover:text-gray-300">System uptime</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-4 text-center text-gray-500 text-xs transition-all duration-300 hover:text-gray-400">
        <div className="flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
          <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
        </div>
        <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  )
}

export default AdminDashboard