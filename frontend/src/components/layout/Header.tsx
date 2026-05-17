'use client';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <div className="bg-slate-800/30 border-b border-slate-700/50 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-white font-bold text-xl">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white text-sm font-medium">{user.email}</p>
            <p className="text-slate-400 text-xs">{user.role}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}