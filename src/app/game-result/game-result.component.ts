import { Component, computed, input, output, Signal } from "@angular/core";
import { GameResult } from "../interfaces/game-result";
import { MathProblemDifficulty, MathProblemType } from "../interfaces/math-problem";

interface ProblemCounter {
    correct: number,
    fail: number,
    total: number,
    correctPercentage: number
}

interface AllProblemCounters {
    all: ProblemCounter,
    types: Record<keyof typeof MathProblemType, ProblemCounter>
}

@Component({
    selector: 'game-result',
    templateUrl: './game-result.component.html',
    styleUrl: './game-result.component.css'
})
export class GameResultComponent {
    gameResultInput = input<GameResult>({
        timeLimitMinutes: 10,
        timeTakenMinutes: 10,
        difficulty: MathProblemDifficulty.EASY,
        numProblems: 10,
        tries: 30,
        mode: 'blitz',
        problemsCounter: {
            MULT: { correct: 10, fail: 10 },
            SUB: { correct: 10, fail: 10 },
            ADD: { correct: 10, fail: 10 },
            DIV: { correct: 10, fail: 10 },
        }
    })
    allProblemCountersVal: Signal<AllProblemCounters> = computed(() => {
        const totMult = this.gameResultInput().problemsCounter.MULT.correct + this.gameResultInput().problemsCounter.MULT.fail
        const totDiv = this.gameResultInput().problemsCounter.DIV.correct + this.gameResultInput().problemsCounter.DIV.fail
        const totAdd = this.gameResultInput().problemsCounter.ADD.correct + this.gameResultInput().problemsCounter.ADD.fail
        const totSub = this.gameResultInput().problemsCounter.SUB.correct + this.gameResultInput().problemsCounter.SUB.fail
        const tot = totMult + totDiv + totSub + totAdd
        const correctTot = Object.values(this.gameResultInput().problemsCounter).reduce((p, c) => p + c.correct, 0)

        const makePercentage = (c: number, t: number) => {
            if(t == 0) return 100
            return this.roundTwoDecimals((c / t) * 100)
        }

        return {
            all: {
                correct: correctTot,
                fail: tot - correctTot, 
                total: tot, 
                correctPercentage: makePercentage(correctTot, tot)
            },
            types: {
                MULT: {
                    ...this.gameResultInput().problemsCounter.MULT,
                    total: totMult,
                    correctPercentage: makePercentage(this.gameResultInput().problemsCounter.MULT.correct, totMult)
                },
                DIV: {
                    ...this.gameResultInput().problemsCounter.DIV,
                    total: totDiv,
                    correctPercentage: makePercentage(this.gameResultInput().problemsCounter.DIV.correct, totDiv)
                },
                SUB: {
                    ...this.gameResultInput().problemsCounter.SUB,
                    total: totSub,
                    correctPercentage: makePercentage(this.gameResultInput().problemsCounter.SUB.correct, totSub)
                },
                ADD: {
                    ...this.gameResultInput().problemsCounter.ADD,
                    total: totAdd,
                    correctPercentage: makePercentage(this.gameResultInput().problemsCounter.ADD.correct, totAdd)
                },
            }
        }
    })
    displayTime = computed(() => {
        const seconds = this.gameResultInput().timeTakenMinutes * 60
        const minutes = Math.floor(seconds / 60)
        const left = seconds - (minutes * 60)
        return (minutes > 0 ? `${minutes}m` : '').concat(` ${left}s`)
    })
    secondsPerProblem = computed(() => {
        const seconds = this.gameResultInput().timeTakenMinutes * 60
        const totProblems = this.allProblemCountersVal().all.correct
        return this.roundTwoDecimals(seconds / totProblems)
    })

    onPlayAgain = output()
    
    playAgain() {
        this.onPlayAgain.emit()
    }

    roundTwoDecimals(n: number) {
        return Math.round(n * 100) / 100
    }

}