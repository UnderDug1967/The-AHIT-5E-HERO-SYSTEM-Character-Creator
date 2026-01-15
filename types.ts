export type CharacterType = 'Normal' | 'Heroic' | 'Superheroic';

export interface CampaignTier {
  name: string;
  basePoints: number;
  maxDisadPoints: number;
}

export interface Characteristics {
  STR: number;
  DEX: number;
  CON: number;
  BODY: number;
  INT: number;
  EGO: number;
  PRE: number;
  COM: number;
}

export interface FiguredCharacteristics {
  PD: number;
  ED: number;
  SPD: number;
  REC: number;
  END: number;
  STUN: number;
}

export interface Skill {
  id: string;
  name: string;
  type: string;
  characteristic: keyof Characteristics | 'None';
  baseCost: number;
  pointsAdded: number;
  rollBonus: number;
  isEveryman?: boolean;
  specialization?: string;
  specializationName?: string;
  isFamiliarity?: boolean;
  requiresSpecialization?: boolean;
  specializations?: string[];
  isAK?: boolean;
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  cost: number;
  notes: string;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  cost: number;
  notes: string;
}

export interface Modifier {
  id: string;
  name: string;
  value: number;
  description?: string;
  detail?: string;
}

export interface PowerOption {
  id: string;
  name: string;
  cost: number;
  isActive: boolean;
  description?: string;
}

export interface Power {
  id: string;
  name: string;
  customName: string;
  description: string;
  level: number;
  perUnitCost: number;
  unitName: string;
  fixedBaseCost: number;
  options: PowerOption[];
  advantages: Modifier[];
  limitations: Modifier[];
  notes: string;
}

export interface Disadvantage {
  id: string;
  category: string;
  name: string;
  details: string;
  value: number;
}

export interface Character {
  name: string;
  alias: string;
  player: string;
  tier: string;
  concept: string;
  characteristics: Characteristics;
  figuredBonuses: FiguredCharacteristics;
  skills: Skill[];
  perks: Perk[];
  talents: Talent[];
  powers: Power[];
  disadvantages: Disadvantage[];
}