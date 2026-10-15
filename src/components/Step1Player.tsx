import React, { useState } from 'react';
import { Plus, Trash2, User, Shield, Coins, Sparkles, Check } from 'lucide-react';
import { PlayerObject, GameVariable, VariableType, GameAsset } from '../types/game';
import { SPRITE_PRESETS, getSvgForSprite } from '../data/sprites';

interface Step1PlayerProps {
  player: PlayerObject;
  onChange: (updated: PlayerObject) => void;
  onNext: () => void;
  assets?: GameAsset[];
  onOpenAssets?: () => void;
}

export const Step1Player: React.FC<Step1PlayerProps> = ({ player, onChange, onNext, assets, onOpenAssets }) => {
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState<VariableType>('number');
  const [newValue, setNewValue] = useState<string>('0');
  const [newDesc, setNewDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const updateField = (field: keyof PlayerObject, val: any) => {
    onChange({ ...player, [field]: val });
  };

  const handleVariableChange = (index: number, key: keyof GameVariable, val: any) => {
    const updatedVars = [...player.variables];
    updatedVars[index] = { ...updatedVars[index], [key]: val };
    onChange({ ...player, variables: updatedVars });
  };

  const handleRemoveVariable = (index: number) => {
    const updatedVars = player.variables.filter((_, i) => i !== index);
    onChange({ ...player, variables: updatedVars });
  };

  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanKey) {
      setErrorMsg('Please enter a variable key');
      return;
    }
    if (player.variables.some(v => v.key === cleanKey)) {
      setErrorMsg(`Variable "${cleanKey}" already exists!`);
      return;
    }

    let parsedVal: any = newValue;
    if (newType === 'number') parsedVal = Number(newValue) || 0;
    if (newType === 'boolean') parsedVal = newValue === 'true';

    const newVar: GameVariable = {
      key: cleanKey,
      type: newType,
      value: parsedVal,
      description: newDesc.trim() || undefined
    };

    onChange({
      ...player,
      variables: [...player.variables, newVar]
    });

    setNewKey('');
    setNewValue(newType === 'number' ? '0' : newType === 'boolean' ? 'false' : '');
    setNewDesc('');
    setErrorMsg('');
  };

  const baseSprites = SPRITE_PRESETS.filter(s => s.category === 'player' || s.category === 'npc');
  // Include custom sprite assets
  const customSpriteAssets = (assets || []).filter(a => a.category === 'sprite');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 1 of 5</span>
            <h1 className="text-2xl font-bold text-white mt-1">Configure Player Object & Stats</h1>
            <p className="text-sm text-slate-400 mt-1">
              Define the protagonist's core attributes and reactive state variables (e.g., <code className="text-amber-300">player.name</code>, <code className="text-amber-300">player.health_points</code>, <code className="text-amber-300">player.gold</code>).
            </p>
          </div>
          <button
            onClick={onNext}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
          >
            Next: Game Objects →
          </button>
        </div>
      </div>

      {/* Hero Identity & Sprite Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>Character Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Player Name</label>
              <input
                type="text"
                value={player.name}
                onChange={e => updateField('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400 focus:outline-none"
                placeholder="e.g. Rowan"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Class / Title</label>
              <input
                type="text"
                value={player.title}
                onChange={e => updateField('title', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400 focus:outline-none"
                placeholder="e.g. Apprentice Alchemist"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-400">Select Character 2D Sprite or Sheet</label>
              {onOpenAssets && (
                <button
                  type="button"
                  onClick={onOpenAssets}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upload / Manage in Media Assets</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {baseSprites.map(sprite => {
                const isSelected = player.sprite === sprite.id;
                return (
                  <button
                    key={sprite.id}
                    type="button"
                    onClick={() => updateField('sprite', sprite.id)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-16 h-16 mb-2 rounded-lg bg-slate-900 p-1 flex items-center justify-center overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: sprite.svg }}
                    />
                    <span className="text-xs font-medium truncate w-full">{sprite.name}</span>
                  </button>
                );
              })}

              {/* Also render any custom uploaded sprite assets */}
              {customSpriteAssets.map(asset => {
                const isSelected = player.sprite === asset.id || player.sprite === asset.id.replace('asset_', '');
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => updateField('sprite', asset.id)}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-16 h-16 mb-2 rounded-lg bg-slate-900 p-1 flex items-center justify-center overflow-hidden">
                      {asset.fileType === 'image/svg+xml' && asset.dataUrl.startsWith('<svg') ? (
                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: asset.dataUrl }} />
                      ) : (
                        <img src={asset.dataUrl} alt={asset.name} className="w-full h-full object-contain" />
                      )}
                    </div>
                    <span className="text-xs font-medium truncate w-full text-amber-300">{asset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Top HUD Bar Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Live Top HUD Preview</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              This preview reflects how the mobile app's top status bar will render using these variables.
            </p>

            {/* Mobile Header Mockup */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-inner space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 p-0.5 overflow-hidden shrink-0"
                  dangerouslySetInnerHTML={{ __html: getSvgForSprite(player.sprite) }}
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{player.name || 'Protagonist'}</div>
                  <div className="text-[10px] text-amber-400 truncate">{player.title || 'Novice'}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-900">
                {player.variables.slice(0, 4).map(v => (
                  <span
                    key={v.key}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    <span className="text-slate-500 font-semibold">{v.key.slice(0, 4)}:</span>
                    <span className="text-amber-300 font-bold">{String(v.value)}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
            Total active variables: <span className="text-slate-300 font-mono">{player.variables.length}</span>
          </div>
        </div>
      </div>

      {/* Reactive Player Variables Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Player Variables List</h2>
            <p className="text-xs text-slate-400">
              Reference these in scenes and HUDs with syntax like <code className="text-amber-400">{`{player.variable_key}`}</code>
            </p>
          </div>
        </div>

        {/* Variables List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Variable Key</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Initial Value</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {player.variables.map((variable, idx) => (
                <tr key={variable.key} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono font-semibold text-amber-300">
                    player.{variable.key}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {variable.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {variable.type === 'boolean' ? (
                      <select
                        value={String(variable.value)}
                        onChange={e => handleVariableChange(idx, 'value', e.target.value === 'true')}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : (
                      <input
                        type={variable.type === 'number' ? 'number' : 'text'}
                        value={String(variable.value)}
                        onChange={e => {
                          const val = variable.type === 'number' ? Number(e.target.value) : e.target.value;
                          handleVariableChange(idx, 'value', val);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs w-32 focus:border-amber-400"
                      />
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                    {variable.description || '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                      title="Delete variable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Variable Form */}
        <form onSubmit={handleAddVariable} className="pt-4 border-t border-slate-800 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">New Key</label>
            <input
              type="text"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="e.g. reputation"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-amber-400"
            />
          </div>

          <div className="w-28">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
            <select
              value={newType}
              onChange={e => {
                const t = e.target.value as VariableType;
                setNewType(t);
                setNewValue(t === 'number' ? '0' : t === 'boolean' ? 'false' : '');
              }}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
            >
              <option value="number">number</option>
              <option value="string">string</option>
              <option value="boolean">boolean</option>
            </select>
          </div>

          <div className="w-32">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Initial Value</label>
            {newType === 'boolean' ? (
              <select
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
              >
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
            ) : (
              <input
                type={newType === 'number' ? 'number' : 'text'}
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="Value"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
              />
            )}
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="e.g. Village alignment score"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Variable</span>
          </button>
        </form>

        {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
};
