import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Smartphone, Play, Check, AlertCircle, Info } from 'lucide-react';
import { GameProject, HudOverlay } from '../types/game';
import { getSvgForSprite, BACKGROUND_PRESETS } from '../data/sprites';

interface SimulatorModalProps {
  project: GameProject;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({ project, isOpen, onClose }) => {
  // Runtime game state inside simulator
  const [currentSceneId, setCurrentSceneId] = useState<string>(project.scenes[0]?.id || '');
  const [activeHudId, setActiveHudId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<Record<string, any>>({});
  const [gameObjectState, setGameObjectState] = useState<Record<string, Record<string, any>>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // HUD Interactive Input state
  const [inputValue, setInputValue] = useState<string>('');
  const [hudAlert, setHudAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize/Reset State whenever project changes or modal opens
  const initializeState = () => {
    setCurrentSceneId(project.scenes[0]?.id || '');
    setActiveHudId(null);
    setToastMessage(null);
    setHudAlert(null);
    setInputValue('');

    const initialPlayer: Record<string, any> = {
      name: project.player.name,
      title: project.player.title,
    };
    project.player.variables.forEach(v => {
      initialPlayer[v.key] = v.value;
    });
    setPlayerState(initialPlayer);

    const initialObjects: Record<string, Record<string, any>> = {};
    project.gameObjects.forEach(obj => {
      initialObjects[obj.id] = {};
      obj.variables.forEach(v => {
        initialObjects[obj.id][v.key] = v.value;
      });
    });
    setGameObjectState(initialObjects);
  };

  useEffect(() => {
    if (isOpen) {
      initializeState();
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  // Sound Synthesizer via Web Audio
  const playSound = (type: 'click' | 'success') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'success') {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.12, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  // Interpolate strings like {player.gold} or {npcs.npc_master_eldrin.affinity}
  const interpolate = (text?: string): string => {
    if (!text) return '';
    return text.replace(/\{([a-zA-Z0-9_.]+)\}/g, (match, path) => {
      const parts = path.split('.');
      if (parts[0] === 'player' && parts[1]) {
        return playerState[parts[1]] !== undefined ? String(playerState[parts[1]]) : match;
      }
      if (parts[0] === 'npcs' || parts[0] === 'enemies' || parts[0] === 'quests' || parts[0] === 'items') {
        const id = parts[1];
        const key = parts[2];
        if (gameObjectState[id] && gameObjectState[id][key] !== undefined) {
          return String(gameObjectState[id][key]);
        }
      }
      return match;
    });
  };

  // Variable Mutation
  const applyMutation = (targetPath: string, operation: string, val: any) => {
    const parts = targetPath.split('.');
    if (parts[0] === 'player' && parts[1]) {
      const key = parts[1];
      setPlayerState(prev => {
        const curr = prev[key];
        let next = curr;
        if (operation === 'set') next = val;
        else if (operation === 'add') next = Number(curr || 0) + Number(val);
        else if (operation === 'subtract') next = Math.max(0, Number(curr || 0) - Number(val));
        return { ...prev, [key]: next };
      });
    } else if (parts[1] && parts[2]) {
      const id = parts[1];
      const key = parts[2];
      setGameObjectState(prev => {
        const entity = prev[id] || {};
        const curr = entity[key];
        let next = curr;
        if (operation === 'set') next = val;
        else if (operation === 'add') next = Number(curr || 0) + Number(val);
        return {
          ...prev,
          [id]: { ...entity, [key]: next }
        };
      });
    }
  };

  // Find Active Scene & Active HUD
  const activeScene = project.scenes.find(s => s.id === currentSceneId) || project.scenes[0];
  const activeHud = project.hudOverlays.find(h => h.id === activeHudId);

  // Button Click Handler inside Simulator
  const handleSceneButtonClick = (btn: any) => {
    playSound('click');

    // Apply button mutations if any
    if (btn.mutations && btn.mutations.length > 0) {
      btn.mutations.forEach((m: any) => applyMutation(m.target, m.operation, m.value));
    }

    if (btn.actionType === 'open_hud' && btn.targetHudId) {
      setActiveHudId(btn.targetHudId);
      setInputValue('');
      setHudAlert(null);
    } else if (btn.actionType === 'change_scene' && btn.targetSceneId) {
      setCurrentSceneId(btn.targetSceneId);
    }
  };

  // HUD Submit Handler inside Simulator
  const handleHudSubmit = () => {
    if (!activeHud) return;
    playSound('click');

    // 1. Text Passcode Verification
    if (activeHud.type === 'input_text' && activeHud.secretValidation) {
      const typed = inputValue.trim().toUpperCase();
      const expected = activeHud.secretValidation.correctCode.trim().toUpperCase();

      if (typed === expected) {
        playSound('success');
        activeHud.secretValidation.successMutations.forEach(m => applyMutation(m.target, m.operation, m.value));
        setHudAlert({ type: 'success', msg: activeHud.secretValidation.successNotification });
        setTimeout(() => {
          setActiveHudId(null);
          setHudAlert(null);
        }, 1600);
      } else {
        setHudAlert({ type: 'error', msg: activeHud.secretValidation.failureNotification });
      }
      return;
    }

    // 2. Numeric Item Purchase Calculation
    if (activeHud.type === 'input_number' && activeHud.purchaseConfig) {
      const qty = parseInt(inputValue, 10);
      if (isNaN(qty) || qty <= 0) {
        setHudAlert({ type: 'error', msg: 'Please enter a valid quantity of at least 1 bottle.' });
        return;
      }
      const totalCost = qty * activeHud.purchaseConfig.unitPrice;
      const currentGold = Number(playerState.gold || 0);

      if (currentGold < totalCost) {
        setHudAlert({
          type: 'error',
          msg: `Not enough gold! Total cost is ${totalCost} Gold, but you only possess ${currentGold} Gold.`
        });
        return;
      }

      // Deduct gold and add potions
      setPlayerState(prev => ({
        ...prev,
        gold: currentGold - totalCost,
        potions_owned: Number(prev.potions_owned || 0) + qty
      }));

      playSound('success');
      showToast(`Bought ${qty}x ${activeHud.purchaseConfig.itemName} for ${totalCost} Gold!`);
      setActiveHudId(null);
      return;
    }

    // 3. Regular Mutations
    if (activeHud.submitMutations && activeHud.submitMutations.length > 0) {
      activeHud.submitMutations.forEach(m => applyMutation(m.target, m.operation, m.value));
    }

    if (activeHud.notificationOnSubmit) {
      showToast(activeHud.notificationOnSubmit);
    }

    setActiveHudId(null);
  };

  const bgStyle = BACKGROUND_PRESETS.find(b => b.id === activeScene?.backgroundTheme)?.cssBackground || '#0f172a';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Simulator Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Interactive Mobile Game Simulator</h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · Testing "{project.name}" (Capacitor Ready)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={initializeState}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Reset state to starting values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors text-lg font-bold leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Simulator Body: Left Phone Canvas + Right Live State Inspector */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950/40">
          {/* Left Canvas: Mobile Screen Mockup */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Phone Bezel */}
            <div className="w-full max-w-[380px] h-[640px] bg-slate-950 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
              {/* Phone Camera Notch */}
              <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-1 shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
              </div>

              {/* Game Viewport Container */}
              <div
                className="flex-1 rounded-[26px] overflow-hidden flex flex-col relative"
                style={{ background: bgStyle }}
              >
                {/* 1. Top Player HUD Bar */}
                <header className="bg-slate-950/85 backdrop-blur-md border-b border-white/10 px-3 py-2 flex items-center justify-between z-20 shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 p-0.5 overflow-hidden shrink-0"
                      dangerouslySetInnerHTML={{ __html: getSvgForSprite(project.player.sprite, project.assets) }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{playerState.name}</div>
                      <div className="text-[10px] text-amber-400 leading-tight">{playerState.title}</div>
                    </div>
                  </div>

                  {/* Top Stats */}
                  <div className="flex items-center gap-1.5">
                    {playerState.health_points !== undefined && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                        HP {playerState.health_points}
                      </span>
                    )}
                    {playerState.gold !== undefined && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold">
                        🪙 {playerState.gold}
                      </span>
                    )}
                  </div>
                </header>

                {/* 2. Scene Narrative & Text Panels */}
                <main className="flex-1 p-3.5 overflow-y-auto space-y-3 z-10">
                  <div className="text-sm font-bold text-white drop-shadow-md flex items-center justify-between">
                    <span>{activeScene?.name}</span>
                    {playerState.cavern_unlocked && (
                      <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                        Gate Open 🔓
                      </span>
                    )}
                  </div>

                  {activeScene?.textPanels.map((panel, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg"
                    >
                      {panel.speaker && (
                        <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">
                          {panel.speaker}
                        </div>
                      )}
                      <div className="text-xs text-slate-200 leading-relaxed">
                        {interpolate(panel.content)}
                      </div>
                    </div>
                  ))}
                </main>

                {/* 3. Scene Bottom Action Buttons */}
                <nav className="p-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-2 z-10 shrink-0">
                  {activeScene?.buttons.map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => handleSceneButtonClick(btn)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-white text-xs font-semibold flex items-center justify-between transition-all active:scale-[0.98]"
                    >
                      <span>{btn.label}</span>
                      <span className="text-amber-400 text-xs">→</span>
                    </button>
                  ))}
                </nav>

                {/* 4. HUD Overlay Modal (Popped up when active) */}
                {activeHud && (
                  <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in">
                    <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-white/5">
                        <span className="text-xs font-bold text-white truncate">{activeHud.title}</span>
                        {activeHud.showCloseX && (
                          <button
                            onClick={() => {
                              playSound('click');
                              setActiveHudId(null);
                            }}
                            className="text-slate-400 hover:text-white text-lg font-bold leading-none p-1"
                          >
                            &times;
                          </button>
                        )}
                      </div>

                      {/* Character Sprite Stage (Visual Novel Presentation) */}
                      {activeHud.sprite && (
                        <div className="flex flex-col items-center pt-3 pb-1 bg-gradient-to-b from-white/5 to-transparent">
                          <div
                            className="w-20 h-20 drop-shadow-md flex items-center justify-center overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: getSvgForSprite(activeHud.sprite, project.assets) }}
                          />
                          <div className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-black/50 border border-slate-800 mt-1">
                            {activeHud.speakerName || 'NPC'}
                          </div>
                        </div>
                      )}

                      {/* Modal Message */}
                      <div className="p-3 text-xs text-slate-200 leading-relaxed">
                        {interpolate(activeHud.messageText)}
                      </div>

                      {/* Input Section (if type is input) */}
                      {activeHud.type === 'input_number' && (
                        <div className="px-3 pb-2 space-y-1">
                          <label className="text-[10px] text-slate-400 font-semibold block">
                            {activeHud.inputLabel || 'Quantity to Purchase:'}
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Enter quantity (e.g. 2)"
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-amber-400"
                          />
                          {activeHud.purchaseConfig && (
                            <div className="text-[10px] text-amber-400">
                              Unit Price: {activeHud.purchaseConfig.unitPrice} Gold · You have {playerState.gold} Gold
                            </div>
                          )}
                        </div>
                      )}

                      {activeHud.type === 'input_text' && (
                        <div className="px-3 pb-2 space-y-1">
                          <label className="text-[10px] text-slate-400 font-semibold block">
                            {activeHud.inputLabel || 'Enter Passcode:'}
                          </label>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder={activeHud.inputPlaceholder || 'Cipher here...'}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-amber-300 font-mono uppercase focus:border-amber-400"
                          />
                        </div>
                      )}

                      {/* Alert Result */}
                      {hudAlert && (
                        <div
                          className={`mx-3 mb-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${
                            hudAlert.type === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {hudAlert.msg}
                        </div>
                      )}

                      {/* Modal Footer Controls */}
                      <div className="flex items-center justify-end gap-2 px-3 py-2.5 bg-black/30 border-t border-slate-800">
                        {activeHud.cancelButtonText && (
                          <button
                            onClick={() => {
                              playSound('click');
                              setActiveHudId(null);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                          >
                            {activeHud.cancelButtonText}
                          </button>
                        )}
                        <button
                          onClick={handleHudSubmit}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
                        >
                          {activeHud.confirmButtonText}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toast Notification */}
                {toastMessage && (
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-amber-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xl text-center max-w-[90%]">
                    {toastMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Reactive Variables & Entity Inspector */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Live State Inspector</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Watch reactive player variables update instantly as you interact with buttons and HUDs.
              </p>

              {/* Player Variables Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Player Variables:</span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {Object.entries(playerState).map(([k, val]) => (
                    <div key={k} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 truncate pr-2">{k}:</span>
                      <span className="text-amber-300 font-bold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Objects Variables */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Game Entities State:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(gameObjectState).map(([id, vars]) => (
                  <div key={id} className="border-t border-slate-900 pt-1.5 first:border-0 first:pt-0">
                    <div className="text-[11px] font-semibold text-emerald-400">{id}</div>
                    {Object.entries(vars).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-[11px] font-mono pl-2">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-300">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
              Active Scene: <code className="text-amber-300">{currentSceneId}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
