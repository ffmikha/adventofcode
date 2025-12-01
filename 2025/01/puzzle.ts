import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

interface PuzzleData {
  part1: {
    test: { data: string[]; expected: number };
    actual: { data: string[] };
  };
  part2: {
    test: { data: string[]; expected: number };
    actual: { data: string[] };
  };
}

const DIAL_START = 50;
const DIAL_SIZE = 100;

async function getPuzzleData(filePath: string): Promise<PuzzleData> {
  const absolutePath = path.resolve(filePath);
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  return yaml.load(fileContents) as PuzzleData;
}

function parseMove(line: string): { direction: number; moves: number } {
  const direction = line.charAt(0) === 'L' ? -1 : 1;
  const moves = parseInt(line.slice(1), 10);
  return { direction, moves };
}

function normalizePosition(pos: number): number {
  const result = pos % DIAL_SIZE;
  return result < 0 ? DIAL_SIZE + result : result;
}

function solvePart1(data: string[]): number {
  let count0 = 0;
  let position = DIAL_START;

  for (const line of data) {
    const { direction, moves } = parseMove(line);
    position = normalizePosition(position + direction * moves);
    if (position === 0) count0++;
  }

  return count0;
}

function solvePart2(data: string[]): number {
  let count0 = 0;
  let position = DIAL_START;

  for (const line of data) {
    const { direction, moves } = parseMove(line);

    // Count full rotations
    count0 += Math.floor(moves / DIAL_SIZE);

    // Handle remaining moves
    const remainingMoves = moves % DIAL_SIZE;
    const newRawPosition = position + direction * remainingMoves;

    // Count crossing zero (but not if we land on it or start from it)
    const crossedZero = newRawPosition < 0 || newRawPosition >= DIAL_SIZE;
    const landsOnZero = normalizePosition(newRawPosition) === 0;

    if (crossedZero && !landsOnZero && position !== 0) {
      count0++;
    }

    position = normalizePosition(newRawPosition);
    if (position === 0) count0++;
  }

  return count0;
}

async function main() {
  const puzzleData = await getPuzzleData(path.join(import.meta.dirname, 'data.yml'));

  console.log('Part 1:');
  if (puzzleData.part1.test) {
    const result = solvePart1(puzzleData.part1.test.data);
    console.log(`  Test: ${result} (expected: ${puzzleData.part1.test.expected})`);
  }
  if (puzzleData.part1.actual) {
    console.log(`  Actual: ${solvePart1(puzzleData.part1.actual.data)}`);
  }

  console.log('Part 2:');
  if (puzzleData.part2.test) {
    const result = solvePart2(puzzleData.part2.test.data);
    console.log(`  Test: ${result} (expected: ${puzzleData.part2.test.expected})`);
  }
  if (puzzleData.part2.actual) {
    console.log(`  Actual: ${solvePart2(puzzleData.part2.actual.data)}`);
  }
}

main().catch(console.error);
