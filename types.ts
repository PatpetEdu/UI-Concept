
export type CardData = {
  artist: string;
  title: string;
  year: number;
  spotifyUrl: string;
  albumArt?: string;
};

export type Player = {
  name: string;
  timeline: number[];
  cards: CardData[];
  startYear: number;
  stars: number;
};

export type GameCategory = 'default' | 'svenska' | 'eurovision' | 'rock' | 'onehitwonder';

export type GameMode = 'menu' | 'duo-setup' | 'duo' | 'single';

export interface ActiveGameMeta {
  id: string;
  player1: string;
  player2: string;
  p1Score: number;
  p2Score: number;
  category: GameCategory;
  updatedAt: number;
}
