import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Shield, Swords, Scroll, Package, UserCheck, Sparkles } from 'lucide-react';
import { GameObject, GameObjectCategory, GameVariable, VariableType } from '../types/game';
import { SPRITE_PRESETS, getSvgForSprite } from '../data/sprites';

interface Step2GameObjectsProps {
  gameObjects: GameObject[];
  onChange: (objects: GameObject[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2GameObjects: React.FC<Step2GameObjectsProps> = ({
  gameObjects,
  onChange,
  onNext,
  onPrev,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingObject, setEditingObject] = useState<GameObject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New variable inputs within the editor modal
  const [modalVarKey, setModalVarKey] = useState('');
  const [modalVarType, setModalVarType] = useState<VariableType>('number');
  const [modalVarValue, setModalVarValue] = useState<string>('0');
  const [modalVarDesc, setModalVarDesc] = useState('');

  const categories: { key: string; label: string; icon: any }[] = [
    { key: 'all', label: 'All Entities', icon: Sparkles },
    { key: 'npc', label: 'NPCs', icon: UserCheck },
    { key: 'enemy', label: 'Enemies', icon: Swords },
    { key: 'quest', label: 'Quests', icon: Scroll },
    { key: 'item', label: 'Items & Weapons', icon: Package },
    { key: 'custom', label: 'Custom', icon: Shield },
  ];

  const filteredObjects = selectedCategory === 'all'
    ? gameObjects
    : gameObjects.filter(o => o.category === selectedCategory || (selectedCategory === 'item' && o.category === 'weapon'));

  const handleOpenCreate = () => {
    const newId = `entity_${Date.now()}`;
    setEditingObject({
      id: newId,
      name: 'New Entity',
      category: 'npc',
      sprite: 'npc_eldrin',
      description: 'A key character in your story.',
      variables: [
        { key: 'affinity', type: 'number', value: 10, description: 'Relationship score' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (obj: GameObject) => {
    setEditingObject(JSON.parse(JSON.stringify(obj)));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    onChange(gameObjects.filter(o => o.id !== id));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObject) return;

    const exists = gameObjects.some(o => o.id === editingObject.id);
    let updatedList: GameObject[];
    if (exists) {
      updatedList = gameObjects.map(o => (o.id === editingObject.id ? editingObject : o));
    } else {
      updatedList = [...gameObjects, editingObject];
    }

    onChange(updatedList);
    setIsModalOpen(false);
    setEditingObject(null);
  };

  const handleAddModalVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObject || !modalVarKey.trim()) return;
    const cleanKey = modalVarKey.trim().toLowerCase().replace(/\s+/g, '_');

    let parsedVal: any = modalVarValue;
    if (modalVarType === 'number') parsedVal = Number(modalVarValue) || 0;
    if (modalVarType === 'boolean') parsedVal = modalVarValue === 'true';

    const newVar: GameVariable = {
      key: cleanKey,
      type: modalVarType,
      value: parsedVal,
      description: modalVarDesc.trim() || undefined
    };

    setEditingObject({
      ...editingObject,
      variables: [...editingObject.variables, newVar]
    });

    setModalVarKey('');
    setModalVarValue(modalVarType === 'number' ? '0' : 'false');
    setModalVarDesc('');
  };

  const handleRemoveModalVariable = (index: number) => {
    if (!editingObject) return;
    setEditingObject({
      ...editingObject,
      variables: editingObject.variables.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 2 of 5</span>
            <h1 className="text-2xl font-bold text-white mt-1">Game Objects & Entities</h1>
            <p className="text-sm text-slate-400 mt-1">
              Create NPCs, enemies, quest logs, and items with individual reactive variables. Reference in scripts as <code className="text-amber-300">npcs.object_id.variable</code> or <code className="text-amber-300">items.id.value</code>.
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
              Next: Scenes →
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map(c => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Game Object</span>
        </button>
      </div>

      {/* Entities Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredObjects.map(obj => (
          <div
            key={obj.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: getSvgForSprite(obj.sprite) }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{obj.name}</h3>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wide">
                      {obj.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(obj)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Entity"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(obj.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Entity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {obj.description}
              </p>

              {/* Variables preview */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1">
                  Internal Stats & Variables ({obj.variables.length}):
                </div>
                {obj.variables.length === 0 ? (
                  <div className="text-[11px] text-slate-600 italic">No variables added yet.</div>
                ) : (
                  obj.variables.slice(0, 3).map(v => (
                    <div key={v.key} className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{v.key}:</span>
                      <span className="text-amber-300 font-bold">{String(v.value)}</span>
                    </div>
                  ))
                )}
                {obj.variables.length > 3 && (
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    +{obj.variables.length - 3} more variables
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-[10px]">ID: {obj.id}</span>
              <button
                onClick={() => handleOpenEdit(obj)}
                className="text-amber-400 hover:underline font-semibold"
              >
                Configure →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Object Modal */}
      {isModalOpen && editingObject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {gameObjects.some(o => o.id === editingObject.id) ? 'Edit Game Object' : 'Create New Game Object'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Entity Name</label>
                  <input
                    type="text"
                    value={editingObject.name}
                    onChange={e => setEditingObject({ ...editingObject, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Unique Identifier (ID)</label>
                  <input
                    type="text"
                    value={editingObject.id}
                    onChange={e => setEditingObject({ ...editingObject, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono text-sm focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={editingObject.category}
                    onChange={e => setEditingObject({ ...editingObject, category: e.target.value as GameObjectCategory })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
                  >
                    <option value="npc">NPC (Character)</option>
                    <option value="enemy">Enemy / Monster</option>
                    <option value="quest">Quest Entry</option>
                    <option value="item">Item / Potion</option>
                    <option value="weapon">Weapon / Gear</option>
                    <option value="custom">Custom Entity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sprite Representation</label>
                  <select
                    value={editingObject.sprite}
                    onChange={e => setEditingObject({ ...editingObject, sprite: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
                  >
                    {SPRITE_PRESETS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  value={editingObject.description}
                  onChange={e => setEditingObject({ ...editingObject, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:border-amber-400"
                />
              </div>

              {/* Entity Variables Section */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Entity Internal Stats ({editingObject.variables.length})
                </h3>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {editingObject.variables.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-300 font-bold">{v.key}</span>
                        <span className="text-slate-500">({v.type})</span>
                        <span className="text-slate-200">= {String(v.value)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalVariable(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add variable row */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={modalVarKey}
                    onChange={e => setModalVarKey(e.target.value)}
                    placeholder="Key (e.g. affinity)"
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white flex-1 min-w-[100px]"
                  />
                  <select
                    value={modalVarType}
                    onChange={e => setModalVarType(e.target.value as VariableType)}
                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                  >
                    <option value="number">number</option>
                    <option value="string">string</option>
                    <option value="boolean">boolean</option>
                  </select>
                  <input
                    type="text"
                    value={modalVarValue}
                    onChange={e => setModalVarValue(e.target.value)}
                    placeholder="Initial Val"
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white w-24"
                  />
                  <button
                    type="button"
                    onClick={handleAddModalVariable}
                    className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded text-xs hover:bg-amber-300"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
