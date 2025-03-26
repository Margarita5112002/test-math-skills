import { Injectable } from '@angular/core';
import { RandomNumberGeneratorService } from '../utils/random-number-generator.service';
import { MathProblem, MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem';

@Injectable({
    providedIn: 'root'
})
export class MathProblemService {

    constructor(private numberGenerator: RandomNumberGeneratorService) { }

    getAddProblem(difficulty: MathProblemDifficulty): MathProblem {
        let operand1 = 0
        let operand2 = 0
        switch (difficulty) {
            case MathProblemDifficulty.EASY:
                operand1 = this.numberGenerator.getRandomInRange(2, 50)
                operand2 = this.numberGenerator.getRandomInRange(2, 50)
                break;
            case MathProblemDifficulty.MID:
                operand1 = this.numberGenerator.getRandomInRange(2, 500)
                operand2 = this.numberGenerator.getRandomInRange(2, 500)
                break;
            case MathProblemDifficulty.HARD:
                operand1 = this.numberGenerator.getRandomInRange(500, 100000)
                operand2 = this.numberGenerator.getRandomInRange(500, 100000)
                break;
        }
        return {
            solution: operand1 + operand2,
            operand1, operand2, difficulty,
            type: MathProblemType.ADD
        }
    }

    getSubProblem(difficulty: MathProblemDifficulty): MathProblem {
        let operand1 = 0
        let operand2 = 0
        switch (difficulty) {
            case MathProblemDifficulty.EASY:
                operand1 = this.numberGenerator.getRandomInRange(2, 50)
                operand2 = this.numberGenerator.getRandomInRange(2, 50)
                break;
            case MathProblemDifficulty.MID:
                operand1 = this.numberGenerator.getRandomInRange(2, 500)
                operand2 = this.numberGenerator.getRandomInRange(2, 500)
                break;
            case MathProblemDifficulty.HARD:
                operand1 = this.numberGenerator.getRandomInRange(500, 100000)
                operand2 = this.numberGenerator.getRandomInRange(500, 100000)
                break;
        }
        return {
            solution: operand1 - operand2,
            operand1, operand2, difficulty,
            type: MathProblemType.SUB
        }
    }

    getMultProblem(difficulty: MathProblemDifficulty): MathProblem {
        let operand1 = 0
        let operand2 = 0
        switch (difficulty) {
            case MathProblemDifficulty.EASY:
                operand1 = this.numberGenerator.getRandomInRange(2, 12)
                operand2 = this.numberGenerator.getRandomInRange(2, 12)
                break;
            case MathProblemDifficulty.MID:
                operand1 = this.numberGenerator.getRandomInRange(2, 30)
                operand2 = this.numberGenerator.getRandomInRange(2, 30)
                break;
            case MathProblemDifficulty.HARD:
                operand1 = this.numberGenerator.getRandomInRange(100, 1000)
                operand2 = this.numberGenerator.getRandomInRange(3, 99)
                break;
        }
        return {
            solution: operand1 * operand2,
            operand1, operand2, difficulty,
            type: MathProblemType.MULT
        }
    }

    getDivProblem(difficulty: MathProblemDifficulty): MathProblem {
        let operand1 = 0
        let operand2 = 0
        switch (difficulty) {
            case MathProblemDifficulty.EASY:
                operand1 = this.numberGenerator.getRandomInRange(10, 100)
                operand2 = this.numberGenerator.getRandomInRange(2, 10)
                break;
            case MathProblemDifficulty.MID:
                operand1 = this.numberGenerator.getRandomInRange(30, 500)
                operand2 = this.numberGenerator.getRandomInRange(2, 30)
                break;
            case MathProblemDifficulty.HARD:
                operand1 = this.numberGenerator.getRandomInRange(300, 50000)
                operand2 = this.numberGenerator.getRandomInRange(2, 300)
                break;
        }
        if(operand1 % operand2 != 0) {
            operand1 = Math.ceil(operand1 / operand2) * operand2
        }
        return {
            solution: operand1 / operand2,
            operand1, operand2, difficulty,
            type: MathProblemType.DIV
        }
    }

    getMathProblem(type: MathProblemType, difficulty: MathProblemDifficulty): MathProblem {
        switch (type) {
            case MathProblemType.ADD:
                return this.getAddProblem(difficulty)
            case MathProblemType.SUB:
                return this.getSubProblem(difficulty)
            case MathProblemType.MULT:
                return this.getMultProblem(difficulty)
            case MathProblemType.DIV:
                return this.getDivProblem(difficulty)
        }
    }

    getRandomMathProblem(difficulty: MathProblemDifficulty): MathProblem {
        const all = Object.values(MathProblemType)
        const random = this.numberGenerator.getRandomInRange(0, 3)
        return this.getMathProblem(all[random], difficulty)
    }

}
