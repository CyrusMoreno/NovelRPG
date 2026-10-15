import React, { useState, useRef } from 'react';
import {
  Upload,
  Play,
  Pause,
  Image as ImageIcon,
  Volume2,
  Trash2,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Layers,
  FileCode,
  Music,
  Plus,
  ArrowUpRight,
  X
} from 'lucide-react';
import { GameAsset, AssetCategory, GameProject } from '../types/game';

interface AssetSidebarProps {
  project: GameProject;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAssets: (assets: GameAsset[]) => void;
  onAssignPlayerSprite?: (spriteId: string) => void;
  onAssignSceneBackground?: (sceneId: string, bgId: string) => void;
}

export const AssetSidebar: React.FC<AssetSidebarProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateAssets,
  onAssignPlayerSprite,
  onAssignSceneBackground,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<AssetCategory>('sprite');
  const [dragOver, setDragOver] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // Audio Playback
  const handleTogglePlayAudio = (asset: GameAsset) => {
    if (playingAudioId === asset.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setPlayingAudioId(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    try {
      const audio = new Audio(asset.dataUrl);
      audio.onended = () => {
        setPlayingAudioId(null);
      };
      audio.onerror = () => {
        setPlayingAudioId(null);
      };
      audio.play().then(() => {
        setPlayingAudioId(asset.id);
        currentAudioRef.current = audio;
      }).catch(() => {
        setPlayingAudioId(null);
      });
    } catch (e) {
      setPlayingAudioId(null);
    }
  };

  // Upload handler
  const handleFileProcess = (file: File, forcedCategory?: AssetCategory) => {
    const isAudio = file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg');
    const isImage = file.type.startsWith('image/') || file.name.endsWith('.svg') || file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.webp');

    if (!isAudio && !isImage) {
      alert('Unsupported file format. Please upload PNG, JPG, SVG, WebP images or MP3, WAV, OGG audio.');
      return;
    }

    const detectedCategory: AssetCategory = forcedCategory || (isAudio ? 'audio' : uploadCategory);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const sizeKb = Math.round(file.size / 1024);
      const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');

      const newAsset: GameAsset = {
        id: `custom_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: detectedCategory,
        fileType: file.type || (isSvg ? 'image/svg+xml' : isAudio ? 'audio/wav' : 'image/png'),
        dataUrl: result,
        filename: file.name,
        isCustom: true,
        sizeLabel: `${file.name.split('.').pop()?.toUpperCase()} · ${sizeKb} KB`,
        description: `Custom uploaded ${detectedCategory}`
      };

      onUpdateAssets([newAsset, ...project.assets]);
      showToast(`Added "${newAsset.name}" to game assets!`);
    };

    if (file.type === 'image/svg+xml' && file.name.endsWith('.svg')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(f => handleFileProcess(f));
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    if (playingAudioId === assetId && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setPlayingAudioId(null);
    }
    onUpdateAssets(project.assets.filter(a => a.id !== assetId));
  };

  const filteredAssets = project.assets.filter(asset => {
    const matchesCat = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const spriteCount = project.assets.filter(a => a.category === 'sprite').length;
  const bgCount = project.assets.filter(a => a.category === 'background').length;
  const audioCount = project.assets.filter(a => a.category === 'audio').length;

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Project Game Assets"
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 md:w-[420px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl animate-fade-in"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Game Assets & Media</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {project.assets.length} Files
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Bundled into exported Capacitor project</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40 shrink-0 space-y-2.5">
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({project.assets.length})
          </button>
          <button
            onClick={() => setSelectedCategory('sprite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'sprite'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Sprites ({spriteCount})
          </button>
          <button
            onClick={() => setSelectedCategory('background')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'background'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Backgrounds ({bgCount})
          </button>
          <button
            onClick={() => setSelectedCategory('audio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'audio'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Sound FX ({audioCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div className="p-3 border-b border-slate-800 shrink-0">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.svg,.webp,.mp3,.wav,.ogg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                Array.from(e.target.files).forEach(f => handleFileProcess(f));
              }
            }}
          />
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
            <Upload className="w-4 h-4" />
            <span className="text-xs font-bold">Upload Custom File</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Drag & drop sprite sheets, backdrops, or sound files
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-500">
            <span>Target category:</span>
            <select
              value={uploadCategory}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setUploadCategory(e.target.value as AssetCategory)}
              className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 font-semibold"
            >
              <option value="sprite">Sprite / Sheet</option>
              <option value="background">Background Image</option>
              <option value="audio">Sound Effect</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No assets match your search or filter.
          </div>
        ) : (
          filteredAssets.map(asset => {
            const isAudio = asset.category === 'audio';
            const isPlaying = playingAudioId === asset.id;

            return (
              <div
                key={asset.id}
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Visual Preview / Audio icon */}
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {isAudio ? (
                        <button
                          type="button"
                          onClick={() => handleTogglePlayAudio(asset)}
                          className={`w-full h-full rounded flex items-center justify-center transition-colors ${
                            isPlaying
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                          title={isPlaying ? 'Pause' : 'Play Audio'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                      ) : asset.fileType === 'image/svg+xml' && asset.dataUrl.startsWith('<svg') ? (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: asset.dataUrl }}
                        />
                      ) : (
                        <img
                          src={asset.dataUrl}
                          alt={asset.name}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    {/* Metadata text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{asset.name}</span>
                        {asset.isCustom && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <span>{asset.sizeLabel || asset.filename}</span>
                      </div>
                      {asset.description && (
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isAudio && (
                      <button
                        onClick={() => handleTogglePlayAudio(asset)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          isPlaying
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isPlaying ? 'Pause' : 'Preview Audio'}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
                      title="Remove asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Assignment Menu */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-900 text-[11px]">
                  {asset.category === 'sprite' && onAssignPlayerSprite && (
                    <button
                      onClick={() => {
                        onAssignPlayerSprite(asset.id.replace('asset_', ''));
                        showToast(`Set as Player Sprite!`);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Set as Player Sprite</span>
                    </button>
                  )}

                  {asset.category === 'background' && onAssignSceneBackground && project.scenes[0] && (
                    <button
                      onClick={() => {
                        onAssignSceneBackground(project.scenes[0].id, asset.id.replace('asset_bg_', ''));
                        showToast(`Set as Background for ${project.scenes[0].name}!`);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Set as Scene 1 BG</span>
                    </button>
                  )}

                  {isAudio && (
                    <span className="text-[10px] text-slate-500 italic">
                      Linked to native sound synthesizer in Capacitor runtime
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Export Packaging Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>All {project.assets.length} assets included in ZIP</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">www/assets/</span>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 bg-slate-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xl">
          {successToast}
        </div>
      )}
    </aside>
  );
};
