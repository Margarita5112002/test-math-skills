export interface GameSetupSettings {
    difficulty: 'easy' | 'mid' | 'hard',
    mode: 'blitz' | 'zen',
    timeLimitMinutes: number,
    numProblems: number
}
