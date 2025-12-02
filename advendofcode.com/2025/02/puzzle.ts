import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

interface PuzzleData {
  part1: {
    test: { data: string; expected: number };
    actual: { data: string };
  };
  part2: {
    test: { data: string; expected: number };
    actual: { data: string };
  };
}

async function getPuzzleData(filePath: string): Promise<PuzzleData> {
  const absolutePath = path.resolve(filePath);
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  return yaml.load(fileContents) as PuzzleData;
}

function parseRange(rangeStr: string): { start: number; end: number } {
  const [startStr, endStr] = rangeStr.split('-');
  return { start: parseInt(startStr, 10), end: parseInt(endStr, 10) };
}

function isNumberRepeated(num: number, mustRepeatExactlyTwice: boolean = true): boolean {
  // returns true if num is of the form ABAB ABCABC etc.
  const numStr = num.toString();
    const len = numStr.length;
    for (let subLen = 1; subLen <= Math.floor(len / 2); subLen++) {
      if (len % subLen === 0) {
        const subStr = numStr.slice(0, subLen);
        const repeatCount = len / subLen;
        if (subStr.repeat(repeatCount) === numStr) {
          if (mustRepeatExactlyTwice) {
            if (repeatCount === 2) {
                // console.log(`Found ${num} as ${subStr} repeated ${repeatCount} times`);
                return true;
            }
            continue;
          }
          return true;
        }
      }
    }
    return false;
}

function solvePart1(data: string, mustRepeatExactlyTwice: boolean = true): number {
  const rangeStrs = data.split(',').map(s => s.trim()).filter(s => s.length > 0);
  let sumOfRepeated = 0;

  for (const rangeStr of rangeStrs) {
    const { start, end } = parseRange(rangeStr);
    for (let num = start; num <= end; num++) {
      if (isNumberRepeated(num, mustRepeatExactlyTwice)) {
        sumOfRepeated += num;
      }
    }
  }
  return sumOfRepeated;
}

function solvePart2(data: string): number {
  // In part 2, we consider any repetition (not just exactly twice)
  return solvePart1(data, false);
}

async function main() {
  const puzzleData = await getPuzzleData(path.join(import.meta.dirname, 'data.yml'));

  // Part 1
  console.log('--- Part 1 ---');
  console.log('Test:');
  const part1TestResult = solvePart1(puzzleData.part1.test.data);
  console.log(`Result: ${part1TestResult}, Expected: ${puzzleData.part1.test.expected}`);
  console.log('Actual:');
  const part1ActualResult = solvePart1(puzzleData.part1.actual.data);
  console.log(`Result: ${part1ActualResult}`);

  // Part 2
  console.log('--- Part 2 ---');
  console.log('Test:');
  const part2TestResult = solvePart2(puzzleData.part2.test.data);
  console.log(`Result: ${part2TestResult}, Expected: ${puzzleData.part2.test.expected}`);
  console.log('Actual:');
  const part2ActualResult = solvePart2(puzzleData.part2.actual.data);
  console.log(`Result: ${part2ActualResult}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
