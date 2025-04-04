import { gameSettingsAreEqual } from "./game-setup-settings.utils"
import { MathProblemDifficulty } from "./math-problem"

describe("Game setup settings utils", () => {
    describe('gameSettingsAreEqual', () => {
        it('should return true if two settings are equal', () => {
            const result = gameSettingsAreEqual({
                "mode": 'blitz',
                "difficulty": MathProblemDifficulty.HARD,
                "timeLimitMinutes": 5
            }, {
                "mode": 'blitz',
                "difficulty": MathProblemDifficulty.HARD,
                "timeLimitMinutes": 5
            })
            expect(result).toBeTruthy()
        })

        it('should return false if two settings are not equal', () => {
            const result = gameSettingsAreEqual({
                "mode": 'zen',
                "difficulty": MathProblemDifficulty.HARD,
                "problemsToFinish": 5
            }, {
                "mode": 'blitz',
                "difficulty": MathProblemDifficulty.HARD,
                "timeLimitMinutes": 5
            })
            expect(result).toBeFalsy()
        })

        it('should return false if two settings are not equal', () => {
            const result = gameSettingsAreEqual({
                "mode": 'zen',
                "difficulty": MathProblemDifficulty.HARD,
                "problemsToFinish": 5
            }, {
                "mode": 'zen',
                "difficulty": MathProblemDifficulty.HARD,
                "problemsToFinish": 4
            })
            expect(result).toBeFalsy()
        })
    })
})