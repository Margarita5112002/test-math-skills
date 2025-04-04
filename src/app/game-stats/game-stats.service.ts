import { Injectable } from "@angular/core";
import { GameResult } from "../interfaces/game-result";
import { AllProblemCounters, MathProblemCounters, ProblemCounter } from "../interfaces/problem-counters";
import { GameStats } from "../interfaces/game-stats";
import { assertGameStats } from "../interfaces/game-stats.utils";
import { MathProblemDifficulty } from "../interfaces/math-problem";
import { gameSettingsAreEqual } from "../interfaces/game-setup-settings.utils";

export class GameStatsServiceError extends Error {

}

@Injectable({
    providedIn: 'root'
})
export class GameStatsService {
    private gameResult: GameResult = {
        "settings": {
            "mode": "blitz",
            "difficulty": MathProblemDifficulty.HARD,
            "timeLimitMinutes": 0
        },
        "tries": 0,
        "timeTakenMinutes": 0,
        "problemsCounter": {
            MULT: { correct: 0, fail: 0 },
            DIV: { correct: 0, fail: 0 },
            SUB: { correct: 0, fail: 0 },
            ADD: { correct: 0, fail: 0 }
        }
    }

    allProblemsCounters: AllProblemCounters = {
        "all": { correct: 0, fail: 0 },
        "types": {
            MULT: { correct: 0, fail: 0 },
            DIV: { correct: 0, fail: 0 },
            SUB: { correct: 0, fail: 0 },
            ADD: { correct: 0, fail: 0 },
        }
    }

    setGameResult(result: GameResult) {
        this.allProblemsCounters = this.fillProblemCounters(result.problemsCounter)
        this.gameResult = result
    }

    private fillProblemCounters(counter: MathProblemCounters): AllProblemCounters {
        const totMult = counter.MULT.correct + counter.MULT.fail
        const totDiv = counter.DIV.correct + counter.DIV.fail
        const totAdd = counter.ADD.correct + counter.ADD.fail
        const totSub = counter.SUB.correct + counter.SUB.fail
        const tot = totMult + totDiv + totSub + totAdd
        const correctTot = Object.values(counter).reduce((p, c) => p + c.correct, 0)

        return {
            all: {
                correct: correctTot,
                fail: tot - correctTot,
                total: tot,
                correctPercentage: this.makePercentage(correctTot, tot)
            },
            types: {
                MULT: {
                    ...counter.MULT,
                    total: totMult,
                    correctPercentage: this.makePercentage(counter.MULT.correct, totMult)
                },
                DIV: {
                    ...counter.DIV,
                    total: totDiv,
                    correctPercentage: this.makePercentage(counter.DIV.correct, totDiv)
                },
                SUB: {
                    ...counter.SUB,
                    total: totSub,
                    correctPercentage: this.makePercentage(counter.SUB.correct, totSub)
                },
                ADD: {
                    ...counter.ADD,
                    total: totAdd,
                    correctPercentage: this.makePercentage(counter.ADD.correct, totAdd)
                },
            }
        }
    }

    private convertGameResultToGameStats(): GameStats {
        const averageProblem = this.getAverageSecondsPerProblem()
        return {
            gameSettings: this.gameResult.settings,
            timePlayedMinutes: this.gameResult.timeTakenMinutes,
            gamesPlayed: 1,
            averageTimePerProblemSeconds: averageProblem,
            record: averageProblem,
            problems: this.gameResult.problemsCounter
        }
    }

    private mergeGameStats(newGameStat: GameStats, oldGameStat: GameStats): GameStats {
        const newProblemCounter: MathProblemCounters = {
            MULT: {
                correct: newGameStat.problems.MULT.correct + oldGameStat.problems.MULT.correct,
                fail: newGameStat.problems.MULT.fail + oldGameStat.problems.MULT.fail,
            },
            DIV: {
                correct: newGameStat.problems.DIV.correct + oldGameStat.problems.DIV.correct,
                fail: newGameStat.problems.DIV.fail + oldGameStat.problems.DIV.fail,
            },
            SUB: {
                correct: newGameStat.problems.SUB.correct + oldGameStat.problems.SUB.correct,
                fail: newGameStat.problems.SUB.fail + oldGameStat.problems.SUB.fail,
            },
            ADD: {
                correct: newGameStat.problems.ADD.correct + oldGameStat.problems.ADD.correct,
                fail: newGameStat.problems.ADD.fail + oldGameStat.problems.ADD.fail,
            }
        }
        const newTimePlayedMinutes = newGameStat.timePlayedMinutes + oldGameStat.timePlayedMinutes
        const totProblems = newProblemCounter.ADD.correct + newProblemCounter.DIV.correct + newProblemCounter.MULT.correct + newProblemCounter.SUB.correct
        const average = this.roundTwoDecimals((newTimePlayedMinutes * 60) / totProblems)

        return {
            gameSettings: newGameStat.gameSettings,
            timePlayedMinutes: newTimePlayedMinutes,
            gamesPlayed: newGameStat.gamesPlayed + oldGameStat.gamesPlayed,
            record: Math.min(newGameStat.record, oldGameStat.record),
            averageTimePerProblemSeconds: average,
            problems: newProblemCounter
        }
    }

    roundTwoDecimals(n: number) {
        return Math.round(n * 100) / 100
    }

    makePercentage(c: number, t: number) {
        if (t == 0) return 100
        return this.roundTwoDecimals((c / t) * 100)
    }

    getAverageSecondsPerProblem() {
        const seconds = this.gameResult.timeTakenMinutes * 60
        const totProblems = this.allProblemsCounters.all.correct
        return this.roundTwoDecimals(seconds / totProblems)
    }

    retrieveGameStats(): GameStats[] {
        const val = localStorage.getItem("stats")
        if (!val) return []

        let jsonObj: any
        try {
            jsonObj = JSON.parse(val)
        } catch (e) {
            throw new GameStatsServiceError(`Invalid json store in local storage: ${val}`)
        }

        if (Array.isArray(jsonObj)) {
            jsonObj.forEach(assertGameStats)
            return jsonObj
        }
        throw new GameStatsServiceError(`Invalid game stats store in local storage (it's not an array): ${val}`)
    }

    storeGameResult(): string {
        let error = ""
        let allGameStats: GameStats[] = []
        let iGameStatForSettings: number = -1

        try {
            allGameStats = this.retrieveGameStats()
            iGameStatForSettings = allGameStats.findIndex(gameStat => gameSettingsAreEqual(gameStat.gameSettings, this.gameResult.settings))
        } catch (e) {
            console.error(e)
            localStorage.removeItem("stats")
            error = "The data in local storage is corrupted. It has been cleared."
        }

        const newGameStat = this.convertGameResultToGameStats()
        if (iGameStatForSettings == -1) {
            try {
                localStorage.setItem("stats", JSON.stringify(allGameStats.concat(newGameStat)))
            } catch (e) {
                console.error(e)
                error = "The data could not be stored in local storage. Either local storage is disabled, or there's insufficient space available."
            }
        } else {
            const oldGameStat = allGameStats[iGameStatForSettings]
            allGameStats[iGameStatForSettings] = this.mergeGameStats(newGameStat, oldGameStat)
            try {
                localStorage.setItem("stats", JSON.stringify(allGameStats))
            } catch (e) {
                console.error(e)
                error = "The data could not be stored in local storage. Either local storage is disabled, or there's insufficient space available."
            }
        }

        return error
    }

}