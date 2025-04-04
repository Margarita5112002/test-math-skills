import { MathProblemDifficulty } from "./math-problem";

export function assertMathProblemDifficulty(value: unknown): asserts value is MathProblemDifficulty {
    if (typeof value !== 'string')
        throw new TypeError(`Fail to assert MathProblemDifficulty. ${value} is not a string`)
    const mathProblemKeys = Object.values(MathProblemDifficulty).map(v => v.toString())
    if(!mathProblemKeys.includes(value as keyof typeof MathProblemDifficulty))
        throw new TypeError(`Fail to assert MathProblemDifficulty. ${value} is not a valid MathProblemDifficulty`)
}

export function stringToMathProblemDifficulty(value: string): MathProblemDifficulty {
    if(isMathProblemDifficulty(value)) return value
    throw new TypeError(`Couldn't cast ${value} to MathProblemDifficulty`)
}

export function isMathProblemDifficulty(value: unknown): value is MathProblemDifficulty {
    try {
        assertMathProblemDifficulty(value)
        return true
    } catch(e) {
        return false
    }
}
