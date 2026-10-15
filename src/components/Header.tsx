import React from 'react';
import { Play, Download, Sparkles, RotateCcw } from 'lucide-react';
import { GameProject } from '../types/game';

interface HeaderProps {
  project: GameProject;
  activeStep: number;
  onSelectStep: (step: number) => void;
  onOpenSimulator: () => void;
  onOpenExport: () => void;
  onResetToDefault: () => void;
  isAssetsOpen: boolean;
  onToggleAssets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeStep,
  onSelectStep,
  onOpenSimulator,
  onOpenExport,
  onResetToDefault,
  isAssetsOpen,
  onToggleAssets,
}) => {
  const steps = [
    { num: 1, label: '1. Player' },
    { num: 2, label: '2. Game Objects' },
    { num: 3, label: '3. Scenes' },
    { num: 4, label: '4. HUD Overlays' },
    { num: 5, label: '5. Wiring & Logic' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
              NC
            </div>
            <div>
              <div className="font-bold tracking-tight text-white flex items-center gap-2">
                <span>NovelCap Studio</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  Capacitor 2D
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs">{project.name}</p>
            </div>
          </div>

          {/* Navigation Step Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            {steps.map(step => (
              <button
                key={step.num}
                onClick={() => onSelectStep(step.num)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeStep === step.num
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {step.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleAssets}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors border whitespace-nowrap ${
                isAssetsOpen
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Sprite, Background & Sound Assets Sidebar"
            >
              <span>Assets</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isAssetsOpen ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-900 text-amber-300'
              }`}>
                {project.assets?.length || 0}
              </span>
            </button>
            <button
              onClick={onResetToDefault}
              title="Reset to Alchemist Default Template"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Simulator</span>
            </button>
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Capacitor</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto no-scrollbar">
          {steps.map(step => (
            <button
              key={step.num}
              onClick={() => onSelectStep(step.num)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
                activeStep === step.num
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
