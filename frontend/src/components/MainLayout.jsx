import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo.png'; // Explicitly import the logo

const MainLayout = () => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/workspace');
  return (
    <div className="flex min-h-screen relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-black">
      {/* Aurora / gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-600/30 via-accent-500/20 to-brand-400/20 blur-3xl animate-gradient" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-accent-600/30 via-brand-500/20 to-accent-400/20 blur-3xl animate-gradient" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Footer */}
        <div className="flex-shrink-0 py-2 text-center text-gray-500 text-xs border-t border-gray-800">
          <div className="flex items-center justify-center">
            <img src={logo} alt="CodeXA Logo" className="w-4 h-4 mr-2" />
            <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
          </div>
          <p className="mt-1 text-xs">© 2025 CodeXA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;