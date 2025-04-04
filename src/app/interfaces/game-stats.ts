import { GameSetupSettings } from "./game-setup-settings"
import { MathProblemCounters } from "./problem-counters"

export interface GameStats {
    gameSettings: GameSetupSettings,
    timePlayedMinutes: number,
    gamesPlayed: number, 
    averageTimePerProblemSeconds: number
    record: number, // refers to the smaller average time per problem that has been archive in a game
    problems: MathProblemCounters
}