import React, { useState } from 'react';
import { GameProject } from './types/game';
import { DEFAULT_ALCHEMIST_PROJECT } from './data/templates';
import { Header } from './components/Header';
import { Step1Player } from './components/Step1Player';
import { Step2GameObjects } from './components/Step2GameObjects';
import { Step3Scenes } from './components/Step3Scenes';
import { Step4HudOverlays } from './components/Step4HudOverlays';
import { Step5Wiring } from './components/Step5Wiring';
import { SimulatorModal } from './components/SimulatorModal';
import { ExportModal } from './components/ExportModal';
import { AssetSidebar } from './components/AssetSidebar';
import { Play, Download, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [project, setProject] = useState<GameProject>(DEFAULT_ALCHEMIST_PROJECT);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState<boolean>(false);

  const handleResetToDefault = () => {
    if (confirm('Reset to the default Alchemist Odyssey template? Any custom edits will be restored.')) {
      setProject(JSON.parse(JSON.stringify(DEFAULT_ALCHEMIST_PROJECT)));
      setActiveStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Studio Header Bar */}
      <Header
        project={project}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetToDefault={handleResetToDefault}
        isAssetsOpen={isAssetsOpen}
        onToggleAssets={() => setIsAssetsOpen(!isAssetsOpen)}
      />

      {/* Hero Sub-header Info Strip */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Light Novel & Semi-Text Game Builder
            </span>
            <span>·</span>
            <span>2D Sprite UI with Capacitor Boilerplate Export</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{project.scenes.length} Scenes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>{project.hudOverlays.length} HUD Overlays</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{project.wiringRules.length} Wired Connections</span>
            </div>
            <button
              onClick={() => setIsAssetsOpen(true)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Open Assets Sidebar"
            >
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span className="font-semibold text-amber-300">{project.assets?.length || 0} Assets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Step Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeStep === 1 && (
          <Step1Player
            player={project.player}
            onChange={updatedPlayer => setProject({ ...project, player: updatedPlayer })}
            onNext={() => setActiveStep(2)}
            assets={project.assets}
            onOpenAssets={() => setIsAssetsOpen(true)}
          />
        )}

        {activeStep === 2 && (
          <Step2GameObjects
            gameObjects={project.gameObjects}
            onChange={updatedObjs => setProject({ ...project, gameObjects: updatedObjs })}
            onNext={() => setActiveStep(3)}
            onPrev={() => setActiveStep(1)}
          />
        )}

        {activeStep === 3 && (
          <Step3Scenes
            scenes={project.scenes}
            hudOverlays={project.hudOverlays}
            onChange={updatedScenes => setProject({ ...project, scenes: updatedScenes })}
            onNext={() => setActiveStep(4)}
            onPrev={() => setActiveStep(2)}
          />
        )}

        {activeStep === 4 && (
          <Step4HudOverlays
            hudOverlays={project.hudOverlays}
            onChange={updatedHuds => setProject({ ...project, hudOverlays: updatedHuds })}
            onNext={() => setActiveStep(5)}
            onPrev={() => setActiveStep(3)}
          />
        )}

        {activeStep === 5 && (
          <Step5Wiring
            project={project}
            onChange={setProject}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onPrev={() => setActiveStep(4)}
          />
        )}
      </main>

      {/* Bottom Floating Quick Actions on Mobile */}
      <div className="md:hidden sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 flex items-center justify-between gap-3">
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Test Play</span>
        </button>
        <button
          onClick={() => setIsExportOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export ZIP</span>
        </button>
      </div>

      {/* Interactive Mobile Game Simulator Modal */}
      <SimulatorModal
        project={project}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Capacitor Boilerplate Export & Code Inspector Modal */}
      <ExportModal
        project={project}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Game Assets Management Sidebar */}
      <AssetSidebar
        project={project}
        isOpen={isAssetsOpen}
        onClose={() => setIsAssetsOpen(false)}
        onUpdateAssets={updatedAssets => setProject({ ...project, assets: updatedAssets })}
        onAssignPlayerSprite={spriteId => setProject({ ...project, player: { ...project.player, sprite: spriteId } })}
        onAssignSceneBackground={(sceneId, bgId) => setProject({
          ...project,
          scenes: project.scenes.map(s => s.id === sceneId ? { ...s, backgroundTheme: bgId } : s)
        })}
      />
    </div>
  );
}
