import { GameSetupSettings } from "./game-setup-settings";

export enum MathProblemType {
    ADD = '+',
    SUB = '-',
    MULT = '*',
    DIV = '/'
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