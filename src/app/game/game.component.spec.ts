import { render, screen } from '@testing-library/angular'
import '@testing-library/jest-dom'
import { GameComponent } from './game.component'
import { MathProblem, MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem'
import { MathProblemService } from '../math-problems/math-problem.service'
import { FormsModule } from '@angular/forms'
import { UserEvent, userEvent } from '@testing-library/user-event'
import { GameSetupSettings } from '../interfaces/game-setup-settings'
import { GameResult } from '../interfaces/game-result'

describe('Game Screen', () => {
    function expectTriesCounterToBe(counterValue: number) {
        expect(screen.getByText(new RegExp(`Tries: ${counterValue}`))).toBeInTheDocument()
    }

    function expectCorrectProblemsCounterToBe(counterValue: number) {
        expect(screen.getByText(new RegExp(`Correct problems: ${counterValue}`))).toBeInTheDocument()
    }

    function expectFailProblemsCounterToBe(counterValue: number) {
        expect(screen.getByText(new RegExp(`Fail problems: ${counterValue}`))).toBeInTheDocument()
    }

    function expectRemainingTriesCounterToBe(counterValue: number) {
        expect(screen.getByText(new RegExp(`Remaining tries for this problem: ${counterValue}`))).toBeInTheDocument()
    }

    it('should display a random math problem', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValue({
            type: MathProblemType.ADD,
            operand1: 8,
            operand2: 12,
            solution: 20,
            difficulty: MathProblemDifficulty.EASY
        })

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/8 \+ 12 =/)).toBeInTheDocument()
    })

    it('should generate a new math problem if answer is correct', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.MULT,
            operand1: 2,
            operand2: 5,
            solution: 10,
            difficulty: MathProblemDifficulty.EASY
        }).mockReturnValueOnce({
            type: MathProblemType.DIV,
            operand1: 10,
            operand2: 5,
            solution: 2,
            difficulty: MathProblemDifficulty.EASY
        })
        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/2 \* 5 =/)).toBeInTheDocument()

        await user.type(screen.getByRole('spinbutton'), '10')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/10 \/ 5 =/)).toBeInTheDocument()
    })

    it('should count if answer a problem correctly', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.MULT,
            operand1: 8,
            operand2: 4,
            solution: 32,
            difficulty: MathProblemDifficulty.EASY
        }).mockReturnValueOnce({
            type: MathProblemType.DIV,
            operand1: 8,
            operand2: 4,
            solution: 2,
            difficulty: MathProblemDifficulty.EASY
        })
        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/8 \* 4 =/)).toBeInTheDocument()
        expectCorrectProblemsCounterToBe(0)

        await user.type(screen.getByRole('spinbutton'), '32')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/8 \/ 4 =/)).toBeInTheDocument()
        expectCorrectProblemsCounterToBe(1)
    })

    it('should count tries if answer a problem incorrectly', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.ADD,
            operand1: 50,
            operand2: 10,
            solution: 60,
            difficulty: MathProblemDifficulty.EASY
        }).mockReturnValueOnce({
            type: MathProblemType.SUB,
            operand1: 10,
            operand2: 5,
            solution: 5,
            difficulty: MathProblemDifficulty.EASY
        })
        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/50 \+ 10 =/)).toBeInTheDocument()
        expectTriesCounterToBe(0)

        await user.type(screen.getByRole('spinbutton'), '50')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/50 \+ 10 =/)).toBeInTheDocument()
        expectTriesCounterToBe(1)
    })

    it('should count a fail problem if answer a problem incorrectly three times', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.ADD,
            operand1: 7,
            operand2: 3,
            solution: 10,
            difficulty: MathProblemDifficulty.EASY
        }).mockReturnValueOnce({
            type: MathProblemType.MULT,
            operand1: 7,
            operand2: 5,
            solution: 35,
            difficulty: MathProblemDifficulty.EASY
        })
        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/7 \+ 3 =/)).toBeInTheDocument()
        expectFailProblemsCounterToBe(0)
        expectRemainingTriesCounterToBe(3)

        await user.type(screen.getByRole('spinbutton'), '50')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/7 \+ 3 =/)).toBeInTheDocument()
        expectFailProblemsCounterToBe(0)
        expectRemainingTriesCounterToBe(2)

        await user.type(screen.getByRole('spinbutton'), '5')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/7 \+ 3 =/)).toBeInTheDocument()
        expectFailProblemsCounterToBe(0)
        expectRemainingTriesCounterToBe(1)

        await user.type(screen.getByRole('spinbutton'), '19')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/7 \+ 3 = 10/)).toBeInTheDocument()
        expectFailProblemsCounterToBe(1)
        expectRemainingTriesCounterToBe(0)

        await user.click(screen.getByRole('button', { name: /Continue/ }))

        expect(screen.getByText(/7 \* 5 =/)).toBeInTheDocument()
        expectRemainingTriesCounterToBe(3)
    })

    it('should hint a lower number if answer a problem incorrectly with a high number', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.SUB,
            operand1: 70,
            operand2: 70,
            solution: 0,
            difficulty: MathProblemDifficulty.EASY
        })

        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/70 - 70 =/)).toBeInTheDocument()

        await user.type(screen.getByRole('spinbutton'), '5')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/Try a lower number/)).toBeInTheDocument()
    })

    it('should hint a higher number if answer a problem incorrectly with a low number', async () => {
        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValueOnce({
            type: MathProblemType.SUB,
            operand1: 50,
            operand2: 70,
            solution: -20,
            difficulty: MathProblemDifficulty.EASY
        })

        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }]
        })

        expect(screen.getByText(/50 - 70 =/)).toBeInTheDocument()

        await user.type(screen.getByRole('spinbutton'), '-50', { initialSelectionStart: 0 })
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/Try a higher number/)).toBeInTheDocument()
    })

    async function answerNextProblemCorrectly(user: UserEvent, problem: MathProblem) {
        await user.clear(screen.getByRole('spinbutton'))
        await user.type(screen.getByRole('spinbutton'), String(problem.solution), { initialSelectionStart: 0 })
        await user.click(screen.getByRole('button', { name: 'Try' }))
    }

    async function answerNextProblemIncorrectly(user: UserEvent, problem: MathProblem) {
        for (let i = 0; i < 3; i++) {
            await user.clear(screen.getByRole('spinbutton'))
            await user.type(screen.getByRole('spinbutton'), String(problem.solution + 1), { initialSelectionStart: 0 })
            await user.click(screen.getByRole('button', { name: 'Try' }))
        }
        await user.click(screen.getByRole('button', { name: 'Continue' }))
    }

    it('should emit game result when answer 10 problems correctly if it is zen mode with 10 problems', async () => {
        const problem: MathProblem = {
            difficulty: MathProblemDifficulty.EASY,
            operand1: 10,
            operand2: 5,
            solution: 50,
            type: MathProblemType.MULT
        }
        const gameSettingsUsed: GameSetupSettings = {
            difficulty: MathProblemDifficulty.EASY,
            mode: 'zen',
            timeLimitMinutes: 3,
            numProblems: 10
        }

        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValue(problem)

        const onGameFinishSpy = jest.fn()

        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }],
            inputs: {
                gameSettings: gameSettingsUsed
            },
            on: {
                onGameFinish: onGameFinishSpy
            }
        })

        for (let i = 0; i < 10; i++)
            await answerNextProblemCorrectly(user, problem)

        const resultExpected: GameResult = {
            ...gameSettingsUsed,
            timeTakenMinutes: gameSettingsUsed.timeLimitMinutes,
            problemsCounter: {
                MULT: { correct: 10, fail: 0 },
                DIV: { correct: 0, fail: 0 },
                SUB: { correct: 0, fail: 0 },
                ADD: { correct: 0, fail: 0 },
            },
            tries: 10
        }
        expect(onGameFinishSpy.mock.calls).toHaveLength(1)
        expect(onGameFinishSpy.mock.calls[0][0]).toStrictEqual(resultExpected)
    })

    it('should emit game result when answer 10 problems correctly but should not count incorrectly answers if it is zen mode with 10 problems', async () => {
        const problem: MathProblem = {
            difficulty: MathProblemDifficulty.EASY,
            operand1: 10,
            operand2: 50,
            solution: -40,
            type: MathProblemType.SUB
        }
        const gameSettingsUsed: GameSetupSettings = {
            difficulty: MathProblemDifficulty.EASY,
            mode: 'zen',
            timeLimitMinutes: 3,
            numProblems: 10
        }

        const getRandomMathProblemSpy = jest.fn()
        getRandomMathProblemSpy.mockReturnValue(problem)

        const onGameFinishSpy = jest.fn()

        const user = userEvent.setup()

        await render(GameComponent, {
            imports: [FormsModule],
            providers: [{
                provide: MathProblemService,
                useValue: { getRandomMathProblem: getRandomMathProblemSpy }
            }],
            inputs: {
                gameSettings: gameSettingsUsed
            },
            on: {
                onGameFinish: onGameFinishSpy
            }
        })

        await answerNextProblemIncorrectly(user, problem)
        for (let i = 0; i < 5; i++)
            await answerNextProblemCorrectly(user, problem)
        await answerNextProblemIncorrectly(user, problem)
        for (let i = 0; i < 5; i++)
            await answerNextProblemCorrectly(user, problem)

        const resultExpected: GameResult = {
            ...gameSettingsUsed,
            timeTakenMinutes: gameSettingsUsed.timeLimitMinutes,
            problemsCounter: {
                MULT: { correct: 0, fail: 0 },
                DIV: { correct: 0, fail: 0 },
                SUB: { correct: 10, fail: 2 },
                ADD: { correct: 0, fail: 0 },
            },
            tries: 16
        }
        expect(onGameFinishSpy.mock.calls).toHaveLength(1)
        expect(onGameFinishSpy.mock.calls[0][0]).toStrictEqual(resultExpected)
    })

})