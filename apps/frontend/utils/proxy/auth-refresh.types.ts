export interface RefreshResult {
  newAccessToken: string;
  newRefreshToken: string;
}

export interface RefreshCache extends RefreshResult {
  oldRefreshToken: string;
  timestamp: number;
}
