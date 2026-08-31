// spura-gui/src/config/mockData.ts
export const league = "EPL";

export interface Prediction {
  id: number;
  fixture: string;
  player: string;
  position: string;
  fairOdds: number;
  marketOdds: number;
  ev: number;
}

export const predictions: Record<string, Prediction[]> = {
  EPL: [
    { id: 1, fixture: "Man City vs Arsenal", player: "Erling Haaland", position: "F", fairOdds: 1.65, marketOdds: 1.72, ev: 4.2 },
    { id: 2, fixture: "Liverpool vs Chelsea", player: "Mohamed Salah", position: "F", fairOdds: 2.1, marketOdds: 2.2, ev: 4.8 },
    { id: 3, fixture: "Spurs vs Man Utd", player: "Son Heung-min", position: "F", fairOdds: 2.5, marketOdds: 2.6, ev: 4.0 },
  ],
  SP1: [
    { id: 4, fixture: "Real Madrid vs Atletico", player: "Jude Bellingham", position: "M", fairOdds: 2.3, marketOdds: 2.4, ev: 4.3 },
  ],
  I1: [
    { id: 5, fixture: "Inter vs Juventus", player: "Lautaro Martinez", position: "F", fairOdds: 2.0, marketOdds: 2.1, ev: 5.0 },
  ],
  D1: [
    { id: 6, fixture: "Bayern vs Dortmund", player: "Harry Kane", position: "F", fairOdds: 1.7, marketOdds: 1.75, ev: 2.9 },
  ],
  F1: [
    { id: 7, fixture: "PSG vs Marseille", player: "Kylian Mbappe", position: "F", fairOdds: 1.5, marketOdds: 1.55, ev: 3.3 },
  ],
};
