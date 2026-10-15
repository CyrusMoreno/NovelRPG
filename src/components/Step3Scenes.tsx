import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Image, MessageSquare, MousePointer, Sparkles } from 'lucide-react';
import { Scene, TextPanel, SceneButton, HudOverlay } from '../types/game';
import { BACKGROUND_PRESETS } from '../data/sprites';

interface Step3ScenesProps {
  scenes: Scene[];
  hudOverlays: HudOverlay[];
  onChange: (scenes: Scene[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Scenes: React.FC<Step3ScenesProps> = ({
  scenes,
  hudOverlays,
  onChange,
  onNext,
  onPrev,
}) => {
  const [activeSceneId, setActiveSceneId] = useState<string>(scenes[0]?.id || '');
  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];

  const handleUpdateActiveScene = (updated: Scene) => {
    onChange(scenes.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleAddScene = () => {
    const newId = `scene_${Date.now()}`;
    const newScene: Scene = {
      id: newId,
      name: 'New Story Scene',
      backgroundTheme: 'workshop_alchemy',
      textPanels: [
        {
          id: `p_${Date.now()}`,
          title: 'Scene Narrative',
          content: 'You enter a new area. The atmosphere is quiet.',
          speaker: 'Narrator'
        }
      ],
      buttons: [
        {
          id: `btn_${Date.now()}`,
          label: 'Inspect Area',
          actionType: 'open_hud',
          targetHudId: hudOverlays[0]?.id
        }
      ]
    };
    onChange([...scenes, newScene]);
    setActiveSceneId(newId);
  };

  const handleDeleteScene = (id: string) => {
    if (scenes.length <= 1) {
      alert('The game must contain at least one scene!');
      return;
    }
    const remaining = scenes.filter(s => s.id !== id);
    onChange(remaining);
    setActiveSceneId(remaining[0].id);
  };

  // Text Panel Handlers
  const handleAddTextPanel = () => {
    if (!activeScene) return;
    const newPanel: TextPanel = {
      id: `panel_${Date.now()}`,
      title: 'Descriptive Paragraph',
      content: 'New narrative description with {player.name}.',
      speaker: 'Narrator'
    };
    handleUpdateActiveScene({
      ...activeScene,
      textPanels: [...activeScene.textPanels, newPanel]
    });
  };

  const handleUpdatePanel = (idx: number, field: keyof TextPanel, val: string) => {
    if (!activeScene) return;
    const updated = [...activeScene.textPanels];
    updated[idx] = { ...updated[idx], [field]: val };
    handleUpdateActiveScene({ ...activeScene, textPanels: updated });
  };

  const handleRemovePanel = (idx: number) => {
    if (!activeScene) return;
    handleUpdateActiveScene({
      ...activeScene,
      textPanels: activeScene.textPanels.filter((_, i) => i !== idx)
    });
  };

  // Button Handlers
  const handleAddButton = () => {
    if (!activeScene) return;
    const newBtn: SceneButton = {
      id: `btn_${Date.now()}`,
      label: 'New Action',
      actionType: 'open_hud',
      targetHudId: hudOverlays[0]?.id
    };
    handleUpdateActiveScene({
      ...activeScene,
      buttons: [...activeScene.buttons, newBtn]
    });
  };

  const handleUpdateButton = (idx: number, field: keyof SceneButton, val: any) => {
    if (!activeScene) return;
    const updated = [...activeScene.buttons];
    updated[idx] = { ...updated[idx], [field]: val };
    handleUpdateActiveScene({ ...activeScene, buttons: updated });
  };

  const handleRemoveButton = (idx: number) => {
    if (!activeScene) return;
    handleUpdateActiveScene({
      ...activeScene,
      buttons: activeScene.buttons.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 3 of 5</span>
            <h1 className="text-2xl font-bold text-white mt-1">Configure Game Scenes</h1>
            <p className="text-sm text-slate-400 mt-1">
              Create and name scenes featuring light novel text panels, dynamic variables, and interactive action buttons.
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
              onClick={onNext}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
            >
              Next: HUD Overlays →
            </button>
          </div>
        </div>
      </div>

      {/* Scene Tabs Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar flex-1">
          {scenes.map(s => {
            const isActive = s.id === activeSceneId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSceneId(s.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleAddScene}
          className="flex items-center gap-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Scene</span>
        </button>
      </div>

      {activeScene && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Scene Settings, Text Panels & Buttons */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Scene Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Image className="w-4 h-4 text-amber-400" />
                  <span>Scene Atmosphere & Identification</span>
                </h2>
                {scenes.length > 1 && (
                  <button
                    onClick={() => handleDeleteScene(activeScene.id)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Scene</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Scene Name</label>
                  <input
                    type="text"
                    value={activeScene.name}
                    onChange={e => handleUpdateActiveScene({ ...activeScene, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Background Atmosphere</label>
                  <select
                    value={activeScene.backgroundTheme}
                    onChange={e => handleUpdateActiveScene({ ...activeScene, backgroundTheme: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
                  >
                    {BACKGROUND_PRESETS.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Text Panels Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Story Text Panels ({activeScene.textPanels.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Light novel narrative boxes. Interpolate variables using <code className="text-amber-300">{`{player.name}`}</code> or <code className="text-amber-300">{`{player.health_points}`}</code>.
                  </p>
                </div>
                <button
                  onClick={handleAddTextPanel}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Panel</span>
                </button>
              </div>

              <div className="space-y-4">
                {activeScene.textPanels.map((panel, idx) => (
                  <div key={panel.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          value={panel.speaker || ''}
                          onChange={e => handleUpdatePanel(idx, 'speaker', e.target.value)}
                          placeholder="Speaker (e.g. Narrator)"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-amber-300 font-semibold"
                        />
                        <input
                          type="text"
                          value={panel.title || ''}
                          onChange={e => handleUpdatePanel(idx, 'title', e.target.value)}
                          placeholder="Panel Subtitle (Optional)"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300"
                        />
                      </div>
                      <button
                        onClick={() => handleRemovePanel(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove panel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      value={panel.content}
                      onChange={e => handleUpdatePanel(idx, 'content', e.target.value)}
                      rows={3}
                      placeholder="Story prose..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-amber-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-cyan-400" />
                    <span>Scene Action Buttons ({activeScene.buttons.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Buttons rendered at the bottom of the scene to trigger HUD popups or navigate to other locations.
                  </p>
                </div>
                <button
                  onClick={handleAddButton}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Button</span>
                </button>
              </div>

              <div className="space-y-3">
                {activeScene.buttons.map((btn, idx) => (
                  <div key={btn.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                        <input
                          type="text"
                          value={btn.label}
                          onChange={e => handleUpdateButton(idx, 'label', e.target.value)}
                          placeholder="Button Label"
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white font-semibold flex-1"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-400 text-[11px]">Action:</span>
                        <select
                          value={btn.actionType}
                          onChange={e => handleUpdateButton(idx, 'actionType', e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200"
                        >
                          <option value="open_hud">Open HUD Overlay</option>
                          <option value="change_scene">Change Scene</option>
                        </select>

                        {btn.actionType === 'open_hud' ? (
                          <select
                            value={btn.targetHudId || ''}
                            onChange={e => handleUpdateButton(idx, 'targetHudId', e.target.value)}
                            className="px-2 py-1 bg-slate-900 border border-amber-500/30 rounded text-xs text-amber-300 font-semibold"
                          >
                            {hudOverlays.map(h => (
                              <option key={h.id} value={h.id}>HUD: {h.name}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={btn.targetSceneId || ''}
                            onChange={e => handleUpdateButton(idx, 'targetSceneId', e.target.value)}
                            className="px-2 py-1 bg-slate-900 border border-cyan-500/30 rounded text-xs text-cyan-300 font-semibold"
                          >
                            {scenes.filter(s => s.id !== activeScene.id).map(s => (
                              <option key={s.id} value={s.id}>Scene: {s.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveButton(idx)}
                      className="text-slate-500 hover:text-red-400 p-1.5 self-end sm:self-center"
                      title="Remove button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Live Scene Viewport Mockup */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Scene Viewport Preview</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Simulated appearance inside the mobile game container.
              </p>

              {/* Mobile Phone Mockup */}
              <div
                className="w-full rounded-2xl border-2 border-slate-700 overflow-hidden flex flex-col h-[460px] shadow-2xl relative"
                style={{
                  background: BACKGROUND_PRESETS.find(b => b.id === activeScene.backgroundTheme)?.cssBackground || '#0f172a'
                }}
              >
                {/* Scene Content Area */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 z-10">
                  <div className="text-xs font-bold text-amber-300 tracking-wide drop-shadow-md">
                    {activeScene.name}
                  </div>

                  {activeScene.textPanels.map((panel, idx) => (
                    <div key={idx} className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg">
                      {panel.speaker && (
                        <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">
                          {panel.speaker}
                        </div>
                      )}
                      <div className="text-xs text-slate-200 leading-relaxed">
                        {panel.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Bottom Scene Action Buttons */}
                <div className="p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent space-y-2 z-10">
                  {activeScene.buttons.map(btn => (
                    <div
                      key={btn.id}
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-800/90 border border-slate-700/60 text-white text-xs font-semibold flex items-center justify-between"
                    >
                      <span>{btn.label}</span>
                      <span className="text-amber-400 text-xs">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Active Scene ID: <span className="font-mono text-slate-400">{activeScene.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
