import * as speedMath from './speed-math';
import * as patternMatch from './pattern-match';
import * as memoryGrid from './memory-grid';
import * as colorMatch from './color-match';

const allGames = [speedMath, patternMatch, memoryGrid, colorMatch];

export function getGames() {
  return allGames.map(g => g.metadata);
}

export function getGameById(gameId) {
  const game = allGames.find(g => g.metadata.id === gameId);
  return game || null;
}

export function getDailyChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % allGames.length;
  return allGames[index].metadata;
}
