import { MathProblemDifficulty } from "./math-problem";

export interface GameSetupZenMode {
    mode: 'zen'
    difficulty: MathProblemDifficulty,
    problemsToFinish: number
}

export interface GameSetupBlitzMode {
    mode: 'blitz'
    difficulty: MathProblemDifficulty,
    timeLimitMinutes: number
}

export type GameSetupSettings = GameSetupBlitzMode | GameSetupZenMode