import React, { useState } from 'react';
import { Plus, Trash2, Edit3, MessageCircle, Hash, Key, Bell, X, Check, Sparkles } from 'lucide-react';
import { HudOverlay, HudType } from '../types/game';
import { SPRITE_PRESETS, getSvgForSprite } from '../data/sprites';

interface Step4HudOverlaysProps {
  hudOverlays: HudOverlay[];
  onChange: (overlays: HudOverlay[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4HudOverlays: React.FC<Step4HudOverlaysProps> = ({
  hudOverlays,
  onChange,
  onNext,
  onPrev,
}) => {
  const [activeHudId, setActiveHudId] = useState<string>(hudOverlays[0]?.id || '');
  const activeHud = hudOverlays.find(h => h.id === activeHudId) || hudOverlays[0];

  const handleUpdateActiveHud = (updated: HudOverlay) => {
    onChange(hudOverlays.map(h => (h.id === updated.id ? updated : h)));
  };

  const handleAddHud = () => {
    const newId = `hud_${Date.now()}`;
    const newHud: HudOverlay = {
      id: newId,
      name: 'New Dialogue Modal',
      type: 'dialogue',
      title: 'Character Conversation',
      speakerName: 'Adventurer',
      sprite: 'npc_eldrin',
      spritePosition: 'left',
      messageText: 'Hello there, traveler! How goes your journey?',
      showCloseX: true,
      confirmButtonText: 'Understood',
      cancelButtonText: 'Close',
      submitMutations: []
    };
    onChange([...hudOverlays, newHud]);
    setActiveHudId(newId);
  };

  const handleDeleteHud = (id: string) => {
    if (hudOverlays.length <= 1) {
      alert('You need at least one HUD overlay!');
      return;
    }
    const remaining = hudOverlays.filter(h => h.id !== id);
    onChange(remaining);
    setActiveHudId(remaining[0].id);
  };

  const typeIcons: Record<HudType, any> = {
    dialogue: MessageCircle,
    input_number: Hash,
    input_text: Key,
    notification: Bell,
    stats: Sparkles,
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 4 of 5</span>
            <h1 className="text-2xl font-bold text-white mt-1">Configure HUD Overlays</h1>
            <p className="text-sm text-slate-400 mt-1">
              Design visual novel NPC dialogue modals, quantity purchase inputs, secret passcode prompts, and item storage notifications.
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
              Next: Wiring & Logic →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar flex-1">
          {hudOverlays.map(h => {
            const Icon = typeIcons[h.type] || MessageCircle;
            const isActive = h.id === activeHudId;
            return (
              <button
                key={h.id}
                onClick={() => setActiveHudId(h.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{h.name}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={handleAddHud}
          className="flex items-center gap-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New HUD</span>
        </button>
      </div>

      {activeHud && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity & Type */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  <span>HUD Purpose & Type</span>
                </h2>
                {hudOverlays.length > 1 && (
                  <button
                    onClick={() => handleDeleteHud(activeHud.id)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete HUD</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">HUD Internal Name</label>
                  <input
                    type="text"
                    value={activeHud.name}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Display Title</label>
                  <input
                    type="text"
                    value={activeHud.title}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">HUD Function Category</label>
                  <select
                    value={activeHud.type}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, type: e.target.value as HudType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
                  >
                    <option value="dialogue">Visual Novel NPC Dialogue</option>
                    <option value="input_number">Quantity / Purchase Input</option>
                    <option value="input_text">Secret Passcode / Cipher Input</option>
                    <option value="notification">Item Stored / Vault Notification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Character 2D Sprite In View</label>
                  <select
                    value={activeHud.sprite || ''}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, sprite: e.target.value || undefined })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
                  >
                    <option value="">(No Sprite / Clean Notification)</option>
                    {SPRITE_PRESETS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeHud.sprite && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Speaker Label / NPC Name</label>
                  <input
                    type="text"
                    value={activeHud.speakerName || ''}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, speakerName: e.target.value })}
                    placeholder="e.g. Master Eldrin"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 text-sm font-semibold"
                  />
                </div>
              )}
            </div>

            {/* Message Body Text */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white">Dialogue & Message Content</h2>
              <textarea
                value={activeHud.messageText}
                onChange={e => handleUpdateActiveHud({ ...activeHud, messageText: e.target.value })}
                rows={3}
                placeholder="Message displayed in the modal body..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-400">
                You can dynamically reference variables with <code className="text-amber-300">{`{player.vault_stash_count}`}</code> or <code className="text-amber-300">{`{player.gold}`}</code>.
              </p>
            </div>

            {/* Specialized Input Configurations (Number Purchase or Secret Code) */}
            {activeHud.type === 'input_number' && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>Item Purchase Calculator Setup</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={activeHud.purchaseConfig?.itemName || 'Health Elixir'}
                      onChange={e => handleUpdateActiveHud({
                        ...activeHud,
                        purchaseConfig: {
                          itemName: e.target.value,
                          unitPrice: activeHud.purchaseConfig?.unitPrice || 10,
                          currencyVariable: activeHud.purchaseConfig?.currencyVariable || 'player.gold',
                          inventoryVariable: activeHud.purchaseConfig?.inventoryVariable || 'player.potions_owned'
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Unit Price (Gold)</label>
                    <input
                      type="number"
                      value={activeHud.purchaseConfig?.unitPrice || 12}
                      onChange={e => handleUpdateActiveHud({
                        ...activeHud,
                        purchaseConfig: {
                          itemName: activeHud.purchaseConfig?.itemName || 'Health Elixir',
                          unitPrice: Number(e.target.value) || 0,
                          currencyVariable: activeHud.purchaseConfig?.currencyVariable || 'player.gold',
                          inventoryVariable: activeHud.purchaseConfig?.inventoryVariable || 'player.potions_owned'
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeHud.type === 'input_text' && (
              <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  <span>Secret Passcode / Cipher Validator</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Correct Secret Code</label>
                    <input
                      type="text"
                      value={activeHud.secretValidation?.correctCode || 'AZURE7'}
                      onChange={e => handleUpdateActiveHud({
                        ...activeHud,
                        secretValidation: {
                          correctCode: e.target.value,
                          successNotification: activeHud.secretValidation?.successNotification || 'Correct code entered!',
                          failureNotification: activeHud.secretValidation?.failureNotification || 'Incorrect code.',
                          successMutations: activeHud.secretValidation?.successMutations || []
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Input Placeholder</label>
                    <input
                      type="text"
                      value={activeHud.inputPlaceholder || 'Type passcode...'}
                      onChange={e => handleUpdateActiveHud({ ...activeHud, inputPlaceholder: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Success Notification Message</label>
                  <input
                    type="text"
                    value={activeHud.secretValidation?.successNotification || 'The barrier opens!'}
                    onChange={e => handleUpdateActiveHud({
                      ...activeHud,
                      secretValidation: {
                        correctCode: activeHud.secretValidation?.correctCode || 'AZURE7',
                        successNotification: e.target.value,
                        failureNotification: activeHud.secretValidation?.failureNotification || 'Incorrect code.',
                        successMutations: activeHud.secretValidation?.successMutations || []
                      }
                    })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-300 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Buttons & Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white">Modal Action Controls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="showCloseX"
                    checked={activeHud.showCloseX}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, showCloseX: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-amber-400 focus:ring-0"
                  />
                  <label htmlFor="showCloseX" className="text-xs text-slate-300 cursor-pointer">
                    Show Close 'X' Button
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Confirm Button Label</label>
                  <input
                    type="text"
                    value={activeHud.confirmButtonText}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, confirmButtonText: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cancel Button Label (Optional)</label>
                  <input
                    type="text"
                    value={activeHud.cancelButtonText || ''}
                    onChange={e => handleUpdateActiveHud({ ...activeHud, cancelButtonText: e.target.value || undefined })}
                    placeholder="e.g. Cancel"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Live HUD Modal Rendering */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Modal Appearance Preview</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Live rendering of the pop-up panel over the scene.
              </p>

              {/* Pop-up Card */}
              <div className="bg-slate-950/95 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header with Title and 'X' */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-white/5">
                  <span className="text-xs font-bold text-white truncate">{activeHud.title}</span>
                  {activeHud.showCloseX && (
                    <span className="text-slate-400 hover:text-white text-base font-bold cursor-pointer">
                      &times;
                    </span>
                  )}
                </div>

                {/* Character Sprite Stage */}
                {activeHud.sprite && (
                  <div className="flex flex-col items-center pt-3 pb-1 bg-gradient-to-b from-white/5 to-transparent">
                    <div
                      className="w-24 h-24 drop-shadow-md"
                      dangerouslySetInnerHTML={{ __html: getSvgForSprite(activeHud.sprite) }}
                    />
                    <div className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded bg-black/40 border border-slate-800 mt-1">
                      {activeHud.speakerName || 'NPC'}
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div className="p-4 text-xs text-slate-200 leading-relaxed">
                  {activeHud.messageText}
                </div>

                {/* Input Simulation */}
                {activeHud.type === 'input_number' && (
                  <div className="px-4 pb-3">
                    <label className="text-[10px] text-slate-400 block mb-1">Enter Quantity (1-10):</label>
                    <input
                      type="number"
                      defaultValue={1}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      readOnly
                    />
                  </div>
                )}

                {activeHud.type === 'input_text' && (
                  <div className="px-4 pb-3">
                    <label className="text-[10px] text-slate-400 block mb-1">Enter Secret Code:</label>
                    <input
                      type="text"
                      placeholder={activeHud.inputPlaceholder || 'Passcode...'}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-amber-300 font-mono"
                      readOnly
                    />
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 bg-black/20 border-t border-slate-800">
                  {activeHud.cancelButtonText && (
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                      {activeHud.cancelButtonText}
                    </div>
                  )}
                  <div className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold">
                    {activeHud.confirmButtonText}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              HUD ID: {activeHud.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
