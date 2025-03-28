import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { MathProblem, MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem';
import { MathProblemService } from '../math-problems/math-problem.service';

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
    currMathProblem = signal<MathProblem>({
        type: MathProblemType.ADD,
        difficulty: MathProblemDifficulty.EASY,
        operand1: 1,
        operand2: 1,
        solution: 2
    })

    correctProblemsCounter = signal(0)
    triesCounter = signal(0)
    failProblems = signal(0)
    remainingTries = signal(3)

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

    onAnswerEnter() {
        if (this.isRight()) {
            this.generateNewProblem()
            this.answer.set(0)
            this.correctProblemsCounter.update(v => v + 1)
            this.hint.set(null)
            this.remainingTries.set(3)
        } else {
            if (this.currMathProblem().solution > this.answer()) {
                this.hint.set('Try a higher number')
            } else if (this.currMathProblem().solution < this.answer()) {
                this.hint.set('Try a lower number')
            }
            this.remainingTries.update(v => v - 1)
            if (this.remainingTries() === 0) { 
                this.hint.set(null) 
                this.failProblems.update(v => v + 1)
            }
        }
        this.triesCounter.update(v => v + 1)
    }

    onContinueButtonPress() {
        this.remainingTries.set(3)
        this.generateNewProblem()
        this.answer.set(0)
    }

}
