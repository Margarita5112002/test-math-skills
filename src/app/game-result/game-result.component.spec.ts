import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/angular"
import { GameResultComponent } from "./game-result.component"
import { GameResult } from "../interfaces/game-result"
import { MathProblemDifficulty } from "../interfaces/math-problem"
import userEvent from '@testing-library/user-event'

describe('Game Result', () => {
    it('should display the total problems and percentage correctly', async () => {
        const gameResult: GameResult = {
            difficulty: MathProblemDifficulty.MID,
            mode: 'zen',
            numProblems: 20,
            timeLimitMinutes: 3,
            timeTakenMinutes: 3,
            tries: 70,
            problemsCounter: {
                MULT: { correct: 10, fail: 1 },
                DIV: { correct: 2, fail: 2 },
                SUB: { correct: 3, fail: 1 },
                ADD: { correct: 5, fail: 10 },
            }
        }
        
        await render(GameResultComponent, {
            inputs: {
                gameResultInput: gameResult
            }
        })

        expect(screen.getByText(/Total problems: 20 \/ 34 \(58.82%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Aditions: 5 \/ 15 \(33.33%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Substractions: 3 \/ 4 \(75%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Multiplications: 10 \/ 11 \(90.91%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Divisions: 2 \/ 4 \(50%\)/)).toBeInTheDocument()

    })

    it('should emit play again when press play again', async () => {
        const playAgainSpy = jest.fn()

        await render(GameResultComponent, {
            on: {
                onPlayAgain: playAgainSpy
            }
        })

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /Play Again/ }))
        expect(playAgainSpy.mock.calls).toHaveLength(1)

    })

    it('should display problems stat even if 0 were problems resolved', async () => {
        const gameResult: GameResult = {
            difficulty: MathProblemDifficulty.MID,
            mode: 'zen',
            numProblems: 18,
            timeLimitMinutes: 3,
            timeTakenMinutes: 3,
            tries: 60,
            problemsCounter: {
                MULT: { correct: 10, fail: 1 },
                DIV: { correct: 0, fail: 0 },
                SUB: { correct: 3, fail: 1 },
                ADD: { correct: 5, fail: 10 },
            }
        }
        
        await render(GameResultComponent, {
            inputs: {
                gameResultInput: gameResult
            }
        })

        expect(screen.getByText(/Total problems: 18 \/ 30 \(60%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Aditions: 5 \/ 15 \(33.33%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Substractions: 3 \/ 4 \(75%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Multiplications: 10 \/ 11 \(90.91%\)/)).toBeInTheDocument()
        expect(screen.getByText(/Divisions: 0 \/ 0 \(100%\)/)).toBeInTheDocument()

    })
})