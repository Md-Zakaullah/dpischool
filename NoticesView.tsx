import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  Calendar, 
  AlertTriangle, 
  BookOpen, 
  PartyPopper, 
  CheckCircle2, 
  X,
  Search
} from 'lucide-react';
import { CampusNotice } from '../types/school';

interface NoticesViewProps {
  notices: CampusNotice[];
  onAddNotice: (notice: CampusNotice) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  onAddNotice,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(notices[0]?.id || null);

  // New circular draft
  const [newNotice, setNewNotice] = useState({
    title: '',
    summary: '',
    content: '',
    audience: 'All School' as const,
    priority: 'Standard' as const,
    author: 'Dr. Nandita Sen',
    authorRole: 'Principal'
  });

  const filteredNotices = notices.filter(n => {
    const matchesAudience = selectedAudience === 'all' || n.audience.toLowerCase().includes(selectedAudience.toLowerCase());
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAudience && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    const notice: CampusNotice = {
      id: `not-${Date.now()}`,
      title: newNotice.title,
      summary: newNotice.summary || newNotice.title,
      content: newNotice.content,
      audience: newNotice.audience,
      priority: newNotice.priority,
      date: '2026-11-06',
      author: newNotice.author,
      authorRole: newNotice.authorRole,
      readTime: '2 min read'
    };

    onAddNotice(notice);
    setIsAddModalOpen(false);
    setNewNotice({
      title: '',
      summary: '',
      content: '',
      audience: 'All School',
      priority: 'Standard',
      author: 'Dr. Evelyn Vance',
      authorRole: 'Head of School'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Notices & Official Circulars
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Academy Communications · Administrative Bulletins & Safety Advisories
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish Circular</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars by keywords, date or author..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {['all', 'Faculty', 'Parents', 'Students'].map((aud) => (
            <button
              key={aud}
              onClick={() => setSelectedAudience(aud)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedAudience === aud
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {aud === 'all' ? 'All Audiences' : aud}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isExpanded = expandedNoticeId === notice.id;
          return (
            <div
              key={notice.id}
              className={`rounded-xl border transition-all ${
                notice.priority === 'Urgent'
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div 
                onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${
                      notice.priority === 'Urgent'
                        ? 'text-amber-700 dark:text-amber-400'
                        : notice.priority === 'Academic'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      [{notice.priority.toUpperCase()}]
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400">Audience: {notice.audience}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">{notice.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {notice.summary}
                  </p>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                    {notice.author}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {notice.authorRole}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-3">
                  <p className="leading-relaxed whitespace-pre-line">
                    {notice.content}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Estimated read: {notice.readTime}</span>
                    <span>Atherton Academy Official Registry</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PUBLISH CIRCULAR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Publish Campus Circular
                </h3>
                <p className="text-xs text-slate-500">
                  Official Communication Broadcast
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  placeholder="e.g. Science Fair Registration Deadline Extended"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Audience</label>
                  <select
                    value={newNotice.audience}
                    onChange={(e) => setNewNotice({...newNotice, audience: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="All School">All School Community</option>
                    <option value="Faculty">Faculty & Staff Only</option>
                    <option value="Parents">Parents & Guardians</option>
                    <option value="Students">Scholars & Students</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Priority Classification</label>
                  <select
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({...newNotice, priority: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Standard">Standard Circular</option>
                    <option value="Academic">Academic Notice</option>
                    <option value="Event">Campus Event</option>
                    <option value="Urgent">Urgent / Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Summary (1-2 sentences)</label>
                <input
                  type="text"
                  value={newNotice.summary}
                  onChange={(e) => setNewNotice({...newNotice, summary: e.target.value})}
                  placeholder="Brief preview of the notice..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Announcement Text *</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  placeholder="Provide comprehensive details, instructions, dates, and contacts..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
