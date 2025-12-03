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

async function getPuzzleData(filePath: string): Promise<PuzzleData> {
  const absolutePath = path.resolve(filePath);
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  return yaml.load(fileContents) as PuzzleData;
}

function maximizeNumber(bank: string, numberSize: number = 2): number {
  // finds the maximum number that can be formed from single digits in the bank string without sorting
  // e.g. "12345" -> 45 when numberSize = 2
  // e.g. "189273" -> 973 when numberSize = 3
  // Backtracking approach (inefficient): exponential in numberSize
  // Greedy approach: at each step, pick the largest digit that leaves enough digits remaining
  const digits = bank.split('').map(d => parseInt(d, 10));
  const n = digits.length;
  
  if (numberSize > n) return -1;
  
  const result: number[] = [];
  let startIndex = 0;
  
  for (let i = 0; i < numberSize; i++) {
    // We need to pick (numberSize - i) more digits
    // So we can look from startIndex up to (n - (numberSize - i - 1) - 1)
    const maxIndex = n - (numberSize - i - 1) - 1;
    
    let bestDigit = -1;
    let bestIndex = startIndex;
    
    for (let j = startIndex; j <= maxIndex; j++) {
      if (digits[j] > bestDigit) {
        bestDigit = digits[j];
        bestIndex = j;
      }
    }
    
    result.push(bestDigit);
    startIndex = bestIndex + 1;
  }
  
  return parseInt(result.join(''), 10);
}

function solvePart1(data: string[]): number {
  let totalMax = 0;
  for (const bank of data) {
    totalMax += maximizeNumber(bank);
  }
  return totalMax;
}

function solvePart2(data: string[]): number {
  let totalMax = 0;
  for (const bank of data) {
    totalMax += maximizeNumber(bank, 12);
  }
  return totalMax;
}

async function main() {
  const puzzleData = await getPuzzleData(path.join(import.meta.dirname, 'data.yml'));
  // Part 1
  {
    const testResult = solvePart1(puzzleData.part1.test.data);
    console.log(`Part 1 Test Result: ${testResult} (expected: ${puzzleData.part1.test.expected})`);
    const actualResult = solvePart1(puzzleData.part1.actual.data);
    console.log(`Part 1 Actual Result: ${actualResult}`);
  }
  // Part 2
  {
    const testResult = solvePart2(puzzleData.part2.test.data);
    console.log(`Part 2 Test Result: ${testResult} (expected: ${puzzleData.part2.test.expected})`);
    const actualResult = solvePart2(puzzleData.part2.actual.data);
    console.log(`Part 2 Actual Result: ${actualResult}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});