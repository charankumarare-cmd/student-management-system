import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TimetablePage = () => {
  const { user } = useAuth();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00 AM - 10:30 AM', '10:45 AM - 12:15 PM', '01:15 PM - 02:45 PM', '03:00 PM - 04:30 PM'];

  const initialSchedule = {
    'Monday-09:00 AM - 10:30 AM': { subject: 'Data Structures & Algorithms', code: 'CS301', room: 'Lab 102', teacher: 'Dr. Robert Chen' },
    'Monday-10:45 AM - 12:15 PM': { subject: 'Full Stack Web Engineering', code: 'CS302', room: 'Hall B', teacher: 'Dr. Robert Chen' },
    'Tuesday-09:00 AM - 10:30 AM': { subject: 'Digital Logic & Circuits', code: 'EE201', room: 'Room 304', teacher: 'Prof. Amanda Miller' },
    'Tuesday-01:15 PM - 02:45 PM': { subject: 'Database Management Systems', code: 'CS304', room: 'Lab 201', teacher: 'Dr. Robert Chen' },
    'Wednesday-10:45 AM - 12:15 PM': { subject: 'Data Structures & Algorithms', code: 'CS301', room: 'Lab 102', teacher: 'Dr. Robert Chen' },
    'Thursday-09:00 AM - 10:30 AM': { subject: 'Full Stack Web Engineering', code: 'CS302', room: 'Hall B', teacher: 'Dr. Robert Chen' },
    'Friday-01:15 PM - 02:45 PM': { subject: 'Software Architecture Lab', code: 'CS305', room: 'Lab 105', teacher: 'Prof. Amanda Miller' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Class Timetable Matrix</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Weekly schedule of lecture slots, lab sessions, and classroom assignments.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase w-44">Time Slot</th>
                {days.map(day => (
                  <th key={day} className="p-4 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white font-extrabold text-center uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeSlots.map(slot => (
                <tr key={slot} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="p-4 font-mono font-semibold text-slate-500 bg-slate-50/40 dark:bg-slate-900/40 border-r border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{slot}</span>
                    </div>
                  </td>
                  {days.map(day => {
                    const key = `${day}-${slot}`;
                    const session = initialSchedule[key];
                    return (
                      <td key={day} className="p-3 border-r border-slate-100 dark:border-slate-800/60 min-w-[180px]">
                        {session ? (
                          <div className="p-3.5 rounded-2xl bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 space-y-1">
                            <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-mono font-bold text-[10px]">
                              {session.code}
                            </span>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-snug mt-1">{session.subject}</h4>
                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                <span>{session.room}</span>
                              </span>
                              <span className="truncate">{session.teacher.split(' ')[1]}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-400">
                            Free Slot
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
