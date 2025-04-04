import { GameSetupSettings } from "./game-setup-settings";
import { assertMathProblemDifficulty } from "./math-problem.utils";

export function assertGameSetupSettings(value: unknown): asserts value is GameSetupSettings {
    if (!value || typeof value != 'object')
        throw new TypeError(`Fail to assert GameSetupSettings. ${value} is not an object`)

    if (!('difficulty' in value))
        throw new TypeError(`Fail to assert GameSetupSettings. ${value} don't have difficulty property`)

    if (!("mode" in value))
        throw new TypeError(`Fail to assert GameSetupSettings. ${value} don't have mode property`)

    if (value.mode == 'zen' && !("problemsToFinish" in value && typeof value.problemsToFinish == "number"))
        throw new TypeError(`Fail to assert GameSetupSettings. ${value} don't have problemsToFinish property for a zen game or is not a number`)

    if (value.mode == 'blitz' && !("timeLimitMinutes" in value && typeof value.timeLimitMinutes == "number"))
        throw new TypeError(`Fail to assert GameSetupSettings. ${value} don't have timeLimitMinutes property for a blitz game or is not a number`)

    if (value.mode != 'zen' && value.mode != 'blitz')
        throw new TypeError(`Fail to assert GameSetupSettings. Mode is neither zen nor blitz in ${value}`)

    assertMathProblemDifficulty(value.difficulty)
}

export function gameSettingsAreEqual(sets1: GameSetupSettings, sets2: GameSetupSettings): boolean {
    if(sets1.difficulty != sets2.difficulty || sets1.mode != sets1.mode) return false
    if(sets1.mode == 'zen' && sets2.mode == 'zen') {
        return sets1.problemsToFinish == sets2.problemsToFinish
    }
    if(sets1.mode == 'blitz' && sets2.mode == 'blitz') {
        return sets1.timeLimitMinutes == sets2.timeLimitMinutes
    }
    return false
}