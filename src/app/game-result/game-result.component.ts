import { Component, computed, input } from "@angular/core";
import { GameResult } from "../interfaces/game-result";
import { MathProblemDifficulty } from "../interfaces/math-problem";

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
    totalCorrectProblems = computed(() => 
        Object.values(this.gameResultInput().problemsCounter).reduce((p, c) => p + c.correct, 0)
    )
    totalProblems = computed(() => 
        Object.values(this.gameResultInput().problemsCounter).reduce((p, c) => p + c.fail + c.correct, 0)
    )


}