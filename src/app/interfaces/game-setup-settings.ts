import { MathProblemDifficulty } from "./math-problem";

export interface GameSetupSettings {
    difficulty: MathProblemDifficulty,
    mode: 'blitz' | 'zen',
    timeLimitMinutes: number,
    numProblems: number
}
