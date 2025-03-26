import { Component, input } from "@angular/core";
import { MathProblem, MathProblemDifficulty, MathProblemType } from "../../interfaces/math-problem";

@Component({
    selector: 'math-problem-display',
    template: `<div>
        {{mathProblem().operand1}} {{mathProblem().type}} {{mathProblem().operand2}} = {{mathProblem().solution}}
    </div>`
})
export class MathProblemDisplayComponent {
    mathProblem = input<MathProblem>({
        type: MathProblemType.ADD,
        difficulty: MathProblemDifficulty.EASY,
        operand1: 1,
        operand2: 1,
        solution: 2
    })
}