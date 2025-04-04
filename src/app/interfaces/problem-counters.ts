import { MathProblemType } from "./math-problem"

export interface ProblemCounter {
    correct: number,
    fail: number,
    total?: number,
    correctPercentage?: number
}

export interface AllProblemCounters {
    all: ProblemCounter,
    types: MathProblemCounters
}

export type MathProblemCounters = Record<keyof typeof MathProblemType, ProblemCounter>