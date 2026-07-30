import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  Calendar,
  Bell,
  FileBarChart,
  Settings,
  ShieldAlert,
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    { title: 'Students', path: '/students', icon: Users, roles: ['admin', 'teacher'] },
    { title: 'Teachers', path: '/teachers', icon: GraduationCap, roles: ['admin'] },
    { title: 'Courses', path: '/courses', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    { title: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['admin', 'teacher', 'student'] },
    { title: 'Marks & Results', path: '/marks', icon: Award, roles: ['admin', 'teacher', 'student'] },
    { title: 'Fees Management', path: '/fees', icon: CreditCard, roles: ['admin', 'student'] },
    { title: 'Timetable', path: '/timetable', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
    { title: 'Notice Board', path: '/notices', icon: Bell, roles: ['admin', 'teacher', 'student'] },
    { title: 'Reports & Export', path: '/reports', icon: FileBarChart, roles: ['admin', 'teacher'] },
    { title: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'teacher', 'student'] }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SMS Portal</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Academy Pro</p>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md tracking-wider ${
              role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              role === 'teacher' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => toggleSidebar && toggleSidebar(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
