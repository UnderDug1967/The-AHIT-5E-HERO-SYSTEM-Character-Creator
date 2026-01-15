
import { Characteristics, FiguredCharacteristics } from './types';

// HERO rounds .5 in favor of the PC. Usually that means rounding UP for stats.
export const heroRound = (num: number): number => {
  const floor = Math.floor(num);
  const remainder = num - floor;
  return remainder >= 0.5 ? Math.ceil(num) : floor;
};

export const calculateFigured = (c: Characteristics): FiguredCharacteristics => {
  // PD: STR/5
  const PD = heroRound(c.STR / 5);
  // ED: CON/5
  const ED = heroRound(c.CON / 5);
  // SPD: 1 + (DEX/10) [Always rounds down per 5e rules pg 6/7]
  const SPD = Math.floor(1 + (c.DEX / 10));
  // REC: (STR/5) + (CON/5)
  const REC = heroRound(c.STR / 5) + heroRound(c.CON / 5);
  // END: 2 * CON
  const END = 2 * c.CON;
  // STUN: BODY + (STR/2) + (CON/2)
  const STUN = c.BODY + heroRound(c.STR / 2) + heroRound(c.CON / 2);

  return { PD, ED, SPD, REC, END, STUN };
};

export const getRoll = (val: number): string => {
  return `${heroRound(9 + val / 5)}-`;
};
