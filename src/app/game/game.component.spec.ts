import { render, screen } from '@testing-library/angular'
import '@testing-library/jest-dom'
import { GameComponent } from './game.component'
import { MathProblemDifficulty, MathProblemType } from '../interfaces/math-problem'
import { MathProblemService } from '../math-problems/math-problem.service'
import { FormsModule } from '@angular/forms'
import { userEvent } from '@testing-library/user-event'

describe('Game Screen', () => {
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
                useValue: {getRandomMathProblem: getRandomMathProblemSpy}
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
                useValue: {getRandomMathProblem: getRandomMathProblemSpy}
            }]
        })

        expect(screen.getByText(/2 \* 5 =/)).toBeInTheDocument()

        await user.type(screen.getByRole('spinbutton'), '10')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/10 \/ 5 =/)).toBeInTheDocument()
    })

    it('should show the same problem if the answer is wrong', async () => {
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
                useValue: {getRandomMathProblem: getRandomMathProblemSpy}
            }]
        })

        expect(screen.getByText(/2 \* 5 =/)).toBeInTheDocument()

        await user.type(screen.getByRole('spinbutton'), '11')
        await user.click(screen.getByRole('button', { name: 'Try' }))

        expect(screen.getByText(/2 \* 5 =/)).toBeInTheDocument()
    })
})