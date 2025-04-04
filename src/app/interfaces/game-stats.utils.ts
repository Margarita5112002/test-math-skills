import { assertGameSetupSettings } from "./game-setup-settings.utils"
import { GameStats } from "./game-stats"
import { assertMathProblemCounters } from "./problem-counters.utils"

export function assertGameStats(value: unknown): asserts value is GameStats {
    if (!value || typeof value != 'object')
        throw new TypeError(`Fail to assert GameStat type. ${value} is not an object`)
    if (!("gameSettings" in value))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have gameSettings property`)
    if (!("timePlayedMinutes" in value && typeof value.timePlayedMinutes == "number"))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have timePlayedMinutes property or is not a number`)
    if (!("gamesPlayed" in value && typeof value.gamesPlayed == "number"))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have gamesPlayed property or is not a number`)
    if (!("averageTimePerProblemSeconds" in value && typeof value.averageTimePerProblemSeconds == "number"))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have averageTimePerProblemSeconds property or is not a number`)
    if (!("record" in value && typeof value.record == "number"))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have record property or is not a number`)
    if (!("problems" in value))
        throw new TypeError(`Fail to assert GameStat type. ${value} don't have problems property`)

    assertGameSetupSettings(value.gameSettings)
    assertMathProblemCounters(value.problems)
}