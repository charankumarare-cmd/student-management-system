import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', subtext }) => {
  const colorMap = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-500 bg-blue-500/10',
    purple: 'from-purple-500 to-pink-600 shadow-purple-500/20 text-purple-500 bg-purple-500/10',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-500 bg-emerald-500/10',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/20 text-amber-500 bg-amber-500/10',
    rose: 'from-rose-500 to-red-600 shadow-rose-500/20 text-rose-500 bg-rose-500/10'
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${selectedColor.split(' ').slice(3).join(' ')} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-4 flex items-center space-x-2 text-xs font-medium">
          {trend && (
            <span className={`inline-flex items-center space-x-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{trend}</span>
            </span>
          )}
          {subtext && <span className="text-slate-400 dark:text-slate-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
