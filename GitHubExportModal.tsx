import React, { useState } from 'react';
import { 
  Download, 
  X, 
  Github, 
  Check, 
  Copy, 
  Terminal, 
  ExternalLink, 
  Globe, 
  FolderArchive,
  Layers,
  Sparkles
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = [
    'git init',
    'git add .',
    'git commit -m "feat: complete DPIA CBSE School Management System"',
    'git branch -M main',
    'git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git',
    'git push -u origin main'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Download Project ZIP & Upload to GitHub</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Delhi Public International Academy (DPIA) CBSE Suite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] text-xs">
          {/* Main Download CTA Box */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/60 dark:from-indigo-950/40 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-2xl text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full mx-auto flex items-center justify-center shadow-md">
              <FolderArchive className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Download Codebase ZIP Archive
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                Contains complete React + TypeScript source code, Tailwind CSS config, Vite build scripts, authentic CBSE report cards, ID card generator, fleet tracker, and documentation.
              </p>
              <div className="text-[11px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold mt-1">
                File: dpia-cbse-school-management-system.zip (~3.8 MB)
              </div>
            </div>

            <a
              href="/dpia-cbse-school-management-system.zip"
              download="dpia-cbse-school-management-system.zip"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md transition-all text-sm w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP File Now</span>
            </a>
          </div>

          {/* Option A: Terminal Push Commands */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                <span>Method 1: Terminal / Command Prompt Commands</span>
              </h5>
              <button
                onClick={() => copyToClipboard(gitCommands.join('\n'), 99)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedIndex === 99 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 99 ? 'Copied All!' : 'Copy All Commands'}</span>
              </button>
            </div>

            <p className="text-slate-500 text-[11px]">
              ZIP file ko extract karein, terminal me folder kholein, aur ye commands run karein:
            </p>

            <div className="bg-slate-950 text-slate-200 rounded-lg p-3 font-mono text-[11px] space-y-1.5 overflow-x-auto border border-slate-800">
              {gitCommands.map((cmd, idx) => (
                <div key={idx} className="flex items-center justify-between group py-0.5">
                  <span className="text-emerald-400 select-all">$ {cmd}</span>
                  <button
                    onClick={() => copyToClipboard(cmd, idx)}
                    className="p-1 text-slate-500 hover:text-white rounded opacity-80 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Option B: Direct Browser Upload (Without Terminal) */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Method 2: Browser me Direct GitHub.com par Upload (Bina Terminal ke)</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <li>Upar diye gaye green button se <strong>ZIP file download karein</strong> aur extract (unzip) karein.</li>
              <li>
                <a 
                  href="https://github.com/new" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center gap-0.5"
                >
                  <span>github.com/new</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a> 
                par jaakar naya repository banayein (e.g. <code>dpia-school-management</code>).
              </li>
              <li>Repo banne ke baad <strong>"uploading an existing file"</strong> link par click karein.</li>
              <li>Extracted folder ke saare files aur folders ko drag & drop karein aur <strong>"Commit changes"</strong> click karein!</li>
            </ol>
          </div>

          {/* Free 1-Click Deployment */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Free 1-Click Hosting / Deployment (Vercel)</span>
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              GitHub par code push karne ke baad, <strong>Vercel.com</strong> par apna GitHub account connect karein aur repo select karke <strong>Deploy</strong> click karein. Aapko 30 seconds me live <code>.vercel.app</code> website URL mil jayegi!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Vite 8 + React 19 + Tailwind CSS 4
          </span>

          <div className="flex items-center gap-2">
            <a
              href="/dpia-cbse-school-management-system.zip"
              download="dpia-cbse-school-management-system.zip"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
