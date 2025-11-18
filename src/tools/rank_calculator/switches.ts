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

export function Switches(score: number): string {
  switch (true) {
    case score < 300:
      return 'G';
    case score < 600:
      return 'G+';
    case score < 900:
      return 'F';
    case score < 1300:
      return 'F+';
    case score < 1800:
      return 'E';
    case score < 2300:
      return 'E+';
    case score < 2900:
      return 'D';
    case score < 3500:
      return 'D+';
    case score < 4900:
      return 'C';
    case score < 6500:
      return 'C+';
    case score < 8200:
      return 'B';
    case score < 10000:
      return 'B+';
    case score < 12100:
      return 'A';
    case score < 14500:
      return 'A+';
    case score < 15900:
      return 'S';
    case score < 17500:
      return 'S+';
    case score < 19200:
      return 'SS';
    case score >= 19200:
      return 'SS+';
    default:
      return 'G';
  }
}
