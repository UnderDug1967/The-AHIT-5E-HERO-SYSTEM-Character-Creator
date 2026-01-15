import { CampaignTier } from './types';

export const CAMPAIGN_TIERS: CampaignTier[] = [
  { name: 'Standard Heroic', basePoints: 75, maxDisadPoints: 75 },
  { name: 'Powerful Heroic', basePoints: 100, maxDisadPoints: 100 },
  { name: 'Low-Powered Superheroic', basePoints: 150, maxDisadPoints: 100 },
  { name: 'Standard Superheroic', basePoints: 200, maxDisadPoints: 150 },
  { name: 'High-Powered Superheroic', basePoints: 300, maxDisadPoints: 150 },
];

export const CHARACTERISTIC_BASE = 10;

export const CHARACTERISTIC_COSTS = {
  STR: 1, DEX: 3, CON: 2, BODY: 2, INT: 1, EGO: 2, PRE: 1, COM: 0.5,
};

export const FIGURED_COSTS = {
  PD: 1, ED: 1, SPD: 10, REC: 2, END: 0.5, STUN: 1,
};

const LANGUAGE_LIST = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic', 'Latin', 'Greek', 'ASL'];

export const EVERYMAN_SKILLS_LIST = [
  { name: 'Acting', characteristic: 'PRE', type: 'Interaction', baseCost: 0, isEveryman: true },
  { name: 'Climbing', characteristic: 'DEX', type: 'Agility', baseCost: 0, isEveryman: true },
  { name: 'Concealment', characteristic: 'INT', type: 'Intellect', baseCost: 0, isEveryman: true },
  { name: 'Conversation', characteristic: 'PRE', type: 'Interaction', baseCost: 0, isEveryman: true },
  { name: 'Deduction', characteristic: 'INT', type: 'Intellect', baseCost: 0, isEveryman: true },
  { name: 'Language: Native', characteristic: 'None', type: 'Skill', baseCost: 0, isEveryman: true, requiresSpecialization: true, specialization: 'English' },
  { name: 'Paramedics', characteristic: 'INT', type: 'Intellect', baseCost: 0, isEveryman: true },
  { name: 'Persuasion', characteristic: 'PRE', type: 'Interaction', baseCost: 0, isEveryman: true },
  { name: 'PS: Profession', characteristic: 'INT', type: 'Profession', baseCost: 0, isEveryman: true, requiresSpecialization: true, specialization: 'Citizen' },
  { name: 'Shadowing', characteristic: 'INT', type: 'Intellect', baseCost: 0, isEveryman: true },
  { name: 'Stealth', characteristic: 'DEX', type: 'Agility', baseCost: 0, isEveryman: true },
  { name: 'TF: Ground Vehicles', characteristic: 'None', type: 'Familiarity', baseCost: 0, isEveryman: true, specialization: 'Small Motorized Ground Vehicles' },
  { name: 'AK: Home Region', characteristic: 'INT', type: 'Knowledge', baseCost: 0, isEveryman: true, requiresSpecialization: true, isAK: true, specialization: 'Local Area' },
];

export const SKILLS_LIBRARY = [
  { name: 'Acrobatics', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Acting', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Animal Handler', characteristic: 'PRE', type: 'Interaction', baseCost: 3, requiresSpecialization: true, specializations: ['Canines', 'Equines', 'Felines', 'Raptors', 'Reptiles', 'Insects'] },
  { name: 'Autofire Skills', characteristic: 'DEX', type: 'Combat', baseCost: 3 },
  { name: 'Breakfall', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Bugging', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Bureaucratics', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Charm', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Climbing', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Combat Driving', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Combat Piloting', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Computer Programming', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Concealment', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Contortionist', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Conversation', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Criminology', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Cryptography', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Deduction', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Demolitions', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Disguise', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Electronics', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Fast Draw', characteristic: 'DEX', type: 'Combat', baseCost: 3 },
  { name: 'Forensic Medicine', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Gambling', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'High Society', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Interrogation', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Inventor', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Language', characteristic: 'None', type: 'Skill', baseCost: 3, requiresSpecialization: true, specializations: LANGUAGE_LIST },
  { name: 'Lipreading', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Lockpicking', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Mechanics', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Mimicry', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Navigation', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Oratory', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Paramedics', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Persuasion', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Power', characteristic: 'EGO', type: 'Skill', baseCost: 3, requiresSpecialization: true, specializations: ['Magic', 'Fire Control', 'Telekinesis', 'Gadgetry'] },
  { name: 'Professional Skill (PS)', characteristic: 'INT', type: 'Profession', baseCost: 2, requiresSpecialization: true, specializations: ['Doctor', 'Lawyer', 'Soldier', 'Accountant', 'Engineer', 'Artist', 'Cook', 'Pilot', 'Police Officer', 'Mercenary'] },
  { name: 'Riding', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Science Skill (SS)', characteristic: 'INT', type: 'Intellect', baseCost: 2, requiresSpecialization: true, specializations: ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Zoology', 'Botany', 'Archaeology', 'Astronomy', 'Genetics', 'Psychology', 'Cybernetics'] },
  { name: 'Security Systems', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Shadowing', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Sleight of Hand', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Stealth', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Streetwise', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Survival', characteristic: 'INT', type: 'Intellect', baseCost: 3, requiresSpecialization: true, specializations: ['Arctic', 'Desert', 'Forest', 'Mountain', 'Marine', 'Urban'] },
  { name: 'Systems Operation', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Tactics', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Teamwork', characteristic: 'DEX', type: 'Agility', baseCost: 3 },
  { name: 'Tracking', characteristic: 'INT', type: 'Intellect', baseCost: 3 },
  { name: 'Trading', characteristic: 'PRE', type: 'Interaction', baseCost: 3 },
  { name: 'Transport Familiarity', characteristic: 'None', type: 'Familiarity', baseCost: 2, requiresSpecialization: true, specializations: ['Small Motorized Ground Vehicles', 'Large Motorized Ground Vehicles', 'Helicopters', 'Private Planes', 'Motorcycles', 'Equines', 'Spacecraft', 'Sailing Vessels'] },
  { name: 'Weapon Familiarity', characteristic: 'None', type: 'Combat', baseCost: 1, requiresSpecialization: true, specializations: ['Common Melee Weapons', 'Common Missile Weapons', 'Small Arms', 'Common Martial Arts Melee', 'Heavy Weapons', 'Vehicle Weapons', 'Slings', 'Energy Weapons'] },
  { name: 'Knowledge Skill (KS)', characteristic: 'INT', type: 'Knowledge', baseCost: 2, requiresSpecialization: true, specializations: ['History', 'Law', 'Politics', 'Pop Culture', 'Military History', 'Occult', 'Underworld', 'Fine Arts', 'Philosophy', 'Sports'] },
  { name: 'Area Knowledge (AK)', characteristic: 'INT', type: 'Knowledge', baseCost: 2, requiresSpecialization: true, isAK: true, specializations: ['Home City', 'Home Country', 'Galaxy', 'Dimension', 'Spirit World', 'Internet'] },
];

export const PERKS_LIBRARY = [
  { 
    name: 'Access', 
    baseCost: 1, 
    description: 'Privileged access to locations or information.',
    options: [
      { name: 'Level', values: { 'Minor Access': 1, 'Standard Access': 3, 'High-Level Access': 5 } }
    ]
  },
  { 
    name: 'Anonymity', 
    baseCost: 3, 
    description: 'Extremely difficult to find or identify.',
    options: [
      { name: 'Scope', values: { 'Standard': 3, 'Extensive': 5 } }
    ]
  },
  { 
    name: 'Computer Link', 
    baseCost: 1, 
    description: 'Access to special databases.',
    options: [
      { name: 'Utility', values: { 'Small Database': 1, 'Local Network': 2, 'National Network': 3, 'Global/Secure': 5 } }
    ]
  },
  { 
    name: 'Contact', 
    baseCost: 1, 
    description: 'NPC who provides information/help.',
    options: [
      { name: 'Power', values: { 'As Powerful': 0, 'More Powerful': 1, 'Much More Powerful': 2, 'Extremely Powerful': 3 } },
      { name: 'Relationship', values: { 'Useful Information': 1, 'Good Friend': 2, 'Close/Family': 3 } },
      { name: 'Availability', values: { '8-': 0, '11-': 1, '14-': 2, 'Always Available': 4 } },
      { name: 'Type', values: { 'Individual': 0, 'Organization': 2 } }
    ]
  },
  { 
    name: 'Deep Cover', 
    baseCost: 2, 
    description: 'Alternative identity with full documentation.',
    options: [
      { name: 'Thoroughness', values: { 'Simple ID': 2, 'Complete Life History': 3, 'Extremely Thorough': 5 } }
    ]
  },
  { 
    name: 'Favor', 
    baseCost: 1, 
    description: 'One-time help from a powerful NPC.',
    options: [
      { name: 'Value', values: { 'Small Favor': 1, 'Major Favor': 3, 'Lifesaving Favor': 5 } }
    ]
  },
  { 
    name: 'Follower', 
    baseCost: 1, 
    description: 'Loyal NPC subordinate.',
    options: [
      { name: 'Total Points', values: { '15 Points': 3, '30 Points': 6, '50 Points': 10, '75 Points': 15, '100 Points': 20, '150 Points': 30 } }
    ]
  },
  { 
    name: 'Fringe Benefit', 
    baseCost: 1, 
    description: 'Membership, license, rank, or special status.',
    options: [
      { name: 'Benefit', values: { 
        'Basic Membership': 1, 
        'Concealed Carry License': 1, 
        'Private Investigator License': 1, 
        'Passport': 1,
        'International Driver\'s License': 1,
        'Diplomatic Immunity': 5,
        'Judicial Immunity': 5,
        'Low Rank': 1,
        'Middle Rank': 3,
        'High Rank': 5,
        'Head of State': 10
      } }
    ]
  },
  { 
    name: 'Money', 
    baseCost: 5, 
    description: 'Represents significant personal wealth.',
    options: [
      { name: 'Wealth Level', values: { 'Well-to-do': 5, 'Wealthy': 10, 'Filthy Rich': 15, 'Multimillionaire': 20, 'Billionaire': 25 } }
    ]
  },
  { 
    name: 'Positive Reputation', 
    baseCost: 1, 
    description: 'People like, respect, or fear you (for the right reasons).',
    options: [
      { name: 'Bonus', values: { '+1 level': 1, '+2 levels': 2, '+3 levels': 3, '+4 levels': 4, '+5 levels': 5 } },
      { name: 'Frequency', values: { '8-': 1, '11-': 2, '14-': 3 } },
      { name: 'Scope', values: { 'Small Group': 1, 'Large Group': 2, 'Almost Everyone': 3 } }
    ]
  },
  { 
    name: 'Security Clearance', 
    baseCost: 1, 
    description: 'Access to classified information or sites.',
    options: [
      { name: 'Access Level', values: { 'Low Level': 1, 'Confidential': 2, 'Secret': 3, 'Top Secret': 5, 'Special/Black Access': 7 } }
    ]
  },
  { 
    name: 'Vehicle/Base', 
    baseCost: 1, 
    description: 'Ownership of equipment or property.',
    options: [
      { name: 'Point Value', values: { '10 Points': 2, '25 Points': 5, '50 Points': 10, '100 Points': 20, '250 Points': 50 } }
    ]
  }
];

export const TALENTS_LIBRARY = [
  { 
    name: 'Absolute Time Sense', 
    baseCost: 3, 
    description: 'Always knows the exact time.',
    options: []
  },
  { 
    name: 'Ambidexterity', 
    baseCost: 2, 
    description: 'No penalty for using off-hand.',
    options: []
  },
  { 
    name: 'Animal Friendship', 
    baseCost: 5, 
    description: 'Animals like and trust you.',
    options: []
  },
  { 
    name: 'Bump Of Direction', 
    baseCost: 3, 
    description: 'Always knows which way is North.',
    options: []
  },
  { 
    name: 'Combat Sense', 
    baseCost: 15, 
    description: 'Operate in combat without sight.',
    options: [
      { name: 'Level', values: { 'Standard (Sense Group)': 0, 'Innate/Untrained': -5, 'Fully Trained': 5 } }
    ]
  },
  { 
    name: 'Danger Sense', 
    baseCost: 15, 
    description: 'Intuition of impending harm.',
    options: [
      { name: 'Scope', values: { 'In & Out of Combat': 0, 'Out of Combat Only': -5, 'Immediate Vicinity': -2 } },
      { name: 'Area', values: { 'Self': 0, 'Any Area (+5\")': 5, 'Large Area (+10\")': 10 } },
      { name: 'Reliability', values: { '11-': 0, '14-': 5, '17-': 10 } }
    ]
  },
  { 
    name: 'Double-Jointed', 
    baseCost: 4, 
    description: '+2 to Contortionist.',
    options: []
  },
  { 
    name: 'Eidetic Memory', 
    baseCost: 5, 
    description: 'Total recall of information.',
    options: []
  },
  { 
    name: 'Environmental Movement', 
    baseCost: 2, 
    description: 'No penalty in specific terrain.',
    options: [
      { name: 'Terrain', values: { 'Aquatic': 0, 'Ice/Snow': 0, 'Zero-G': 0, 'Tightrope/Narrow': 0, 'Woods/Undergrowth': 0, 'Urban Obstacles': 0 } }
    ]
  },
  { 
    name: 'Lightning Calculator', 
    baseCost: 3, 
    description: 'Perform complex math instantly.',
    options: []
  },
  { 
    name: 'Lightning Reflexes', 
    baseCost: 0, 
    description: '+DEX for Initiative only.',
    options: [
      { name: 'Bonus', values: { '+1 DEX': 1, '+2 DEX': 2, '+3 DEX': 3, '+4 DEX': 4, '+5 DEX': 5, '+10 DEX': 10 } },
      { name: 'Scope', values: { 'All Actions': 0, 'Single Attack/Action': -1 } }
    ]
  },
  { 
    name: 'Lightsleep', 
    baseCost: 3, 
    description: 'Awakens instantly and alertly.',
    options: []
  },
  { 
    name: 'Luck', 
    baseCost: 5, 
    description: 'Represented by dice pools.',
    options: [
      { name: 'Dice Pool', values: { '1d6': 0, '2d6': 5, '3d6': 10, '4d6': 15, '5d6': 20 } }
    ]
  },
  { 
    name: 'Off-Hand Weapon Training', 
    baseCost: 5, 
    description: 'Use specific weapon group in off-hand.',
    options: [
      { name: 'Group', values: { 'Single Weapon Group': 0, 'All Melee': 5, 'All Ranged': 5, 'Everything': 15 } }
    ]
  },
  { 
    name: 'Resistance', 
    baseCost: 0, 
    description: '+1 to EGO vs specific effects.',
    options: [
      { name: 'Bonus', values: { '+1 level': 1, '+2 levels': 2, '+3 levels': 3, '+5 levels': 5, '+10 levels': 10 } }
    ]
  },
  { 
    name: 'Simulating Death', 
    baseCost: 3, 
    description: 'Enter death-like trance at will.',
    options: []
  },
  { 
    name: 'Speed Reading', 
    baseCost: 4, 
    description: 'Read extremely fast.',
    options: [
      { name: 'Factor', values: { 'x10 normal': 0, 'x100 normal': 2, 'x1,000 normal': 4 } }
    ]
  },
  { 
    name: 'Universal Translator', 
    baseCost: 20, 
    description: 'Understand and speak any language.',
    options: [
      { name: 'Effectiveness', values: { 'Standard (INT roll)': 0, 'Excellent (+1)': 2, 'Superb (+2)': 4 } }
    ]
  },
];

export const POWERS_LIBRARY = [
  { 
    name: 'Absorption', 
    description: 'Absorb incoming energy or physical damage.', 
    fixedBaseCost: 0, perUnitCost: 5, unitName: '1d6',
    options: [
      { name: 'Effect', values: { 'Standard': 0, 'Variable Effect (+1/4)': 5, 'Variable Effect (+1/2)': 10 } },
      { name: 'Type', values: { 'One Type (Energy or Physical)': 0, 'Both (+1/2)': 10 } }
    ]
  },
  { 
    name: 'Aid', 
    description: 'Temporarily increase characteristics or powers.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1d6',
    options: [
      { name: 'Range', values: { 'Self/Touch': 0, 'Ranged (+1/2)': 10 } },
      { name: 'Return Rate', values: { 'Standard (5 pts/Turn)': 0, 'Delayed (+1/4)': 5 } }
    ]
  },
  { 
    name: 'Armor (Resistant Protection)', 
    description: 'Provides Resistant Defense (PD and ED).', 
    fixedBaseCost: 0, perUnitCost: 3, unitName: '2 PD/2 ED',
    options: [
      { name: 'Hardened', values: { 'Standard': 0, '1x Hardened': 5, '2x Hardened': 10 } }
    ]
  },
  { 
    name: 'Barrier (Force Wall)', 
    description: 'Creates a transparent wall providing DEF.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1" Wall (2 DEF)',
    options: [
      { name: 'Opacity', values: { 'Transparent': 0, 'Opaque': 5 } }
    ]
  },
  { 
    name: 'Blast (Energy Blast)', 
    description: 'Standard ranged attack dealing Normal Damage.', 
    fixedBaseCost: 0, perUnitCost: 5, unitName: '1d6',
    options: [
      { name: 'SFX', values: { 'Standard': 0, 'Variable SFX (+1/4)': 5 } }
    ]
  },
  { 
    name: 'Clinging', 
    description: 'Walk or crawl on walls and ceilings.', 
    fixedBaseCost: 10, perUnitCost: 0, unitName: 'Fixed',
    options: [
      { name: 'Durability', values: { 'Standard': 0, 'Damage Resisting (+5)': 5 } }
    ]
  },
  { 
    name: 'Damage Resistance', 
    description: 'Converts existing Normal Defense into Resistant.', 
    fixedBaseCost: 0, perUnitCost: 0.5, unitName: '1 pt of PD/ED',
    options: []
  },
  { 
    name: 'Darkness', 
    description: 'Zone that blocks one or more Senses.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1" Radius',
    options: [
      { name: 'Sense Group', values: { 'Single Group': 0, 'Two Groups (+10)': 10 } }
    ]
  },
  { 
    name: 'Desolidification', 
    description: 'Intangible, passing through solid objects.', 
    fixedBaseCost: 40, perUnitCost: 0, unitName: 'Fixed',
    options: [
      { name: 'Real World Impact', values: { 'Standard (Cannot Attack)': 0, 'Affects Real World (+20)': 20 } }
    ]
  },
  { 
    name: 'Drain', 
    description: 'Temporarily reduces target stats.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1d6',
    options: []
  },
  { 
    name: 'Entangle', 
    description: 'Traps a target in place.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1d6',
    options: [
      { name: 'Block Senses', values: { 'None': 0, 'Blocks Sight (+5)': 5, 'Blocks All Senses (+10)': 10 } }
    ]
  },
  { 
    name: 'Flight', 
    description: 'Move through the air.', 
    fixedBaseCost: 0, perUnitCost: 2, unitName: '1"',
    options: [
      { name: 'Non-Combat Multiple', values: { 'x2 (Standard)': 0, 'x4 (+5)': 5, 'x8 (+10)': 10, 'x16 (+15)': 15 } },
      { name: 'Versatility', values: { 'Air Only': 0, 'Usable Underwater (+5)': 5 } }
    ]
  },
  { 
    name: 'Force Field', 
    description: 'Visible PD and ED defenses. Costs END.', 
    fixedBaseCost: 0, perUnitCost: 1, unitName: '1 PD/1 ED',
    options: [
      { name: 'Nature', values: { 'Normal DEF': 0, 'Resistant DEF (+1/2 cost per unit)': 0.5 } }
    ]
  },
  { 
    name: 'Healing', 
    description: 'Restores lost BODY or stats.', 
    fixedBaseCost: 0, perUnitCost: 10, unitName: '1d6',
    options: [
      { name: 'Scope', values: { 'BODY Only': 0, 'Resurrection (+20)': 20 } }
    ]
  },
  { 
    name: 'Invisibility', 
    description: 'Undetectable by Senses.', 
    fixedBaseCost: 20, perUnitCost: 0, unitName: 'Fixed',
    options: [
      { name: 'Fringe', values: { 'Visible Fringe': 0, 'No Fringe (+10)': 10 } }
    ]
  },
  { 
    name: 'Killing Attack (Ranged)', 
    description: 'Ranged attack dealing Killing Damage.', 
    fixedBaseCost: 0, perUnitCost: 15, unitName: '1d6',
    options: []
  },
  { 
    name: 'Regeneration', 
    description: 'Restores BODY over time.', 
    fixedBaseCost: 10, perUnitCost: 5, unitName: 'Step',
    options: [
      { name: 'Limbs', values: { 'No Limb Regrowth': 0, 'Heals Limbs (+5)': 5 } }
    ]
  },
  { 
    name: 'Telekinesis', 
    description: 'Move objects from a distance.', 
    fixedBaseCost: 0, perUnitCost: 1.5, unitName: '1 STR',
    options: [
      { name: 'Manipulation', values: { 'Crude': 0, 'Fine Manipulation (+10)': 10 } }
    ]
  },
  { 
    name: 'Teleportation', 
    description: 'Instantaneous travel.', 
    fixedBaseCost: 0, perUnitCost: 2, unitName: '1"',
    options: [
      { name: 'Safeguard', values: { 'Risky (Standard)': 0, 'Safe Blind Teleport (+5)': 5 } }
    ]
  },
];

export const DISAD_CATEGORIES = [
  { 
    name: 'Psychological Limitation', 
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { 'Uncommon': 5, 'Common': 10, 'Very Common': 15 } }, 
      { name: 'Intensity', values: { 'Moderate': 0, 'Strong': 5, 'Total': 10 } }
    ], 
    examples: [
      { name: 'Code Against Killing', options: { Frequency: 'Very Common', Intensity: 'Strong' } }, 
      { name: 'Code of Honor', options: { Frequency: 'Common', Intensity: 'Strong' } }, 
      { name: 'Protective of Innocents', options: { Frequency: 'Very Common', Intensity: 'Strong' } },
      { name: 'Fear of Heights', options: { Frequency: 'Common', Intensity: 'Strong' } }
    ] 
  },
  { 
    name: 'Social Limitation', 
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { 'Occasionally': 5, 'Frequently': 10, 'Very Frequently': 15 } }, 
      { name: 'Severity', values: { 'Minor': 0, 'Major': 5 } }
    ], 
    examples: [
      { name: 'Secret Identity', options: { Frequency: 'Frequently', Severity: 'Major' } }, 
      { name: 'Public Identity', options: { Frequency: 'Frequently', Severity: 'Minor' } }
    ] 
  },
  { 
    name: 'Physical Limitation', 
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { 'Infrequently': 5, 'Frequently': 10, 'All the Time': 15 } }, 
      { name: 'Severity', values: { 'Slightly': 0, 'Greatly': 5, 'Fully': 10 } }
    ], 
    examples: [
      { name: 'Blind', options: { Frequency: 'All the Time', Severity: 'Fully' } }, 
      { name: 'One Arm', options: { Frequency: 'All the Time', Severity: 'Greatly' } }
    ] 
  },
  { 
    name: 'Distinctive Features',
    baseCost: 0,
    options: [
      { name: 'Concealability', values: { 'Easily Concealed': 5, 'Concealable with Effort': 10, 'Not Concealable': 15 } },
      { name: 'Reaction', values: { 'Noticed and Recognizable': 0, 'Prejudiced/Fearful': 5, 'Extreme Reaction': 10 } }
    ],
    examples: [
      { name: 'Glowing Eyes', options: { Concealability: 'Concealable with Effort', Reaction: 'Noticed and Recognizable' } },
      { name: 'Mutation', options: { Concealability: 'Concealable with Effort', Reaction: 'Prejudiced/Fearful' } }
    ]
  },
  { 
    name: 'Enraged / Berserk',
    baseCost: 0,
    options: [
      { name: 'Occurrence', values: { '8-': 5, '11-': 10, '14-': 15 } },
      { name: 'Recovery', values: { '14-': 0, '11-': 5, '8-': 10 } },
      { name: 'State', values: { 'Enraged': 0, 'Berserk': 10 } }
    ],
    examples: [
      { name: 'Combat Berserker', options: { Occurrence: '11-', Recovery: '11-', State: 'Berserk' } }
    ]
  },
  { 
    name: 'Hunted', 
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { '8-': 5, '11-': 10, '14-': 15 } }, 
      { name: 'Power', values: { 'As Powerful': 0, 'More Powerful': 5, 'Much More Powerful': 10 } }, 
      { name: 'Attitude', values: { 'Watching': 0, 'Harshly Punish': 5, 'Kill': 10 } }
    ], 
    examples: [
      { name: 'Local Police Force', options: { Frequency: '8-', Power: 'Much More Powerful', Attitude: 'Harshly Punish' } }
    ] 
  },
  {
    name: 'Susceptibility',
    baseCost: 0,
    options: [
      { name: 'Condition', values: { 'Uncommon': 5, 'Common': 10, 'Very Common': 15 } },
      { name: 'Damage', values: { '1d6 STUN per Turn': 0, '2d6 STUN per Turn': 5, '1d6 STUN per Phase': 10, '3d6 STUN per Turn': 10 } }
    ],
    examples: [
      { name: 'Allergy: Kryptonite', options: { Condition: 'Uncommon', Damage: '3d6 STUN per Turn' } }
    ]
  },
  {
    name: 'Vulnerability',
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { 'Uncommon': 5, 'Common': 10, 'Very Common': 15 } },
      { name: 'Multiplier', values: { 'x1.5 STUN': 0, 'x2 STUN': 5, 'x1.5 BODY': 5, 'x2 BODY': 10 } }
    ],
    examples: [
      { name: 'Magic Vulnerability', options: { Frequency: 'Common', Multiplier: 'x2 STUN' } }
    ]
  },
  {
    name: 'Dependency',
    baseCost: 0,
    options: [
      { name: 'Frequency', values: { '1 Day': 5, '6 Hours': 10, '1 Hour': 15, '20 Minutes': 20 } },
      { name: 'Substance', values: { 'Common': 0, 'Uncommon': 5, 'Very Rare': 10 } },
      { name: 'Effect', values: { 'Weakness (-3 to Stats)': 0, 'Damage (1d6/time increment)': 5, 'Incompetence (All rolls 8-)': 10 } }
    ]
  },
  {
    name: 'Accidental Change',
    baseCost: 0,
    options: [
      { name: 'Occurrence', values: { '8-': 5, '11-': 10, '14-': 15 } },
      { name: 'Trigger', values: { 'Common': 0, 'Uncommon': 5, 'Rare': 10 } }
    ]
  }
];

export const SAMPLE_ADVANTAGES = [
  { name: 'Armor Piercing', value: 0.5, description: 'Halves target defenses' },
  { name: 'Area Of Effect (Radius)', value: 1.0, description: 'Affects circular area' },
  { name: 'Area Of Effect (Cone)', value: 1.0, description: 'Affects cone area' },
  { name: 'Autofire (5 shots)', value: 0.5, description: 'Fire multiple times in one phase' },
  { name: 'Continuous', value: 1.0, description: 'Effect lasts across phases without action' },
  { name: 'Explosion', value: 0.5, description: 'Damage drops with distance' },
  { name: 'Hardened', value: 0.25, description: 'Resists Armor Piercing/Penetrating' },
  { name: 'Indirect', value: 0.5, description: 'Attacks from non-standard angles' },
  { name: 'Invisible Power Effects', value: 0.5, description: 'Sense group cannot detect use' },
  { name: 'No END Cost', value: 0.5, description: 'Power does not consume END' },
  { name: 'Penetrating', value: 0.5, description: 'Deals minimum damage thru defenses' },
  { name: 'Reduced Endurance (0 END)', value: 0.5, description: 'Uses zero END' },
  { name: 'Sticky', value: 0.5, description: 'Effect spreads to those who touch target' },
  { name: 'Trigger', value: 0.25, description: 'Power activates on specific condition' },
  { name: 'Uncontrolled', value: 0.5, description: 'Stays active without character effort' },
  { name: 'Variable SFX', value: 0.5, description: 'Can change elemental type' },
];

export const SAMPLE_LIMITATIONS = [
  { name: 'OAF (Obvious Accessible Focus)', value: 1.0, description: 'External device, easily taken' },
  { name: 'OIF (Obvious Inaccessible Focus)', value: 0.5, description: 'Suit or armor, hard to remove' },
  { name: 'IAF (Inobvious Accessible Focus)', value: 0.5, description: 'Concealed item' },
  { name: 'IIF (Inobvious Inaccessible Focus)', value: 0.25, description: 'Internal implant' },
  { name: 'Concentration (0 DCV)', value: 0.5, description: 'Defenses fall while using' },
  { name: 'Extra Time (Extra Phase)', value: 0.5, description: 'Action takes more time' },
  { name: 'Extra Time (Full Turn)', value: 1.0, description: 'Action takes much more time' },
  { name: 'Gestures', value: 0.25, description: 'Requires physical movement' },
  { name: 'Incantations', value: 0.25, description: 'Requires speaking aloud' },
  { name: 'Limited Power', value: 0.5, description: 'Generic limitation for odd rules' },
  { name: 'No Range', value: 0.5, description: 'Attack only works in melee' },
  { name: 'Only in Heroic Identity', value: 0.25, description: 'Requires secret identity shift' },
  { name: 'Reduced Penetration', value: 0.25, description: 'Damage split vs defenses' },
  { name: 'Requires a Skill Roll', value: 0.5, description: 'Must roll to activate' },
  { name: 'Restrainable', value: 0.5, description: 'Stopped by Grabs or Entangles' },
  { name: 'Side Effects', value: 0.5, description: 'Automatic negative effect on user' },
  { name: 'Unified Power', value: 0.25, description: 'Multiple powers drained as one' },
];