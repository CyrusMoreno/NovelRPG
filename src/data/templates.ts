import { GameProject } from '../types/game';
import { getDefaultGameAssets } from './sprites';

export const DEFAULT_ALCHEMIST_PROJECT: GameProject = {
  id: 'alchemist_tale',
  name: "Alchemist's Odyssey",
  appId: 'com.gamestudio.alchemistsodyssey',
  version: '1.0.0',
  author: 'GameStudio Creator',
  themeStyle: 'fantasy',
  player: {
    name: 'Rowan',
    title: 'Apprentice Alchemist',
    sprite: 'hero_apprentice',
    variables: [
      { key: 'name', type: 'string', value: 'Rowan', description: 'Hero name' },
      { key: 'health_points', type: 'number', value: 85, description: 'Current health points' },
      { key: 'max_health', type: 'number', value: 100, description: 'Maximum health capacity' },
      { key: 'gold', type: 'number', value: 65, description: 'Player gold coins' },
      { key: 'mana', type: 'number', value: 40, description: 'Current magical mana' },
      { key: 'potions_owned', type: 'number', value: 2, description: 'Number of healing potions in bag' },
      { key: 'vault_stash_count', type: 'number', value: 5, description: 'Items safely stored in dimensional vault' },
      { key: 'cavern_unlocked', type: 'boolean', value: false, description: 'Whether the crystal cavern seal was solved' }
    ]
  },
  gameObjects: [
    {
      id: 'npc_master_eldrin',
      name: 'Master Eldrin',
      category: 'npc',
      sprite: 'npc_eldrin',
      description: 'The senior royal alchemist who mentored you in potion crafting.',
      variables: [
        { key: 'affinity', type: 'number', value: 15, description: 'Friendship level with player' },
        { key: 'secret_code', type: 'string', value: 'AZURE7', description: 'Secret cavern rune code revealed to player' },
        { key: 'has_spoken', type: 'boolean', value: true, description: 'Spoken dialogue trigger' }
      ]
    },
    {
      id: 'npc_merchant_lyra',
      name: 'Lyra the Merchant',
      category: 'npc',
      sprite: 'npc_lyra',
      description: 'A cheerful traveling merchant specialized in rare herbs and reagents.',
      variables: [
        { key: 'potion_price', type: 'number', value: 12, description: 'Cost per potion vial' },
        { key: 'stock_potions', type: 'number', value: 20, description: 'Remaining stock in shop' }
      ]
    },
    {
      id: 'enemy_cavern_slime',
      name: 'Cavern Slime',
      category: 'enemy',
      sprite: 'enemy_slime',
      description: 'A gelatinous creature radiating raw mana inside the cavern depths.',
      variables: [
        { key: 'health_points', type: 'number', value: 50, description: 'Enemy slime health' },
        { key: 'attack_power', type: 'number', value: 14, description: 'Damage dealt on attack' },
        { key: 'loot_gold', type: 'number', value: 25, description: 'Gold awarded on defeat' }
      ]
    },
    {
      id: 'quest_ancient_seal',
      name: 'The Sealed Cavern',
      category: 'quest',
      sprite: 'item_potion',
      description: 'Decrypt the ancient rune gate to harvest rare glowing crystals.',
      variables: [
        { key: 'status', type: 'string', value: 'In Progress', description: 'Current quest stage' },
        { key: 'rune_code_needed', type: 'string', value: 'AZURE7', description: 'Required password' }
      ]
    },
    {
      id: 'item_health_elixir',
      name: 'Health Elixir',
      category: 'item',
      sprite: 'item_potion',
      description: 'Restores 35 health points when consumed in battle or rest.',
      variables: [
        { key: 'heal_power', type: 'number', value: 35, description: 'HP restoration amount' },
        { key: 'market_value', type: 'number', value: 12, description: 'Base gold cost' }
      ]
    }
  ],
  scenes: [
    {
      id: 'scene_workshop',
      name: 'Workshop Laboratory',
      backgroundTheme: 'workshop_alchemy',
      textPanels: [
        {
          id: 'p1',
          title: 'The Alchemist Quarters',
          content: 'You stand inside Master Eldrin\'s fragrant workshop. Glass alembics bubble softly over brass burners. You currently have {player.health_points}/{player.max_health} HP and {player.gold} Gold.',
          speaker: 'Narrator'
        }
      ],
      buttons: [
        {
          id: 'btn_talk_eldrin',
          label: 'Talk to Master Eldrin',
          actionType: 'open_hud',
          targetHudId: 'hud_eldrin_dialogue'
        },
        {
          id: 'btn_store_items',
          label: 'Deposit Items to Vault',
          actionType: 'open_hud',
          targetHudId: 'hud_vault_notification',
          mutations: [
            { target: 'player.vault_stash_count', operation: 'add', value: 1 }
          ]
        },
        {
          id: 'btn_go_market',
          label: 'Visit Village Market',
          actionType: 'change_scene',
          targetSceneId: 'scene_village'
        },
        {
          id: 'btn_go_cavern',
          label: 'Approach Crystal Cavern',
          actionType: 'change_scene',
          targetSceneId: 'scene_cavern'
        }
      ]
    },
    {
      id: 'scene_village',
      name: 'Village Market Square',
      backgroundTheme: 'village_square',
      textPanels: [
        {
          id: 'p2',
          title: 'Cobblestone Bazaar',
          content: 'Sunlight bathes the open plaza. Lyra waves from her awning, displaying freshly distilled vials. Your current pouch contains {player.gold} gold coins.',
          speaker: 'Narrator'
        }
      ],
      buttons: [
        {
          id: 'btn_talk_lyra',
          label: 'Buy Potions from Lyra',
          actionType: 'open_hud',
          targetHudId: 'hud_lyra_shop'
        },
        {
          id: 'btn_return_workshop',
          label: 'Return to Workshop',
          actionType: 'change_scene',
          targetSceneId: 'scene_workshop'
        }
      ]
    },
    {
      id: 'scene_cavern',
      name: 'Crystal Cavern Gate',
      backgroundTheme: 'crystal_cavern',
      textPanels: [
        {
          id: 'p3',
          title: 'The Rune Gate',
          content: 'Massive luminescent crystals illuminate a heavy runic door. An inscription reads: "Speak the cipher whispered by the master to enter." Current Seal status: {player.cavern_unlocked}',
          speaker: 'Narrator'
        }
      ],
      buttons: [
        {
          id: 'btn_enter_passcode',
          label: 'Enter Secret Gate Code',
          actionType: 'open_hud',
          targetHudId: 'hud_secret_code'
        },
        {
          id: 'btn_cavern_back',
          label: 'Back to Workshop',
          actionType: 'change_scene',
          targetSceneId: 'scene_workshop'
        }
      ]
    }
  ],
  hudOverlays: [
    {
      id: 'hud_eldrin_dialogue',
      name: 'Master Eldrin Advice Dialog',
      type: 'dialogue',
      title: 'Conversation with Master Eldrin',
      speakerName: 'Master Eldrin',
      sprite: 'npc_eldrin',
      spritePosition: 'left',
      messageText: '"Ah, Rowan! Remember, the rune cipher to unlock the Crystal Cavern is AZURE7. Keep it secret from wandering bandits. Also, take care of your health!"',
      showCloseX: true,
      confirmButtonText: 'Thank you, Master!',
      cancelButtonText: 'Close',
      submitMutations: [
        { target: 'npcs.npc_master_eldrin.affinity', operation: 'add', value: 5 }
      ],
      notificationOnSubmit: 'Eldrin nods with approval! (+5 Affinity)'
    },
    {
      id: 'hud_lyra_shop',
      name: 'Lyra Potion Purchase Input',
      type: 'input_number',
      title: 'Lyra’s Potion Counter',
      speakerName: 'Lyra the Merchant',
      sprite: 'npc_lyra',
      spritePosition: 'right',
      messageText: '"Welcome traveler! Fresh healing elixirs are 12 gold coins each. How many bottles would you like to purchase today?"',
      showCloseX: true,
      confirmButtonText: 'Purchase Potions',
      cancelButtonText: 'Maybe Later',
      inputLabel: 'Number of Potions to Purchase',
      inputPlaceholder: 'Enter quantity (e.g. 2)',
      numericMin: 1,
      numericMax: 10,
      purchaseConfig: {
        itemName: 'Health Elixir',
        unitPrice: 12,
        currencyVariable: 'player.gold',
        inventoryVariable: 'player.potions_owned'
      },
      submitMutations: [],
      notificationOnSubmit: 'Purchase finalized! Potions safely placed into your satchel.'
    },
    {
      id: 'hud_secret_code',
      name: 'Cavern Gate Passcode Prompt',
      type: 'input_text',
      title: 'Ancient Cipher Terminal',
      speakerName: 'Rune Inscription',
      spritePosition: 'center',
      messageText: 'The stone mechanism hums with dormant mana. Input the secret password provided by Master Eldrin to dissolve the barrier.',
      showCloseX: true,
      confirmButtonText: 'Submit Cipher',
      cancelButtonText: 'Step Away',
      inputLabel: 'Secret Rune Code',
      inputPlaceholder: 'Type passcode here (Hint: AZURE7)',
      secretValidation: {
        correctCode: 'AZURE7',
        successNotification: 'The rune turns brilliant sapphire! The cavern gate swings open wide.',
        failureNotification: 'The stone blinks crimson. The runes fail to resonate. Try asking Master Eldrin!',
        successMutations: [
          { target: 'player.cavern_unlocked', operation: 'set', value: true },
          { target: 'quests.quest_ancient_seal.status', operation: 'set', value: 'Completed' }
        ]
      },
      submitMutations: []
    },
    {
      id: 'hud_vault_notification',
      name: 'Vault Stash Success Notice',
      type: 'notification',
      title: 'Dimensional Vault Notification',
      messageText: 'Your surplus equipment and reagents have been safely transferred into the secure dimensional vault. Total items secured: {player.vault_stash_count}.',
      showCloseX: true,
      confirmButtonText: 'Acknowledged',
      submitMutations: []
    }
  ],
  wiringRules: [
    {
      id: 'w1',
      sceneId: 'scene_workshop',
      buttonId: 'btn_talk_eldrin',
      hudId: 'hud_eldrin_dialogue',
      notes: 'HUD [Master Eldrin Advice Dialog] comes up when button [Talk to Master Eldrin] of Scene [Workshop Laboratory] is pressed'
    },
    {
      id: 'w2',
      sceneId: 'scene_workshop',
      buttonId: 'btn_store_items',
      hudId: 'hud_vault_notification',
      notes: 'HUD [Vault Stash Success Notice] comes up when button [Deposit Items to Vault] of Scene [Workshop Laboratory] is pressed'
    },
    {
      id: 'w3',
      sceneId: 'scene_village',
      buttonId: 'btn_talk_lyra',
      hudId: 'hud_lyra_shop',
      notes: 'HUD [Lyra Potion Purchase Input] comes up when button [Buy Potions from Lyra] of Scene [Village Market Square] is pressed'
    },
    {
      id: 'w4',
      sceneId: 'scene_cavern',
      buttonId: 'btn_enter_passcode',
      hudId: 'hud_secret_code',
      notes: 'HUD [Cavern Gate Passcode Prompt] comes up when button [Enter Secret Gate Code] of Scene [Crystal Cavern Gate] is pressed'
    }
  ],
  assets: getDefaultGameAssets()
};
