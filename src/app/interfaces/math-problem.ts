export enum MathProblemType {
    ADD = 'ADD',
    SUB = 'SUB',
    MULT = 'MULT',
    DIV = 'DIV'
}

export enum MathProblemDifficulty {
    EASY = 'easy',
    MID = 'mid',
    HARD = 'hard'
}

export interface MathProblem {
    type: MathProblemType,
    operand1: number,
    operand2: number,
    solution: number,
    difficulty: MathProblemDifficulty
}