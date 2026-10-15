import { GameAsset } from '../types/game';
import { SYNTH_SOUND_EFFECTS } from '../utils/audioSynthesizer';

export interface SpritePreset {
  id: string;
  name: string;
  category: 'player' | 'npc' | 'enemy' | 'item';
  svg: string;
  isSheet?: boolean;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  cssBackground: string;
  previewColor: string;
}

export const SPRITE_SHEET_ADVENTURER = `<svg viewBox="0 0 640 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sheetCloak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <!-- Frame Divider Guides -->
  <line x1="160" y1="0" x2="160" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
  <line x1="320" y1="0" x2="320" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
  <line x1="480" y1="0" x2="480" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>

  <!-- Frame 1: Idle Normal -->
  <g transform="translate(0, 0)">
    <ellipse cx="80" cy="148" rx="38" ry="6" fill="#00000033"/>
    <path d="M48 144 C48 106 60 96 80 96 C100 96 112 106 112 144 Z" fill="url(#sheetCloak)"/>
    <ellipse cx="80" cy="65" rx="24" ry="28" fill="#fde68a"/>
    <path d="M54 50 L64 68 L72 50 L82 72 L90 52 L98 68 L106 50 C102 34 58 34 54 50 Z" fill="#78350f"/>
    <circle cx="72" cy="66" r="3" fill="#1e293b"/>
    <circle cx="88" cy="66" r="3" fill="#1e293b"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Frame 1: Idle</text>
  </g>

  <!-- Frame 2: Dialogue Speak -->
  <g transform="translate(160, 0)">
    <ellipse cx="80" cy="148" rx="38" ry="6" fill="#00000033"/>
    <path d="M48 144 C48 106 60 96 80 96 C100 96 112 106 112 144 Z" fill="url(#sheetCloak)"/>
    <ellipse cx="80" cy="64" rx="24" ry="28" fill="#fde68a"/>
    <path d="M54 49 L64 67 L72 49 L82 71 L90 51 L98 67 L106 49 C102 33 58 33 54 49 Z" fill="#78350f"/>
    <circle cx="72" cy="65" r="3" fill="#1e293b"/>
    <circle cx="88" cy="65" r="3" fill="#1e293b"/>
    <circle cx="80" cy="76" r="3" fill="#92400e"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Frame 2: Talk</text>
  </g>

  <!-- Frame 3: Surprise / Question -->
  <g transform="translate(320, 0)">
    <ellipse cx="80" cy="148" rx="38" ry="6" fill="#00000033"/>
    <path d="M48 142 C48 104 60 94 80 94 C100 94 112 104 112 142 Z" fill="url(#sheetCloak)"/>
    <ellipse cx="80" cy="62" rx="24" ry="28" fill="#fde68a"/>
    <path d="M54 47 L64 65 L72 47 L82 69 L90 49 L98 65 L106 47 C102 31 58 31 54 47 Z" fill="#78350f"/>
    <circle cx="72" cy="62" r="4.5" fill="#1e293b"/>
    <circle cx="88" cy="62" r="4.5" fill="#1e293b"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Frame 3: Alert</text>
  </g>

  <!-- Frame 4: Happy Smile -->
  <g transform="translate(480, 0)">
    <ellipse cx="80" cy="148" rx="38" ry="6" fill="#00000033"/>
    <path d="M48 144 C48 106 60 96 80 96 C100 96 112 106 112 144 Z" fill="url(#sheetCloak)"/>
    <ellipse cx="80" cy="65" rx="24" ry="28" fill="#fde68a"/>
    <path d="M54 50 L64 68 L72 50 L82 72 L90 52 L98 68 L106 50 C102 34 58 34 54 50 Z" fill="#78350f"/>
    <path d="M68 64 Q72 61 76 64" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M84 64 Q88 61 92 64" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M75 75 Q80 81 85 75" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Frame 4: Smile</text>
  </g>
</svg>`;

export const SPRITE_SHEET_ITEMS = `<svg viewBox="0 0 640 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Frame Divider Guides -->
  <line x1="160" y1="0" x2="160" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
  <line x1="320" y1="0" x2="320" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>
  <line x1="480" y1="0" x2="480" y2="160" stroke="#334155" stroke-dasharray="4 4" stroke-width="1"/>

  <!-- Item 1: Health Potion -->
  <g transform="translate(0, 0)">
    <circle cx="80" cy="95" r="32" fill="#dc2626" opacity="0.9"/>
    <rect x="74" y="45" width="12" height="20" fill="#94a3b8"/>
    <rect x="71" y="38" width="18" height="8" rx="2" fill="#b45309"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Item: Health Elixir</text>
  </g>

  <!-- Item 2: Gold Coin Stack -->
  <g transform="translate(160, 0)">
    <ellipse cx="80" cy="110" rx="28" ry="12" fill="#ca8a04"/>
    <ellipse cx="80" cy="100" rx="28" ry="12" fill="#eab308"/>
    <ellipse cx="80" cy="90" rx="28" ry="12" fill="#facc15"/>
    <text x="80" y="94" font-size="11" font-weight="bold" fill="#713f12" text-anchor="middle">GOLD</text>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Item: Currency</text>
  </g>

  <!-- Item 3: Ancient Key -->
  <g transform="translate(320, 0)">
    <circle cx="80" cy="65" r="18" stroke="#38bdf8" stroke-width="6"/>
    <rect x="77" y="80" width="6" height="42" fill="#38bdf8"/>
    <rect x="83" y="105" width="12" height="5" fill="#38bdf8"/>
    <rect x="83" y="116" width="10" height="5" fill="#38bdf8"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Item: Rune Key</text>
  </g>

  <!-- Item 4: Magic Scroll -->
  <g transform="translate(480, 0)">
    <rect x="55" y="55" width="50" height="65" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <line x1="65" y1="70" x2="95" y2="70" stroke="#b45309" stroke-width="2"/>
    <line x1="65" y1="82" x2="95" y2="82" stroke="#b45309" stroke-width="2"/>
    <line x1="65" y1="94" x2="85" y2="94" stroke="#b45309" stroke-width="2"/>
    <text x="80" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Item: Ancient Tome</text>
  </g>
</svg>`;

export const SPRITE_PRESETS: SpritePreset[] = [
  {
    id: 'hero_apprentice',
    name: 'Hero: Apprentice Mage',
    category: 'player',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloakG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="hairG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="150" rx="45" ry="8" fill="#00000033"/>
      <path d="M45 145 C45 105 60 95 80 95 C100 95 115 105 115 145 Z" fill="url(#cloakG)"/>
      <path d="M72 95 L88 95 L84 145 L76 145 Z" fill="#fbbf24"/>
      <path d="M60 95 Q80 115 100 95 Q80 105 60 95 Z" fill="#1e3a8a"/>
      <ellipse cx="80" cy="65" rx="26" ry="30" fill="#fde68a"/>
      <path d="M50 65 C48 30 112 30 110 65 C105 45 55 45 50 65 Z" fill="url(#hairG)"/>
      <ellipse cx="70" cy="66" rx="4" ry="6" fill="#1e293b"/>
      <ellipse cx="90" cy="66" rx="4" ry="6" fill="#1e293b"/>
      <circle cx="71" cy="64" r="1.5" fill="#ffffff"/>
      <circle cx="91" cy="64" r="1.5" fill="#ffffff"/>
      <ellipse cx="66" cy="74" rx="3" ry="1.5" fill="#f87171" opacity="0.6"/>
      <ellipse cx="94" cy="74" rx="3" ry="1.5" fill="#f87171" opacity="0.6"/>
      <path d="M76 77 Q80 81 84 77" stroke="#92400e" stroke-width="2" stroke-linecap="round"/>
      <path d="M54 50 L64 68 L72 50 L82 72 L90 52 L98 68 L106 50 C102 34 58 34 54 50 Z" fill="url(#hairG)"/>
      <path d="M54 52 Q80 44 106 52" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <circle cx="80" cy="48" r="4" fill="#60a5fa" stroke="#fbbf24" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'sheet_adventurer',
    name: 'Sprite Sheet: Adventurer 4-Frames',
    category: 'player',
    isSheet: true,
    svg: SPRITE_SHEET_ADVENTURER
  },
  {
    id: 'sheet_items',
    name: 'Sprite Sheet: RPG Items 4-Grid',
    category: 'item',
    isSheet: true,
    svg: SPRITE_SHEET_ITEMS
  },
  {
    id: 'hero_cyber_scout',
    name: 'Hero: Cyber Vanguard',
    category: 'player',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyberJacket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="150" rx="42" ry="8" fill="#00000044"/>
      <path d="M48 145 C48 100 62 92 80 92 C98 92 112 100 112 145 Z" fill="url(#cyberJacket)"/>
      <path d="M78 92 L82 92 L82 145 L78 145 Z" fill="#06b6d4"/>
      <ellipse cx="80" cy="64" rx="25" ry="28" fill="#fed7aa"/>
      <rect x="58" y="58" width="44" height="13" rx="4" fill="#06b6d4" stroke="#22d3ee" stroke-width="2"/>
      <line x1="62" y1="64" x2="98" y2="64" stroke="#ecfeff" stroke-width="2" stroke-linecap="round"/>
      <path d="M52 56 L62 30 L74 44 L86 26 L96 46 L108 38 L104 62 C104 38 52 38 52 56 Z" fill="#09090b"/>
      <path d="M60 92 L68 110 L92 110 L100 92 Z" fill="#1e293b"/>
      <rect x="103" y="60" width="4" height="10" rx="2" fill="#06b6d4"/>
    </svg>`
  },
  {
    id: 'npc_eldrin',
    name: 'Master Eldrin (Alchemist)',
    category: 'npc',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="150" rx="46" ry="8" fill="#00000033"/>
      <path d="M42 145 C42 100 58 92 80 92 C102 92 118 100 118 145 Z" fill="url(#robeGrad)"/>
      <path d="M74 92 L86 92 L84 145 L76 145 Z" fill="#f59e0b"/>
      <path d="M64 74 C64 104 96 104 96 74 Z" fill="#e2e8f0"/>
      <ellipse cx="80" cy="62" rx="24" ry="26" fill="#fde68a"/>
      <path d="M52 64 C50 28 110 28 108 64 C100 38 60 38 52 64 Z" fill="#f8fafc"/>
      <path d="M66 54 Q72 52 76 55" stroke="#94a3b8" stroke-width="2"/>
      <path d="M84 55 Q88 52 94 54" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="71" cy="60" r="7" stroke="#d97706" stroke-width="2" fill="#ffffff44"/>
      <circle cx="89" cy="60" r="7" stroke="#d97706" stroke-width="2" fill="#ffffff44"/>
      <line x1="78" y1="60" x2="82" y2="60" stroke="#d97706" stroke-width="2"/>
      <circle cx="71" cy="60" r="2" fill="#0f172a"/>
      <circle cx="89" cy="60" r="2" fill="#0f172a"/>
      <polygon points="80,18 116,42 80,48 44,42" fill="#064e3b" stroke="#f59e0b" stroke-width="2"/>
      <path d="M106 44 L114 62" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="114" cy="63" r="3" fill="#f59e0b"/>
    </svg>`
  },
  {
    id: 'npc_lyra',
    name: 'Lyra the Fox Merchant',
    category: 'npc',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lyraHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="150" rx="42" ry="7" fill="#00000033"/>
      <polygon points="56,50 48,22 72,38" fill="#ea580c"/>
      <polygon points="58,46 52,28 68,38" fill="#fef08a"/>
      <polygon points="104,50 112,22 88,38" fill="#ea580c"/>
      <polygon points="102,46 108,28 92,38" fill="#fef08a"/>
      <path d="M48 145 C48 104 62 96 80 96 C98 96 112 104 112 145 Z" fill="#854d0e"/>
      <path d="M68 96 L92 96 L88 145 L72 145 Z" fill="#fef08a"/>
      <ellipse cx="80" cy="66" rx="24" ry="26" fill="#ffedd5"/>
      <path d="M52 66 C50 36 110 36 108 66 C102 44 58 44 52 66 Z" fill="url(#lyraHair)"/>
      <path d="M50 64 L58 84 L64 64 L74 86 L80 64 L88 86 L96 64 L102 84 L110 64 Z" fill="url(#lyraHair)"/>
      <ellipse cx="70" cy="68" rx="5" ry="7" fill="#15803d"/>
      <ellipse cx="90" cy="68" rx="5" ry="7" fill="#15803d"/>
      <circle cx="71" cy="65" r="2" fill="#ffffff"/>
      <circle cx="91" cy="65" r="2" fill="#ffffff"/>
      <path d="M76 78 Q80 82 84 78" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
      <circle cx="106" cy="120" r="12" fill="#ca8a04" stroke="#fef08a" stroke-width="2"/>
      <text x="106" y="124" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">G</text>
    </svg>`
  },
  {
    id: 'enemy_slime',
    name: 'Cavern Slime',
    category: 'enemy',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="slimeRad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#6ee7b7"/>
          <stop offset="60%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="142" rx="48" ry="12" fill="#00000033"/>
      <path d="M80 40 C110 40 128 72 128 106 C128 136 108 140 80 140 C52 140 32 136 32 106 C32 72 50 40 80 40 Z" fill="url(#slimeRad)"/>
      <ellipse cx="62" cy="64" rx="14" ry="7" transform="rotate(-30 62 64)" fill="#ffffff" opacity="0.6"/>
      <ellipse cx="68" cy="92" rx="6" ry="8" fill="#064e3b"/>
      <ellipse cx="94" cy="92" rx="6" ry="8" fill="#064e3b"/>
      <circle cx="70" cy="89" r="2.5" fill="#ffffff"/>
      <circle cx="96" cy="89" r="2.5" fill="#ffffff"/>
      <path d="M78 106 Q81 110 84 106" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'item_potion',
    name: 'Health Elixir Vial',
    category: 'item',
    svg: `<svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="potionG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
      <rect x="70" y="30" width="20" height="12" rx="2" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <rect x="73" y="42" width="14" height="18" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="80" cy="100" r="42" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
      <path d="M42 108 C42 128 58 138 80 138 C102 138 118 128 118 108 Q100 114 80 108 Q60 102 42 108 Z" fill="url(#potionG)"/>
      <circle cx="68" cy="120" r="3" fill="#ffffff88"/>
      <circle cx="92" cy="115" r="4" fill="#ffffff88"/>
      <path d="M52 82 A34 34 0 0 1 76 68" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  }
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'workshop_alchemy',
    name: 'Alchemist Workshop',
    previewColor: '#1e293b',
    cssBackground: 'radial-gradient(ellipse at 50% 20%, #1e3a5f 0%, #0f172a 70%, #020617 100%)'
  },
  {
    id: 'village_square',
    name: 'Sunlit Village Square',
    previewColor: '#0369a1',
    cssBackground: 'linear-gradient(180deg, #38bdf8 0%, #bae6fd 40%, #84cc16 41%, #4d7c0f 100%)'
  },
  {
    id: 'crystal_cavern',
    name: 'Glowing Crystal Cavern',
    previewColor: '#312e81',
    cssBackground: 'radial-gradient(circle at 50% 60%, #4338ca 0%, #1e1b4b 60%, #09090b 100%)'
  },
  {
    id: 'cyber_alley',
    name: 'Neon Cyberpunk Alley',
    previewColor: '#4a044e',
    cssBackground: 'linear-gradient(135deg, #09090b 0%, #2e1065 50%, #083344 100%)'
  },
  {
    id: 'royal_library',
    name: 'Royal Archive & Library',
    previewColor: '#78350f',
    cssBackground: 'radial-gradient(ellipse at center, #78350f 0%, #451a03 70%, #1c0a00 100%)'
  }
];

export function getSvgForSprite(spriteId?: string, assets?: GameAsset[]): string {
  if (!spriteId) return SPRITE_PRESETS[0].svg;
  if (assets) {
    const customAsset = assets.find(a => a.id === spriteId || a.id === `asset_${spriteId}` || a.filename === spriteId);
    if (customAsset) {
      if (customAsset.dataUrl.startsWith('<svg')) return customAsset.dataUrl;
      return `<img src="${customAsset.dataUrl}" style="width:100%;height:100%;object-fit:contain;" alt="${customAsset.name}"/>`;
    }
  }
  const found = SPRITE_PRESETS.find(s => s.id === spriteId);
  return found ? found.svg : SPRITE_PRESETS[0].svg;
}

/**
 * Returns initial default game assets array for the project
 */
export function getDefaultGameAssets(): GameAsset[] {
  const assets: GameAsset[] = [];

  // 1. Sprite Assets
  SPRITE_PRESETS.forEach(sprite => {
    assets.push({
      id: `asset_${sprite.id}`,
      name: sprite.name,
      category: 'sprite',
      fileType: 'image/svg+xml',
      filename: `${sprite.id}.svg`,
      dataUrl: sprite.svg,
      sizeLabel: sprite.isSheet ? '640x160 · 4 KB' : '160x160 · 2 KB',
      description: sprite.isSheet ? '2D Sprite Sheet Grid with multiple action frames' : 'Single 2D Character / Item sprite'
    });
  });

  // 2. Background Assets
  BACKGROUND_PRESETS.forEach(bg => {
    assets.push({
      id: `asset_bg_${bg.id}`,
      name: bg.name,
      category: 'background',
      fileType: 'image/svg+xml',
      filename: `bg_${bg.id}.svg`,
      dataUrl: `<svg viewBox="0 0 800 600" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bg.previewColor}"/><stop offset="100%" stop-color="#020617"/></linearGradient></defs><rect width="800" height="600" fill="url(#bgG)"/><text x="400" y="300" fill="#ffffff33" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">${bg.name}</text></svg>`,
      sizeLabel: '800x600 · 3 KB',
      description: 'Atmospheric scene background scenery'
    });
  });

  // 3. Sound Effects (Synthesized WAV data URLs)
  assets.push({
    id: 'asset_sfx_click',
    name: 'UI Button Tap Click',
    category: 'audio',
    fileType: 'audio/wav',
    filename: 'sfx_click.wav',
    dataUrl: SYNTH_SOUND_EFFECTS.click(),
    sizeLabel: 'WAV · 0.08s · 3.5 KB',
    description: 'Crisp tactile UI feedback for button presses'
  });

  assets.push({
    id: 'asset_sfx_purchase',
    name: 'Gold Coin Purchase Jingle',
    category: 'audio',
    fileType: 'audio/wav',
    filename: 'sfx_coin_purchase.wav',
    dataUrl: SYNTH_SOUND_EFFECTS.coinPurchase(),
    sizeLabel: 'WAV · 0.28s · 12 KB',
    description: 'Metallic coin clink for merchant transactions'
  });

  assets.push({
    id: 'asset_sfx_success',
    name: 'Secret Cipher Solved Fanfare',
    category: 'audio',
    fileType: 'audio/wav',
    filename: 'sfx_success_fanfare.wav',
    dataUrl: SYNTH_SOUND_EFFECTS.successFanfare(),
    sizeLabel: 'WAV · 0.45s · 20 KB',
    description: 'Triumphant arpeggio chime for unlocked secrets'
  });

  assets.push({
    id: 'asset_sfx_vault',
    name: 'Dimensional Vault Latch',
    category: 'audio',
    fileType: 'audio/wav',
    filename: 'sfx_vault_stash.wav',
    dataUrl: SYNTH_SOUND_EFFECTS.vaultStash(),
    sizeLabel: 'WAV · 0.22s · 9.7 KB',
    description: 'Heavy locking mechanism sound for item storage'
  });

  assets.push({
    id: 'asset_sfx_error',
    name: 'Passcode Denied Buzzer',
    category: 'audio',
    fileType: 'audio/wav',
    filename: 'sfx_error_buzzer.wav',
    dataUrl: SYNTH_SOUND_EFFECTS.errorBuzzer(),
    sizeLabel: 'WAV · 0.24s · 10 KB',
    description: 'Warning tone for incorrect ciphers or insufficient gold'
  });

  return assets;
}

