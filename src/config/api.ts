// spura-gui/src/config/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export const api = {
  baseUrl: API_BASE_URL,
  wsBaseUrl: WS_BASE_URL,
  leagues: `${API_BASE_URL}/api/v1/leagues`,
  syncData: (league: string, season: string) =>
    `${API_BASE_URL}/api/v1/data/sync?league=${league}&season=${season}`,
  recalibrate: (league: string) =>
    `${API_BASE_URL}/api/v1/model/recalibrate?league=${league}`,
  predictions: (league: string) =>
    `${API_BASE_URL}/api/v1/predictions/upcoming?league=${league}`,
  playerStats: (playerId: string) =>
    `${API_BASE_URL}/api/v1/players/${playerId}/stats`,
};
