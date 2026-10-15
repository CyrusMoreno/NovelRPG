import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, Terminal, Sparkles, FolderArchive } from 'lucide-react';
import { GameProject } from '../types/game';
import { generateCapacitorBoilerplate, createProjectZipBlob } from '../generator/codeGenerator';

interface ExportModalProps {
  project: GameProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mainJs' | 'indexHtml' | 'styleCss' | 'capacitorConfig' | 'packageJson' | 'readmeMd'>('mainJs');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const generated = generateCapacitorBoilerplate(project);

  const tabs: { key: keyof typeof generated; label: string; file: string }[] = [
    { key: 'mainJs', label: 'main.js (Documented Logic)', file: 'www/main.js' },
    { key: 'indexHtml', label: 'index.html (Single Page)', file: 'www/index.html' },
    { key: 'styleCss', label: 'style.css (Novel Theme)', file: 'www/style.css' },
    { key: 'capacitorConfig', label: 'capacitor.config.json', file: 'capacitor.config.json' },
    { key: 'packageJson', label: 'package.json', file: 'package.json' },
    { key: 'readmeMd', label: 'README.md (Build Guide)', file: 'README.md' },
  ];

  const currentContent = generated[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const blob = await createProjectZipBlob(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_capacitor_game.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create zip:', e);
      alert('Could not create zip file.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generated Capacitor Boilerplate</h2>
              <p className="text-xs text-slate-400">
                Single-file web engine (<code className="text-amber-300">index.html</code>, <code className="text-amber-300">style.css</code>, <code className="text-amber-300">main.js</code>) packaged for Android & iOS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Packing Zip...' : 'Download Project .ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors text-lg font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy File'}</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre font-normal selection:bg-amber-500/30 selection:text-white">
            {currentContent}
          </pre>
        </div>

        {/* Bottom Quick Build Terminal Guide */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>To launch on Android: <code className="text-emerald-300 font-mono">npm install && npx cap add android && npx cap run android</code></span>
          </div>
          <div className="text-[11px] text-slate-500">
            Includes documented wiring comments for every HUD & scene button
          </div>
        </div>
      </div>
    </div>
  );
};
