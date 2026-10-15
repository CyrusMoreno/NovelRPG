import JSZip from 'jszip';
import { GameProject } from '../types/game';
import { getSvgForSprite, BACKGROUND_PRESETS } from '../data/sprites';

export interface GeneratedCodePackage {
  indexHtml: string;
  styleCss: string;
  mainJs: string;
  capacitorConfig: string;
  packageJson: string;
  readmeMd: string;
}

export function generateCapacitorBoilerplate(project: GameProject): GeneratedCodePackage {
  const indexHtml = generateIndexHtml(project);
  const styleCss = generateStyleCss(project);
  const mainJs = generateMainJs(project);
  const capacitorConfig = generateCapacitorConfig(project);
  const packageJson = generatePackageJson(project);
  const readmeMd = generateReadme(project);

  return {
    indexHtml,
    styleCss,
    mainJs,
    capacitorConfig,
    packageJson,
    readmeMd,
  };
}

export async function createProjectZipBlob(project: GameProject): Promise<Blob> {
  const code = generateCapacitorBoilerplate(project);
  const zip = new JSZip();

  // Root files
  zip.file('capacitor.config.json', code.capacitorConfig);
  zip.file('package.json', code.packageJson);
  zip.file('README.md', code.readmeMd);
  zip.file('.gitignore', 'node_modules/\ndist/\nandroid/\nios/\n.DS_Store\n');

  // www directory
  const wwwFolder = zip.folder('www');
  if (wwwFolder) {
    wwwFolder.file('index.html', code.indexHtml);
    wwwFolder.file('style.css', code.styleCss);
    wwwFolder.file('main.js', code.mainJs);

    // Bundle all uploaded and preset game assets into www/assets/
    const assetsFolder = wwwFolder.folder('assets');
    if (assetsFolder && project.assets) {
      const spritesFolder = assetsFolder.folder('sprites');
      const backgroundsFolder = assetsFolder.folder('backgrounds');
      const audioFolder = assetsFolder.folder('audio');

      project.assets.forEach(asset => {
        let targetFolder = spritesFolder;
        if (asset.category === 'background') targetFolder = backgroundsFolder;
        if (asset.category === 'audio') targetFolder = audioFolder;

        if (!targetFolder) return;

        const filename = asset.filename || `${asset.id}.dat`;
        if (asset.dataUrl.startsWith('data:')) {
          const commaIdx = asset.dataUrl.indexOf(',');
          if (commaIdx !== -1) {
            const base64Data = asset.dataUrl.slice(commaIdx + 1);
            targetFolder.file(filename, base64Data, { base64: true });
          }
        } else {
          targetFolder.file(filename, asset.dataUrl);
        }
      });
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

function generateIndexHtml(project: GameProject): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(project.name)}</title>
  <meta name="description" content="A 2D sprite light novel and semi-text game powered by Capacitor.">
  <link rel="stylesheet" href="style.css">
  <!-- Capacitor Core Bridge Script (automatically injected in native app runtime) -->
  <script src="capacitor.js" onerror="console.info('Running in web browser mode')"></script>
</head>
<body>
  <div id="game-app">
    <!-- Top HUD Status Bar: Player Variables & Stats -->
    <header id="top-hud-bar">
      <div class="player-profile">
        <div class="player-avatar-small" id="hud-player-avatar">
          <!-- Rendered Player Avatar -->
        </div>
        <div class="player-meta">
          <span class="player-name" id="hud-player-name">${escapeHtml(project.player.name)}</span>
          <span class="player-title" id="hud-player-title">${escapeHtml(project.player.title)}</span>
        </div>
      </div>
      
      <!-- Key Dynamic Player Stat Counters -->
      <div class="stat-pills-row" id="hud-stat-strip">
        <!-- Injected via JavaScript based on Step 1 variables -->
      </div>
    </header>

    <!-- Main Game Scene Stage -->
    <main id="scene-container">
      <div id="scene-backdrop"></div>
      
      <!-- Scene Story Content & Text Panels -->
      <section id="scene-content">
        <h1 id="scene-heading">Loading Scene...</h1>
        <div id="scene-text-panels">
          <!-- Text panels injected dynamically -->
        </div>
      </section>

      <!-- Bottom Interactive Scene Action Buttons -->
      <nav id="scene-action-buttons">
        <!-- Action buttons generated dynamically based on active Scene -->
      </nav>
    </main>

    <!-- Modal / HUD Overlay Backdrop -->
    <div id="hud-overlay-scrim" class="hidden" role="dialog" aria-modal="true">
      <div id="hud-overlay-card">
        <!-- Header with Title and Close 'X' Button -->
        <div class="hud-header">
          <h2 id="hud-title">HUD Modal</h2>
          <button id="hud-close-x" class="hud-close-btn" aria-label="Close">&times;</button>
        </div>

        <!-- Visual Novel Character Sprite Presentation Area -->
        <div id="hud-sprite-stage" class="hidden">
          <div id="hud-character-sprite"></div>
          <div class="speaker-tag" id="hud-speaker-tag">NPC Name</div>
        </div>

        <!-- HUD Body & Dialogue Message -->
        <div id="hud-body-content">
          <p id="hud-message-text"></p>
        </div>

        <!-- Interactive Input Section (Number of items, secret code, etc.) -->
        <div id="hud-input-container" class="hidden">
          <label id="hud-input-label" for="hud-interactive-input">Input</label>
          <input type="text" id="hud-interactive-input" autocomplete="off" />
          <div id="hud-input-hint" class="input-hint"></div>
        </div>

        <!-- HUD Notification Banner / Alert Result -->
        <div id="hud-alert-banner" class="hidden"></div>

        <!-- Bottom Action Confirmation Controls -->
        <div class="hud-footer-controls">
          <button id="hud-cancel-btn" class="btn btn-secondary">Cancel</button>
          <button id="hud-confirm-btn" class="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Quick In-Game Toast Notification -->
    <div id="game-toast" class="toast-hidden"></div>
  </div>

  <script src="main.js"></script>
</body>
</html>`;
}

function generateStyleCss(project: GameProject): string {
  const isCyber = project.themeStyle === 'cyberpunk';
  const primaryAccent = isCyber ? '#06b6d4' : '#f59e0b';
  const bgDark = isCyber ? '#09090b' : '#0f172a';
  const cardBg = isCyber ? '#18181b' : '#1e293b';

  return `/* =========================================================================
 * NovelCap Game Engine Stylesheet
 * Optimized for Mobile Web & Capacitor (iOS / Android)
 * Theme: ${project.themeStyle}
 * ========================================================================= */

:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --bg-app: ${bgDark};
  --bg-card: ${cardBg};
  --bg-card-glass: rgba(${isCyber ? '24, 24, 27' : '30, 41, 59'}, 0.95);
  --border-color: rgba(255, 255, 255, 0.12);
  --primary-accent: ${primaryAccent};
  --primary-accent-hover: ${isCyber ? '#0891b2' : '#d97706'};
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-app);
  color: var(--text-main);
  font-family: var(--font-family);
  font-size: 15px;
  line-height: 1.5;
}

#game-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--bg-app);
}

/* -------------------------------------------------------------
 * Top Status Bar HUD (Player stats & variables)
 * ------------------------------------------------------------- */
#top-hud-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--safe-top) + 10px) 16px 10px;
  background-color: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
  z-index: 10;
}

.player-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-avatar-small svg {
  width: 100%;
  height: 100%;
}

.player-meta {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
}

.player-title {
  font-size: 11px;
  color: var(--primary-accent);
}

.stat-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-variant-numeric: tabular-nums;
}

.stat-pill-label {
  color: var(--text-muted);
  font-size: 10px;
  text-transform: uppercase;
}

/* -------------------------------------------------------------
 * Scene Container & Visual Novel Layout
 * ------------------------------------------------------------- */
#scene-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

#scene-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
  transition: all 0.4s ease;
}

#scene-content {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

#scene-heading {
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
  color: #ffffff;
}

.text-panel-card {
  background: var(--bg-card-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.text-panel-speaker {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-accent);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.text-panel-body {
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
}

/* -------------------------------------------------------------
 * Scene Action Buttons
 * ------------------------------------------------------------- */
#scene-action-buttons {
  position: relative;
  z-index: 3;
  padding: 12px 16px calc(var(--safe-bottom) + 16px);
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.95) 40%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scene-btn {
  width: 100%;
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: #1e293b;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.scene-btn:hover, .scene-btn:active {
  background: #334155;
  border-color: var(--primary-accent);
  transform: translateY(-1px);
}

.scene-btn::after {
  content: '→';
  color: var(--primary-accent);
  font-weight: 700;
}

/* -------------------------------------------------------------
 * Step 4: HUD Overlay (Modals, Dialogs, Inputs, Notifications)
 * ------------------------------------------------------------- */
#hud-overlay-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

#hud-overlay-card {
  width: 100%;
  max-width: 480px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: hudPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes hudPopIn {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.hud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.03);
}

#hud-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.hud-close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
  border-radius: 4px;
}

.hud-close-btn:hover {
  color: #ffffff;
}

/* Character Sprite in HUD view (Visual Novel simulator) */
#hud-sprite-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 16px 4px;
  background: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 70%);
}

#hud-character-sprite {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));
}

#hud-character-sprite svg {
  width: 100%;
  height: 100%;
}

.speaker-tag {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-accent);
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

#hud-body-content {
  padding: 16px 18px;
}

#hud-message-text {
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
}

#hud-input-container {
  padding: 0 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#hud-input-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

#hud-interactive-input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

#hud-interactive-input:focus {
  border-color: var(--primary-accent);
}

.input-hint {
  font-size: 11px;
  color: var(--text-muted);
}

#hud-alert-banner {
  margin: 0 18px 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
}

#hud-alert-banner.error {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

.hud-footer-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.15);
}

.btn {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--primary-accent);
  color: #000000;
}

.btn-primary:hover {
  background: var(--primary-accent-hover);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

/* -------------------------------------------------------------
 * Toast Notification Banner
 * ------------------------------------------------------------- */
#game-toast {
  position: fixed;
  bottom: calc(var(--safe-bottom) + 24px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid var(--primary-accent);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  z-index: 1000;
  transition: all 0.3s ease;
  pointer-events: none;
}

.toast-hidden {
  opacity: 0;
  transform: translate(-50%, 20px) !important;
}

.hidden {
  display: none !important;
}
`;
}

function generateMainJs(project: GameProject): string {
  // Serialize project data
  const rawProjectJson = JSON.stringify(project, null, 2);

  // Generate explicit documented wiring comments as requested by user!
  const wiringDocs = project.wiringRules.map(rule => {
    const scene = project.scenes.find(s => s.id === rule.sceneId);
    const button = scene?.buttons.find(b => b.id === rule.buttonId);
    const hud = project.hudOverlays.find(h => h.id === rule.hudId);
    return `/* =========================================================================
 * Wiring Rule: HUD [${hud?.name || rule.hudId}] that comes up when button [${button?.label || rule.buttonId}] of Scene [${scene?.name || rule.sceneId}] is pressed
 * Trigger Action: Button ID "${rule.buttonId}" -> Opens HUD Overlay ID "${rule.hudId}"
 * ========================================================================= */`;
  }).join('\n\n');

  return `/**
 * ============================================================================
 * NovelCap Game Runtime & Controller
 * Project: ${project.name} (App ID: ${project.appId})
 * Single-file standalone architecture for Capacitor
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Initial Static Project Blueprint
  const GAME_BLUEPRINT = ${rawProjectJson};

  // 2. Reactive Game State Store
  const GameState = {
    currentSceneId: '${project.scenes[0]?.id || ""}',
    activeHudId: null,
    player: {
      name: '${escapeJs(project.player.name)}',
      title: '${escapeJs(project.player.title)}',
      sprite: '${project.player.sprite}',
      // Flattened dictionary of player variables (Step 1)
      ${project.player.variables.map(v => `${JSON.stringify(v.key)}: ${JSON.stringify(v.value)}`).join(',\n      ')}
    },
    // Game Objects Registry (Step 2: NPCs, Enemies, Quests, Items)
    gameObjects: {},
    scenes: GAME_BLUEPRINT.scenes,
    hudOverlays: GAME_BLUEPRINT.hudOverlays,
    wiringRules: GAME_BLUEPRINT.wiringRules
  };

  // Populate Game Objects dictionary
  GAME_BLUEPRINT.gameObjects.forEach(obj => {
    GameState.gameObjects[obj.id] = {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      sprite: obj.sprite,
      description: obj.description,
      variables: {}
    };
    obj.variables.forEach(v => {
      GameState.gameObjects[obj.id].variables[v.key] = v.value;
    });
  });

  // Sound Synthesizer (Zero-dependency Web Audio API)
  const SoundFX = {
    audioCtx: null,
    init() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    playClick() {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    },
    playSuccess() {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    }
  };

  // String Template Variable Interpolation (e.g. "{player.health_points}")
  function interpolateTemplate(templateStr) {
    if (!templateStr) return '';
    return templateStr.replace(/\\{([a-zA-Z0-9_.]+)\\}/g, (match, path) => {
      const parts = path.split('.');
      if (parts[0] === 'player' && parts[1]) {
        return GameState.player[parts[1]] !== undefined ? GameState.player[parts[1]] : match;
      }
      if (parts[0] === 'npcs' || parts[0] === 'enemies' || parts[0] === 'quests' || parts[0] === 'items') {
        const objId = parts[1];
        const varKey = parts[2];
        if (GameState.gameObjects[objId] && GameState.gameObjects[objId].variables[varKey] !== undefined) {
          return GameState.gameObjects[objId].variables[varKey];
        }
      }
      return match;
    });
  }

  // Variable Mutation Engine (Step 5 Wiring helper)
  function applyMutation(targetPath, operation, val) {
    const parts = targetPath.split('.');
    let targetObj = null;
    let field = '';

    if (parts[0] === 'player') {
      targetObj = GameState.player;
      field = parts[1];
    } else {
      const entityId = parts[1];
      field = parts[2];
      if (GameState.gameObjects[entityId]) {
        targetObj = GameState.gameObjects[entityId].variables;
      }
    }

    if (!targetObj || field === undefined) return;

    const curr = targetObj[field];
    if (operation === 'set') {
      targetObj[field] = val;
    } else if (operation === 'add') {
      targetObj[field] = Number(curr || 0) + Number(val);
    } else if (operation === 'subtract') {
      targetObj[field] = Math.max(0, Number(curr || 0) - Number(val));
    } else if (operation === 'multiply') {
      targetObj[field] = Number(curr || 0) * Number(val);
    }
  }

  // Capacitor Native Haptic Feedback Wrapper
  function triggerHaptic() {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
      window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' }).catch(() => {});
    }
  }

  // UI Toast Controller
  function showToast(message) {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('toast-hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('toast-hidden');
    }, 2800);
  }

  // DOM Elements
  const DOM = {
    hudPlayerAvatar: document.getElementById('hud-player-avatar'),
    hudPlayerName: document.getElementById('hud-player-name'),
    hudPlayerTitle: document.getElementById('hud-player-title'),
    hudStatStrip: document.getElementById('hud-stat-strip'),
    sceneHeading: document.getElementById('scene-heading'),
    sceneTextPanels: document.getElementById('scene-text-panels'),
    sceneActionButtons: document.getElementById('scene-action-buttons'),
    sceneBackdrop: document.getElementById('scene-backdrop'),
    // Overlay Modal elements
    hudOverlayScrim: document.getElementById('hud-overlay-scrim'),
    hudTitle: document.getElementById('hud-title'),
    hudCloseX: document.getElementById('hud-close-x'),
    hudSpriteStage: document.getElementById('hud-sprite-stage'),
    hudCharacterSprite: document.getElementById('hud-character-sprite'),
    hudSpeakerTag: document.getElementById('hud-speaker-tag'),
    hudMessageText: document.getElementById('hud-message-text'),
    hudInputContainer: document.getElementById('hud-input-container'),
    hudInputLabel: document.getElementById('hud-input-label'),
    hudInteractiveInput: document.getElementById('hud-interactive-input'),
    hudInputHint: document.getElementById('hud-input-hint'),
    hudAlertBanner: document.getElementById('hud-alert-banner'),
    hudCancelBtn: document.getElementById('hud-cancel-btn'),
    hudConfirmBtn: document.getElementById('hud-confirm-btn')
  };

  // Step 1: Render Top Player HUD Bar
  function renderPlayerHudBar() {
    DOM.hudPlayerName.textContent = GameState.player.name;
    DOM.hudPlayerTitle.textContent = GameState.player.title;

    // Build stat items
    DOM.hudStatStrip.innerHTML = '';
    const displayKeys = ['health_points', 'gold', 'mana', 'potions_owned', 'vault_stash_count'];
    displayKeys.forEach(k => {
      if (GameState.player[k] !== undefined) {
        const pill = document.createElement('div');
        pill.className = 'stat-pill';
        const label = k.replace('_points', 'P').replace('_', ' ');
        pill.innerHTML = \`<span class="stat-pill-label">\${label}:</span> <span>\${GameState.player[k]}</span>\`;
        DOM.hudStatStrip.appendChild(pill);
      }
    });
  }

  // Step 3: Render Active Scene
  function renderScene(sceneId) {
    const scene = GameState.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    GameState.currentSceneId = sceneId;
    DOM.sceneHeading.textContent = scene.name;

    // Set background styling
    if (scene.backgroundTheme) {
      const preset = getPresetBackground(scene.backgroundTheme);
      DOM.sceneBackdrop.style.background = preset;
    }

    // Render Text Panels
    DOM.sceneTextPanels.innerHTML = '';
    scene.textPanels.forEach(panel => {
      const card = document.createElement('div');
      card.className = 'text-panel-card';
      const speakerHtml = panel.speaker ? \`<div class="text-panel-speaker">\${panel.speaker}</div>\` : '';
      const interpolatedText = interpolateTemplate(panel.content);
      card.innerHTML = speakerHtml + \`<div class="text-panel-body">\${interpolatedText}</div>\`;
      DOM.sceneTextPanels.appendChild(card);
    });

    // Render Scene Action Buttons (Wiring Triggers)
    DOM.sceneActionButtons.innerHTML = '';
    scene.buttons.forEach(btn => {
      const buttonEl = document.createElement('button');
      buttonEl.className = 'scene-btn';
      buttonEl.id = btn.id;
      buttonEl.innerHTML = \`<span>\${btn.label}</span>\`;

      // Step 5 Wiring: Attach Click Listener
      buttonEl.addEventListener('click', () => {
        SoundFX.playClick();
        triggerHaptic();

        // Apply any button-level mutations
        if (btn.mutations && btn.mutations.length > 0) {
          btn.mutations.forEach(m => applyMutation(m.target, m.operation, m.value));
          renderPlayerHudBar();
        }

        // Branch by Action Type
        if (btn.actionType === 'open_hud' && btn.targetHudId) {
          openHudOverlay(btn.targetHudId, scene.id, btn.id);
        } else if (btn.actionType === 'change_scene' && btn.targetSceneId) {
          renderScene(btn.targetSceneId);
        }
      });

      DOM.sceneActionButtons.appendChild(buttonEl);
    });
  }

  // Step 4: Open and Render HUD Overlay
  function openHudOverlay(hudId, sourceSceneId, sourceButtonId) {
    const hud = GameState.hudOverlays.find(h => h.id === hudId);
    if (!hud) return;

    GameState.activeHudId = hudId;
    DOM.hudTitle.textContent = hud.title || hud.name;
    DOM.hudMessageText.textContent = interpolateTemplate(hud.messageText);

    // Setup Close 'X' Button
    if (hud.showCloseX !== false) {
      DOM.hudCloseX.classList.remove('hidden');
    } else {
      DOM.hudCloseX.classList.add('hidden');
    }

    // Visual Novel Character Sprite Presentation
    if (hud.sprite) {
      DOM.hudSpriteStage.classList.remove('hidden');
      DOM.hudSpeakerTag.textContent = hud.speakerName || 'Dialogue';
      DOM.hudCharacterSprite.innerHTML = getPresetSpriteSvg(hud.sprite);
    } else {
      DOM.hudSpriteStage.classList.add('hidden');
    }

    // Input Handling (Numeric / Secret Code)
    DOM.hudAlertBanner.classList.add('hidden');
    DOM.hudAlertBanner.textContent = '';

    if (hud.type === 'input_number' || hud.type === 'input_text') {
      DOM.hudInputContainer.classList.remove('hidden');
      DOM.hudInputLabel.textContent = hud.inputLabel || 'Enter Value:';
      DOM.hudInteractiveInput.value = '';
      DOM.hudInteractiveInput.placeholder = hud.inputPlaceholder || '';
      DOM.hudInteractiveInput.type = hud.type === 'input_number' ? 'number' : 'text';

      if (hud.purchaseConfig) {
        DOM.hudInputHint.textContent = \`Price: \${hud.purchaseConfig.unitPrice} gold each (You have: \${GameState.player.gold} gold)\`;
      } else {
        DOM.hudInputHint.textContent = '';
      }
    } else {
      DOM.hudInputContainer.classList.add('hidden');
    }

    // Button Labels
    DOM.hudConfirmBtn.textContent = hud.confirmButtonText || 'Confirm';
    if (hud.cancelButtonText) {
      DOM.hudCancelBtn.textContent = hud.cancelButtonText;
      DOM.hudCancelBtn.classList.remove('hidden');
    } else {
      DOM.hudCancelBtn.classList.add('hidden');
    }

    // Show Scrim
    DOM.hudOverlayScrim.classList.remove('hidden');
  }

  // Close HUD Overlay
  function closeHudOverlay() {
    GameState.activeHudId = null;
    DOM.hudOverlayScrim.classList.add('hidden');
    renderPlayerHudBar();
    renderScene(GameState.currentSceneId);
  }

  // HUD Submit / Confirm Handler (Step 4 & Step 5)
  function handleHudSubmit() {
    const hud = GameState.hudOverlays.find(h => h.id === GameState.activeHudId);
    if (!hud) return;

    SoundFX.playClick();
    triggerHaptic();

    // 1. Validation for Secret Code Prompts
    if (hud.type === 'input_text' && hud.secretValidation) {
      const typed = DOM.hudInteractiveInput.value.trim();
      if (typed.toUpperCase() === hud.secretValidation.correctCode.toUpperCase()) {
        SoundFX.playSuccess();
        hud.secretValidation.successMutations.forEach(m => applyMutation(m.target, m.operation, m.value));
        DOM.hudAlertBanner.className = '';
        DOM.hudAlertBanner.textContent = hud.secretValidation.successNotification;
        DOM.hudAlertBanner.classList.remove('hidden');
        renderPlayerHudBar();
        setTimeout(() => closeHudOverlay(), 1600);
        return;
      } else {
        DOM.hudAlertBanner.className = 'error';
        DOM.hudAlertBanner.textContent = hud.secretValidation.failureNotification;
        DOM.hudAlertBanner.classList.remove('hidden');
        return;
      }
    }

    // 2. Purchasing with Quantity Input
    if (hud.type === 'input_number' && hud.purchaseConfig) {
      const qty = parseInt(DOM.hudInteractiveInput.value, 10);
      if (isNaN(qty) || qty <= 0) {
        DOM.hudAlertBanner.className = 'error';
        DOM.hudAlertBanner.textContent = 'Please enter a valid quantity greater than 0.';
        DOM.hudAlertBanner.classList.remove('hidden');
        return;
      }
      const totalCost = qty * hud.purchaseConfig.unitPrice;
      if (GameState.player.gold < totalCost) {
        DOM.hudAlertBanner.className = 'error';
        DOM.hudAlertBanner.textContent = \`Not enough gold! Total cost is \${totalCost} gold, but you only have \${GameState.player.gold}.\`;
        DOM.hudAlertBanner.classList.remove('hidden');
        return;
      }

      // Deduct gold and add inventory
      GameState.player.gold -= totalCost;
      GameState.player.potions_owned = (GameState.player.potions_owned || 0) + qty;
      SoundFX.playSuccess();
      renderPlayerHudBar();
      showToast(\`Acquired \${qty}x \${hud.purchaseConfig.itemName} for \${totalCost} Gold!\`);
      closeHudOverlay();
      return;
    }

    // 3. Regular Mutations
    if (hud.submitMutations && hud.submitMutations.length > 0) {
      hud.submitMutations.forEach(m => applyMutation(m.target, m.operation, m.value));
    }

    if (hud.notificationOnSubmit) {
      showToast(hud.notificationOnSubmit);
    }

    closeHudOverlay();
  }

  // Wire Modal Buttons
  DOM.hudCloseX.addEventListener('click', () => {
    SoundFX.playClick();
    closeHudOverlay();
  });
  DOM.hudCancelBtn.addEventListener('click', () => {
    SoundFX.playClick();
    closeHudOverlay();
  });
  DOM.hudConfirmBtn.addEventListener('click', handleHudSubmit);

  // Close when clicking outside card
  DOM.hudOverlayScrim.addEventListener('click', (e) => {
    if (e.target === DOM.hudOverlayScrim) {
      closeHudOverlay();
    }
  });

  // Background Presets Helper
  function getPresetBackground(id) {
    const list = ${JSON.stringify(BACKGROUND_PRESETS)};
    const found = list.find(b => b.id === id);
    return found ? found.cssBackground : 'linear-gradient(135deg, #0f172a, #1e293b)';
  }

  // Sprite Presets SVG Helper
  function getPresetSpriteSvg(spriteId) {
    return \`${getSvgForSprite('hero_apprentice')}\`;
  }

  ${wiringDocs}

  // App Initialization
  document.addEventListener('DOMContentLoaded', () => {
    renderPlayerHudBar();
    renderScene(GameState.currentSceneId);
    console.info('NovelCap Boilerplate initialized successfully for ${escapeJs(project.name)}');
  });

})();
`;
}

function generateCapacitorConfig(project: GameProject): string {
  return JSON.stringify({
    appId: project.appId || 'com.gamestudio.game',
    appName: project.name || 'NovelCap Game',
    webDir: 'www',
    bundledWebRuntime: false,
    plugins: {
      SplashScreen: {
        launchShowDuration: 1500,
        backgroundColor: "#0f172a"
      }
    }
  }, null, 2);
}

function generatePackageJson(project: GameProject): string {
  return JSON.stringify({
    name: project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: project.version || '1.0.0',
    description: "2D sprite light novel & semi-text game powered by Capacitor",
    scripts: {
      "build": "echo 'Web assets compiled in www directory'",
      "cap:add:android": "npx cap add android",
      "cap:add:ios": "npx cap add ios",
      "cap:sync": "npx cap sync",
      "cap:open:android": "npx cap open android",
      "cap:open:ios": "npx cap open ios",
      "cap:run:android": "npx cap run android"
    },
    dependencies: {
      "@capacitor/core": "^6.0.0",
      "@capacitor/app": "^6.0.0",
      "@capacitor/haptics": "^6.0.0",
      "@capacitor/splash-screen": "^6.0.0",
      "@capacitor/status-bar": "^6.0.0"
    },
    devDependencies: {
      "@capacitor/cli": "^6.0.0",
      "@capacitor/android": "^6.0.0",
      "@capacitor/ios": "^6.0.0"
    }
  }, null, 2);
}

function generateReadme(project: GameProject): string {
  return `# ${project.name}

> A 2D Sprite Light Novel & Semi-Text Game built with the NovelCap Generator.

## Architecture

This project is packaged with the single-file web architecture inside the \`www/\` folder:
- \`www/index.html\`: Core semantic structure, Top Player HUD bar, Scene text panels, and modal HUD container.
- \`www/style.css\`: Light novel UI styling with support for notch safe areas and responsive displays.
- \`www/main.js\`: Complete game state engine with documented blocks for every HUD and Scene button wiring rule.
- \`www/assets/\`: Included media assets:
  - \`www/assets/sprites/\`: 2D character sprites & sprite sheets.
  - \`www/assets/backgrounds/\`: Scene backgrounds and atmosphere graphics.
  - \`www/assets/audio/\`: Sound effects (clicks, coins, success jingles, and vault latches).
- \`capacitor.config.json\`: Capacitor native project configuration.

## How to Build and Run on Android / iOS

### Step 1: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 2: Add Native Mobile Platforms
For Android:
\`\`\`bash
npx cap add android
\`\`\`

For iOS (macOS only):
\`\`\`bash
npx cap add ios
\`\`\`

### Step 3: Sync Web Assets
Whenever you edit \`www/index.html\`, \`www/style.css\`, or \`www/main.js\`:
\`\`\`bash
npx cap sync
\`\`\`

### Step 4: Open in Android Studio or Xcode
\`\`\`bash
npx cap open android
# or
npx cap open ios
\`\`\`

Press **Run** to launch directly on your emulator or connected physical phone!
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str: string): string {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}
