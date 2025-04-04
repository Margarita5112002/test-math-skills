import { MathProblemType } from "./math-problem";
import { MathProblemCounters, ProblemCounter } from "./problem-counters";

export function assertMathProblemCounters(obj: unknown): asserts obj is MathProblemCounters {
    if (typeof obj !== 'object' || obj === null)
        throw new TypeError(`Fail to assert MathProblemCounters. ${obj} is not an object`)

    const mathProblemKeys = Object.keys(MathProblemType) as Array<keyof typeof MathProblemType>;

    for (const key of mathProblemKeys) {
        if (!(key in obj))
            throw new TypeError(`Fail to assert MathProblemCounters. ${obj} don't have ${key} property`)

        const counter = (obj as Record<string, unknown>)[key];
        if (
            typeof counter !== 'object' ||
            counter === null ||
            typeof (counter as ProblemCounter).correct !== 'number' ||
            typeof (counter as ProblemCounter).fail !== 'number'
        ) {
            throw new TypeError(`Fail to assert MathProblemCounters. ${obj}.${key} is not an object or lacks properties`)
        }

        if (
            (counter as ProblemCounter).correctPercentage != undefined &&
            typeof (counter as ProblemCounter).correctPercentage != "number"
        )
            throw new TypeError(`Fail to assert MathProblemCounters. ${obj}.${key}.correctPercentage is not a number`)

        if (
            (counter as ProblemCounter).total != undefined &&
            typeof (counter as ProblemCounter).total != "number"
        )
            throw new TypeError(`Fail to assert MathProblemCounters. ${obj}.${key}.total is not a number`)

    }

}