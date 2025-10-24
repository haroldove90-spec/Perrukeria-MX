
import React, { useState, useEffect } from 'react';
import { Role } from './types';
import ClientView from './components/ClientView';
import AdminView from './components/AdminView';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.CLIENT);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleRole = () => {
    setRole(prevRole => (prevRole === Role.CLIENT ? Role.ADMIN : Role.CLIENT));
  };

  if (showSplash) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#E9691E]">
        <img src="https://appdesignmex.com/perrukeriamx.png" alt="Logo" className="w-48 h-48 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-2 right-2 z-50">
        <button
          onClick={toggleRole}
          className="bg-[#2BB8C9] text-white px-3 py-1 rounded-full shadow-lg text-sm transition-transform hover:scale-105"
        >
          Vista: {role === Role.CLIENT ? 'Cliente' : 'Admin'}
        </button>
      </div>
      {role === Role.CLIENT ? <ClientView /> : <AdminView />}
    </div>
  );
};

export default App;