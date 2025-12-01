import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

interface PuzzleData {
  part1: {
    test: { data: number[][]; expected: number };
    actual: { data: number[][] };
  };
  part2: {
    test: { data: number[][]; expected: number };
    actual: { data: number[][] };
  };
}

async function getPuzzleData(filePath: string): Promise<PuzzleData> {
  const absolutePath = path.resolve(filePath);
  const fileContents = await fs.readFile(absolutePath, 'utf-8');
  return yaml.load(fileContents) as PuzzleData;
}

function tuple2columns(tuple: number[]): { col1: number; col2: number } {
  return { col1: tuple[0], col2: tuple[1] };
}

function tupleArray2columnsArray(data: number[][]): { col1: number[]; col2: number[] } {
  return data.map(tuple2columns).reduce((acc, curr) => {
    acc.col1.push(curr.col1);
    acc.col2.push(curr.col2);
    return acc;
  }, { col1: [] as number[], col2: [] as number[] });
}

function columnsArray2tupleArray(data: { col1: number[]; col2: number[] }): number[][] {
  const length = Math.min(data.col1.length, data.col2.length);
  const result: number[][] = [];
  for (let i = 0; i < length; i++) {
    result.push([data.col1[i], data.col2[i]]);
  }
  return result;
}

function computeDistance(tuple: number[]): number {
  return Math.abs(tuple[0] - tuple[1]);
}

function compureSimilarity(element: number, array: number[]): number {
  return element * array.filter(e => e === element).length;
}

function solvePart1(data: number[][]): number {
  const columns = tupleArray2columnsArray(data);
  columns.col1.sort();
  columns.col2.sort();
  const sortedTuples = columnsArray2tupleArray(columns);
  let totalDistance = 0;
  for (const tuple of sortedTuples) {
      totalDistance += computeDistance(tuple);
  }
  return totalDistance;
}

function solvePart2(data: number[][]): number {
  const columns = tupleArray2columnsArray(data);
  let totalSimilarity = 0;
  for (const element of columns.col1) {
    totalSimilarity += compureSimilarity(element, columns.col2);
  }
  return totalSimilarity;
}

async function main() {
  const puzzleData = await getPuzzleData(path.join(import.meta.dirname, 'data.yml'));

  console.log('Part 1');
  if (puzzleData.part1.test) {
    const part1TestResult = solvePart1(puzzleData.part1.test.data);
    console.log(`Part 1 Test Result: ${part1TestResult} (Expected: ${puzzleData.part1.test.expected})`);
  }
  if (puzzleData.part1.actual) {
    const part1ActualResult = solvePart1(puzzleData.part1.actual.data);
    console.log(`Part 1 Actual Result: ${part1ActualResult}`);
  }

  console.log('Part 2');
  if (puzzleData.part2.test) {
    const part2TestResult = solvePart2(puzzleData.part2.test.data);
    console.log(`Part 2 Test Result: ${part2TestResult} (Expected: ${puzzleData.part2.test.expected})`);
  }
  if (puzzleData.part2.actual) {
    const part2ActualResult = solvePart2(puzzleData.part2.actual.data);
    console.log(`Part 2 Actual Result: ${part2ActualResult}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});