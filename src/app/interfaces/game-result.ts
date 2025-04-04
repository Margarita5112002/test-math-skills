import { GameSetupSettings } from "./game-setup-settings";
import { MathProblemType } from "./math-problem";

export interface GameResult {
    settings: GameSetupSettings
    timeTakenMinutes: number,
    problemsCounter: Record<keyof typeof MathProblemType, {
        correct: number, fail: number
    }>,
    tries: number
}