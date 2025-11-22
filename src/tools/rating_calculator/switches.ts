import ratings from './data/ratings.json';

export function Aptitudes(aptitude: string): string {
  switch (true) {
    case aptitude === 'S':
    case aptitude === 'A':
      return 'S-A';
    case aptitude === 'B':
    case aptitude === 'C':
      return 'B-C';
    case aptitude === 'D':
    case aptitude === 'E':
    case aptitude === 'F':
      return 'D-E-F';
    case aptitude === 'G':
    default:
      return 'G';
  }
}

export interface RatingResult {
  rating: string;
  next_rank: number;
}

export function Rating(score: number): RatingResult {
  let previousThreshold: number = 0;

  for (let i = 0; i < ratings.length; i++) {
    const [rating, threshold] = ratings[i] as [string, number];

    if (score >= threshold) {
      const next_rank = previousThreshold - score;
      return { rating, next_rank };
    }
    previousThreshold = threshold;
  }

  return { rating: 'G', next_rank: 300 };
}
