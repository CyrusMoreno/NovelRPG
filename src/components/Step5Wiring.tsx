import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, GitBranch, Code, CheckCircle2, AlertCircle, Copy, Play } from 'lucide-react';
import { GameProject, WiringRule } from '../types/game';

interface Step5WiringProps {
  project: GameProject;
  onChange: (updatedProject: GameProject) => void;
  onOpenSimulator: () => void;
  onOpenExport: () => void;
  onPrev: () => void;
}

export const Step5Wiring: React.FC<Step5WiringProps> = ({
  project,
  onChange,
  onOpenSimulator,
  onOpenExport,
  onPrev,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(project.scenes[0]?.id || '');
  const [selectedButtonId, setSelectedButtonId] = useState<string>(project.scenes[0]?.buttons[0]?.id || '');
  const [selectedHudId, setSelectedHudId] = useState<string>(project.hudOverlays[0]?.id || '');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const selectedScene = project.scenes.find(s => s.id === selectedSceneId);
  const availableButtons = selectedScene?.buttons || [];

  const handleAddWiring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSceneId || !selectedButtonId || !selectedHudId) return;

    const scene = project.scenes.find(s => s.id === selectedSceneId);
    const button = scene?.buttons.find(b => b.id === selectedButtonId);
    const hud = project.hudOverlays.find(h => h.id === selectedHudId);

    const docNote = `HUD [${hud?.name || selectedHudId}] that comes up when button [${button?.label || selectedButtonId}] of Scene [${scene?.name || selectedSceneId}] is pressed`;

    const newRule: WiringRule = {
      id: `wire_${Date.now()}`,
      sceneId: selectedSceneId,
      buttonId: selectedButtonId,
      hudId: selectedHudId,
      notes: docNote
    };

    // Also update the button's actionType and targetHudId in the scene
    const updatedScenes = project.scenes.map(s => {
      if (s.id !== selectedSceneId) return s;
      return {
        ...s,
        buttons: s.buttons.map(b => {
          if (b.id !== selectedButtonId) return b;
          return {
            ...b,
            actionType: 'open_hud' as const,
            targetHudId: selectedHudId
          };
        })
      };
    });

    onChange({
      ...project,
      scenes: updatedScenes,
      wiringRules: [...project.wiringRules, newRule]
    });
  };

  const handleRemoveWiring = (ruleId: string) => {
    onChange({
      ...project,
      wiringRules: project.wiringRules.filter(r => r.id !== ruleId)
    });
  };

  const handleAutoSyncAllSceneButtons = () => {
    // Collect all scene buttons that target a HUD
    const syncedRules: WiringRule[] = [];
    project.scenes.forEach(scene => {
      scene.buttons.forEach(btn => {
        if (btn.actionType === 'open_hud' && btn.targetHudId) {
          const hud = project.hudOverlays.find(h => h.id === btn.targetHudId);
          syncedRules.push({
            id: `sync_${scene.id}_${btn.id}`,
            sceneId: scene.id,
            buttonId: btn.id,
            hudId: btn.targetHudId,
            notes: `HUD [${hud?.name || btn.targetHudId}] that comes up when button [${btn.label}] of Scene [${scene.name}] is pressed`
          });
        }
      });
    });

    onChange({
      ...project,
      wiringRules: syncedRules
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 5 of 5</span>
            <h1 className="text-2xl font-bold text-white mt-1">Wiring & Logic Engine</h1>
            <p className="text-sm text-slate-400 mt-1">
              Connect Scene buttons to trigger HUD Overlays and update game variables. Every connection is documented cleanly into the resulting Capacitor code.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Simulator</span>
            </button>
            <button
              onClick={onOpenExport}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
            >
              Export Capacitor →
            </button>
          </div>
        </div>
      </div>

      {/* Wiring Rules Visual List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Active Interactive Connections ({project.wiringRules.length})</h2>
          </div>
          <button
            onClick={handleAutoSyncAllSceneButtons}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Auto-Sync All Scene Buttons
          </button>
        </div>

        <div className="space-y-3">
          {project.wiringRules.map((rule, idx) => {
            const scene = project.scenes.find(s => s.id === rule.sceneId);
            const button = scene?.buttons.find(b => b.id === rule.buttonId);
            const hud = project.hudOverlays.find(h => h.id === rule.hudId);

            return (
              <div
                key={rule.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  {/* Visual Connection Flow */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      Scene: {scene?.name || rule.sceneId}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      Button: "{button?.label || rule.buttonId}"
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Opens HUD: {hud?.name || rule.hudId}
                    </span>
                  </div>

                  {/* Generated Code Documentation Comment */}
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate pr-2">
                      <span className="text-slate-600">// Documented code block:</span> "{rule.notes}"
                    </span>
                    <span className="text-[10px] text-emerald-400 font-sans font-semibold shrink-0">
                      Capacitor ready
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveWiring(rule.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors self-end md:self-center"
                  title="Remove wiring"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Connection Form */}
        <form onSubmit={handleAddWiring} className="pt-4 border-t border-slate-800 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">When in Scene:</label>
            <select
              value={selectedSceneId}
              onChange={e => {
                setSelectedSceneId(e.target.value);
                const s = project.scenes.find(sc => sc.id === e.target.value);
                if (s && s.buttons[0]) {
                  setSelectedButtonId(s.buttons[0].id);
                }
              }}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
            >
              {project.scenes.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">When Player Clicks Button:</label>
            <select
              value={selectedButtonId}
              onChange={e => setSelectedButtonId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
            >
              {availableButtons.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Pop Up HUD Overlay:</label>
            <select
              value={selectedHudId}
              onChange={e => setSelectedHudId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-semibold text-amber-300"
            >
              {project.hudOverlays.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect & Document</span>
          </button>
        </form>
      </div>

      {/* Variable Reference Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Variable Reference Cheat Sheet</h2>
        </div>
        <p className="text-xs text-slate-400">
          Use these expressions directly inside Scene text panels or HUD dialogue strings to render live reactive variables.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Player stats */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Player Variables</span>
            {project.player.variables.slice(0, 5).map(v => (
              <div key={v.key} className="flex items-center justify-between text-xs font-mono">
                <code className="text-slate-300">{`{player.${v.key}}`}</code>
                <span className="text-amber-400 font-bold text-[11px]">{String(v.value)}</span>
              </div>
            ))}
          </div>

          {/* NPCs */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">NPCs & Entities</span>
            {project.gameObjects.filter(o => o.category === 'npc').map(npc => (
              <div key={npc.id} className="text-xs font-mono space-y-1">
                {npc.variables.slice(0, 2).map(v => (
                  <div key={v.key} className="flex items-center justify-between">
                    <code className="text-slate-300 truncate">{`{npcs.${npc.id}.${v.key}}`}</code>
                    <span className="text-emerald-400 font-bold text-[11px]">{String(v.value)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Quests & Items */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Quests & State</span>
            {project.gameObjects.filter(o => o.category === 'quest').map(q => (
              <div key={q.id} className="text-xs font-mono space-y-1">
                {q.variables.slice(0, 2).map(v => (
                  <div key={v.key} className="flex items-center justify-between">
                    <code className="text-slate-300 truncate">{`{quests.${q.id}.${v.key}}`}</code>
                    <span className="text-cyan-400 font-bold text-[11px]">{String(v.value)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
