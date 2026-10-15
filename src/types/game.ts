export type VariableType = 'number' | 'string' | 'boolean' | 'list';

export interface GameVariable {
  key: string;
  type: VariableType;
  value: string | number | boolean | string[];
  description?: string;
}

export interface PlayerObject {
  name: string;
  title: string;
  sprite: string;
  variables: GameVariable[];
}

export type GameObjectCategory = 'npc' | 'enemy' | 'quest' | 'item' | 'weapon' | 'custom';

export interface GameObject {
  id: string;
  name: string;
  category: GameObjectCategory;
  sprite: string;
  description: string;
  variables: GameVariable[];
}

export interface TextPanel {
  id: string;
  title?: string;
  content: string; // can contain {player.health_points}, etc.
  speaker?: string;
}

export interface VariableMutation {
  target: string; // e.g. "player.health_points" or "npcs.merchant_lyra.affinity"
  operation: 'set' | 'add' | 'subtract' | 'multiply' | 'append_list' | 'remove_list';
  value: string | number | boolean;
}

export interface SceneButton {
  id: string;
  label: string;
  actionType: 'open_hud' | 'change_scene' | 'mutate_var' | 'custom_action';
  targetHudId?: string;
  targetSceneId?: string;
  mutations?: VariableMutation[];
  condition?: {
    variable: string;
    operator: '==' | '!=' | '>=' | '<=' | '>' | '<' | 'contains';
    value: string | number | boolean;
  };
}

export interface Scene {
  id: string;
  name: string;
  backgroundTheme: string;
  customBackgroundUrl?: string;
  textPanels: TextPanel[];
  buttons: SceneButton[];
}

export type HudType = 'dialogue' | 'input_number' | 'input_text' | 'notification' | 'stats';

export interface SecretCodeValidation {
  correctCode: string;
  successNotification: string;
  failureNotification: string;
  successMutations: VariableMutation[];
}

export interface PurchaseConfig {
  itemName: string;
  unitPrice: number;
  currencyVariable: string; // e.g. "player.gold"
  inventoryVariable: string; // e.g. "player.inventory"
}

export interface HudOverlay {
  id: string;
  name: string;
  type: HudType;
  title: string;
  sprite?: string;
  spritePosition?: 'left' | 'right' | 'center';
  speakerName?: string;
  messageText: string;
  // Controls
  showCloseX: boolean;
  confirmButtonText: string;
  cancelButtonText?: string;
  // Specific input configs
  inputLabel?: string;
  inputPlaceholder?: string;
  numericMin?: number;
  numericMax?: number;
  secretValidation?: SecretCodeValidation;
  purchaseConfig?: PurchaseConfig;
  // Action triggered on submit/confirm
  submitMutations: VariableMutation[];
  nextSceneOnSubmit?: string;
  nextHudOnSubmit?: string;
  notificationOnSubmit?: string;
}

export interface WiringRule {
  id: string;
  sceneId: string;
  buttonId: string;
  hudId: string;
  notes: string; // "Block for HUD [name] that comes up when button [name] of Scene [name] is pressed"
}

export type AssetCategory = 'sprite' | 'background' | 'audio';

export interface GameAsset {
  id: string;
  name: string;
  category: AssetCategory;
  fileType: string;
  dataUrl: string; // Base64 data URL, SVG text, or audio blob URL
  filename: string;
  isCustom?: boolean;
  sizeLabel?: string;
  description?: string;
}

export interface GameProject {
  id: string;
  name: string;
  appId: string;
  version: string;
  author: string;
  themeStyle: 'fantasy' | 'cyberpunk' | 'retro_rpg' | 'modern_mystery';
  player: PlayerObject;
  gameObjects: GameObject[];
  scenes: Scene[];
  hudOverlays: HudOverlay[];
  wiringRules: WiringRule[];
  assets: GameAsset[];
}

