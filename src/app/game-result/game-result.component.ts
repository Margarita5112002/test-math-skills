import { Component, computed, effect, inject, input, output, Signal } from "@angular/core";
import { GameResult } from "../interfaces/game-result";
import { MathProblemDifficulty, MathProblemType } from "../interfaces/math-problem";
import { AllProblemCounters } from "../interfaces/problem-counters";
import { GameStatsService } from "../game-stats/game-stats.service";

@Component({
    selector: 'game-result',
    templateUrl: './game-result.component.html',
    styleUrl: './game-result.component.css'
})
export class GameResultComponent {
    gameResultInput = input<GameResult>({
        settings: {
            mode: 'blitz',
            difficulty: MathProblemDifficulty.EASY,
            timeLimitMinutes: 10,
        },
        timeTakenMinutes: 10,
        tries: 30,
        problemsCounter: {
            MULT: { correct: 10, fail: 10 },
            SUB: { correct: 10, fail: 10 },
            ADD: { correct: 10, fail: 10 },
            DIV: { correct: 10, fail: 10 },
        }
    })
    allProblemCountersVal: Signal<AllProblemCounters> = computed(() => {
        this.gameStatsService.setGameResult(this.gameResultInput())
        return this.gameStatsService.allProblemsCounters
    })
    displayTime = computed(() => {
        const seconds = this.gameResultInput().timeTakenMinutes * 60
        const minutes = Math.floor(seconds / 60)
        const left = seconds - (minutes * 60)
        return (minutes > 0 ? `${minutes}m` : '').concat(` ${left}s`)
    })
    secondsPerProblem = computed(() => {
        this.gameResultInput()
        return this.gameStatsService.getAverageSecondsPerProblem()
    })
    private storageGameResultEffect = effect(() => {
        this.gameStatsService.setGameResult(this.gameResultInput())
        const error = this.gameStatsService.storeGameResult()
        console.log("error from game stat service: ", error)
    })

    onPlayAgain = output()

    constructor(private gameStatsService: GameStatsService) {
        gameStatsService.setGameResult(this.gameResultInput())
    }

    playAgain() {
        this.onPlayAgain.emit()
    }

}