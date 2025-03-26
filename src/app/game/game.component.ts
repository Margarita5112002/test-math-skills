import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameSetupSettings } from '../interfaces/game-setup-settings';
import { MathProblem, MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem';
import { MathProblemDisplayComponent } from "./math-problem-display/math-problem-display.component";
import { MathProblemService } from '../math-problems/math-problem.service';

@Component({
    selector: 'app-game',
    imports: [FormsModule, MathProblemDisplayComponent],
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

    constructor(private problemService: MathProblemService) {
    }

    ngOnInit() {
        this.currMathProblem.set(this.problemService.getRandomMathProblem(this.gameSettings().difficulty))
    }

}
