import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { MathProblem, MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem';
import { MathProblemService } from '../math-problems/math-problem.service';
import { GameResult } from '../interfaces/game-result';

@Component({
    selector: 'app-game',
    imports: [FormsModule],
    templateUrl: './game.component.html',
    styleUrl: './game.component.css'
})
export class GameComponent {
    gameSettings = input<GameSetupSettings>({
        difficulty: MathProblemDifficulty.MID,
        mode: 'zen',
        timeLimitMinutes: 3,
        numProblems: 10
    })
    onGameFinish = output<GameResult>()

    currMathProblem = signal<MathProblem>({
        type: MathProblemType.ADD,
        difficulty: MathProblemDifficulty.EASY,
        operand1: 1,
        operand2: 1,
        solution: 2
    })
    problemSign = computed(() => {
        switch (this.currMathProblem().type) {
            case MathProblemType.ADD:
                return "+";
            case MathProblemType.DIV:
                return "/";
            case MathProblemType.MULT:
                return "*";
            case MathProblemType.SUB:
                return "-"
        }
    })

    problemsCounter = signal<GameResult["problemsCounter"]>({
        MULT: { correct: 0, fail: 0 },
        DIV: { correct: 0, fail: 0 },
        SUB: { correct: 0, fail: 0 },
        ADD: { correct: 0, fail: 0 },
    })
    triesCounter = signal(0)
    remainingTries = signal(3)
    correctProblemsCounter = computed(() => {
        return Object.values(this.problemsCounter()).reduce((p, c) => p + c.correct, 0)
    })
    failProblemsCounter = computed(() => {
        return Object.values(this.problemsCounter()).reduce((p, c) => p + c.fail, 0)
    })

    answer = signal(0)
    showAnswer = computed(() => this.remainingTries() === 0)
    isRight = computed(() => {
        if (!this.currMathProblem()) return null
        return this.answer() == this.currMathProblem().solution
    })
    hint = signal<string | null>(null)

    constructor(private problemService: MathProblemService) {
    }

    ngOnInit() {
        this.generateNewProblem()
    }

    generateNewProblem() {
        const randomProblem = this.problemService.getRandomMathProblem(this.gameSettings().difficulty)
        if (!randomProblem) throw new Error("Math problem undefined; return by math problem service")
        this.currMathProblem.set(randomProblem)
    }

    shouldFinishGame() {
        if (this.correctProblemsCounter() >= this.gameSettings().numProblems) {

        }
    }

    addOneToProblem(typeProblem: MathProblemType, addToCorrect: boolean) {
        this.problemsCounter.update((current) => ({
            ...current,
            [typeProblem]: {
                correct: addToCorrect
                    ? current[typeProblem].correct + 1
                    : current[typeProblem].correct,
                fail: addToCorrect
                    ? current[typeProblem].fail
                    : current[typeProblem].fail + 1,
            },
        }));
    }

    onAnswerEnter() {
        this.triesCounter.update(v => v + 1)
        if (this.isRight()) {
            this.addOneToProblem(this.currMathProblem().type, true)
            this.generateNewProblem()
            this.answer.set(0)
            this.hint.set(null)
            this.remainingTries.set(3)
            this.shouldFinishGame()
        } else {
            if (this.currMathProblem().solution > this.answer()) {
                this.hint.set('Try a higher number')
            } else if (this.currMathProblem().solution < this.answer()) {
                this.hint.set('Try a lower number')
            }
            this.remainingTries.update(v => v - 1)
            if (this.remainingTries() === 0) {
                this.hint.set(null)
                this.addOneToProblem(this.currMathProblem().type, false)
            }
        }
    }

    onContinueButtonPress() {
        this.remainingTries.set(3)
        this.generateNewProblem()
        this.answer.set(0)
    }

}
